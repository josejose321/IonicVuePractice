import api from '@/axios'
import { liveQuery } from 'dexie'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { db } from '@/database/AppDataSource'
import type { LocalUser } from '@/database/entities/LocalUser'
import { toast } from '@/utils/toast'

const useUserStore = defineStore('users', () => {
  // ── State ──────────────────────────────────────────────────────────
  /** Visible users (pending_delete records filtered out). */
  const users = shallowRef<LocalUser[]>([])
  const isLoading  = ref(false)
  const isSaving   = ref(false)
  const isSyncing  = ref(false)
  const isOnline   = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const pendingCount  = ref(0)
  const serverPage     = ref(1)
  const serverLastPage = ref(1)

  // ── Live query ─────────────────────────────────────────────────────
  // Mirrors local DB in real-time; pending_delete rows are hidden from the UI
  // but still exist locally until the backend confirms the deletion.
  liveQuery(() =>
    db.users.filter(u => u.syncStatus !== 'pending_delete').toArray()
  ).subscribe({
    next(rows) {
      users.value = rows
      pendingCount.value = rows.filter(u => u.syncStatus !== 'synced').length
    },
    error() { toast.error('Failed to load users.') },
  })

  // ── Online / offline listeners ──────────────────────────────────────
  if (typeof window !== 'undefined') {
    window.addEventListener('online',  () => { isOnline.value = true;  sync() })
    window.addEventListener('offline', () => { isOnline.value = false })
  }

  // ── Actions ────────────────────────────────────────────────────────

  /**
   * Pull a page from the server and upsert into the local DB.
   * Records that have pending local changes are never overwritten.
   */
  async function fetchFromServer(page = 1, append = false): Promise<void> {
    if (!isOnline.value) return
    isLoading.value = true
    try {
      const { data } = await api.get(`api/user?page=${page}`)

      for (const s of data.data as any[]) {
        const existing = await db.users.where('serverId').equals(s.id).first()
        if (!existing) {
          await db.users.add({
            serverId:   s.id,
            name:       s.name,
            email:      s.email,
            avatar:     s.avatar ?? null,
            created_at: s.created_at,
            updated_at: s.updated_at,
            syncStatus: 'synced',
          })
        } else if (existing.syncStatus === 'synced') {
          // Safe to overwrite — no pending local changes
          await db.users.update(existing.localId!, {
            name:       s.name,
            email:      s.email,
            avatar:     s.avatar ?? null,
            updated_at: s.updated_at,
          })
        }
        // pending_create / pending_update / pending_delete → local wins
      }

      serverPage.value     = data.current_page
      serverLastPage.value = data.last_page
    } catch {
      // Network failure — serve from local DB silently
    } finally {
      isLoading.value = false
    }
  }

  /** Persist a new user to the local DB; sync immediately if online. */
  async function createUser(name: string, email: string, password: string): Promise<boolean> {
    isSaving.value = true
    try {
      await db.users.add({
        serverId:   null,
        name,
        email,
        _password:  password,
        avatar:     null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        syncStatus: 'pending_create',
      })
      if (isOnline.value) await sync()
      else toast.success('Saved offline — will sync when back online.')
      return true
    } catch {
      toast.error('Failed to save user.')
      return false
    } finally {
      isSaving.value = false
    }
  }

  /** Update a user in the local DB; sync immediately if online. */
  async function updateUser(localId: number, name: string, email: string): Promise<boolean> {
    isSaving.value = true
    try {
      const user = await db.users.get(localId)
      if (!user) return false
      // Keep pending_create so the next sync uses POST, not PUT
      const nextStatus = user.syncStatus === 'pending_create' ? 'pending_create' : 'pending_update'
      await db.users.update(localId, {
        name,
        email,
        updated_at: new Date().toISOString(),
        syncStatus: nextStatus,
      })
      if (isOnline.value) await sync()
      else toast.success('Updated offline — will sync when back online.')
      return true
    } catch {
      toast.error('Failed to update user.')
      return false
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Delete a user.
   * - If never synced (pending_create) → remove from local DB immediately.
   * - Otherwise → mark pending_delete; sync will remove from backend then local.
   */
  async function deleteUser(localId: number): Promise<void> {
    try {
      const user = await db.users.get(localId)
      if (!user) return
      if (user.syncStatus === 'pending_create') {
        await db.users.delete(localId)
        toast.success('User removed.')
      } else {
        await db.users.update(localId, { syncStatus: 'pending_delete' })
        if (isOnline.value) await sync()
        else toast.success('Deletion queued — will sync when back online.')
      }
    } catch {
      toast.error('Failed to delete user.')
    }
  }

  /**
   * Push every pending change to the server.
   * On confirmed backend delete → removes the record from local DB too.
   */
  async function sync(): Promise<void> {
    if (!isOnline.value || isSyncing.value) return
    isSyncing.value = true
    let synced = 0
    let failed  = 0
    try {
      const pending = await db.users
        .filter(u => u.syncStatus !== 'synced')
        .toArray()

      for (const user of pending) {
        try {
          if (user.syncStatus === 'pending_create') {
            const { data } = await api.post('api/user', {
              name:     user.name,
              email:    user.email,
              password: user._password ?? '',
            })
            // Update local record with server ID; wipe the temp password
            await db.users.update(user.localId!, {
              serverId:  data.id,
              syncStatus: 'synced',
              _password:  undefined,
            })
            synced++

          } else if (user.syncStatus === 'pending_update' && user.serverId) {
            await api.put(`api/user/${user.serverId}`, {
              name:  user.name,
              email: user.email,
            })
            await db.users.update(user.localId!, { syncStatus: 'synced' })
            synced++

          } else if (user.syncStatus === 'pending_delete' && user.serverId) {
            await api.delete(`api/user/${user.serverId}`)
            // Backend confirmed — remove from local DB entirely
            await db.users.delete(user.localId!)
            synced++
          }
        } catch {
          failed++   // Leave in pending state; retry on next sync
        }
      }

      if (synced > 0) toast.success(`Synced ${synced} change${synced > 1 ? 's' : ''}.`)
      if (failed > 0) toast.warning(`${failed} change${failed > 1 ? 's' : ''} could not sync — will retry.`)
    } finally {
      isSyncing.value = false
    }
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return {
    users,
    isLoading,
    isSaving,
    isSyncing,
    isOnline,
    pendingCount,
    serverPage,
    serverLastPage,
    fetchFromServer,
    createUser,
    updateUser,
    deleteUser,
    sync,
  }
})

export default useUserStore

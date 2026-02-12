export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'

export interface LocalUser {
  localId?: number          // Dexie auto-increment primary key
  serverId: number | null   // Server-assigned ID; null until first successful sync
  name: string
  email: string
  /** Stored only for pending_create records; cleared from local DB after sync. */
  _password?: string
  avatar: string | null
  created_at: string
  updated_at: string
  syncStatus: SyncStatus
}

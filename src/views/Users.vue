<template>
  <ion-page>
    <!-- ── Header ─────────────────────────────────────────────────── -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon :icon="peopleOutline" aria-hidden="true" />
          Users
        </ion-title>
        <ion-buttons slot="end">
          <!-- Pending sync badge -->
          <ion-button v-if="userStore.pendingCount > 0" @click="userStore.sync()">
            <ion-badge color="warning" class="pending-badge">
              {{ userStore.pendingCount }}
            </ion-badge>
            <ion-icon :icon="userStore.isSyncing ? syncOutline : cloudUploadOutline" />
          </ion-button>
          <!-- Online / offline chip -->
          <ion-chip
            :color="userStore.isOnline ? 'success' : 'warning'"
            class="status-chip"
            @click="userStore.isOnline && userStore.sync()"
          >
            <ion-icon :icon="userStore.isOnline ? cloudDoneOutline : cloudOfflineOutline" />
            <ion-label>{{ userStore.isOnline ? 'Online' : 'Offline' }}</ion-label>
          </ion-chip>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar>
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Search by name or email…"
          :animated="true"
          :debounce="250"
          @ion-clear="searchQuery = ''"
        />
      </ion-toolbar>
    </ion-header>

    <!-- ── Content ────────────────────────────────────────────────── -->
    <ion-content :fullscreen="true">
      <!-- Large title collapse (iOS) -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Users
            <ion-badge color="medium" class="title-badge">{{ userStore.users.length }}</ion-badge>
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Pull-to-refresh -->
      <ion-refresher slot="fixed" @ionRefresh="onRefresh($event)">
        <ion-refresher-content
          pulling-icon="chevronDownCircleOutline"
          refreshing-spinner="crescent"
          refreshing-text="Syncing…"
        />
      </ion-refresher>

      <!-- ── Loading skeleton ────────────────────────────────────── -->
      <ion-list v-if="userStore.isLoading && userStore.users.length === 0" lines="full">
        <ion-item v-for="n in 6" :key="n">
          <ion-avatar slot="start">
            <ion-skeleton-text :animated="true" />
          </ion-avatar>
          <ion-label>
            <h2><ion-skeleton-text :animated="true" style="width: 55%" /></h2>
            <p><ion-skeleton-text :animated="true" style="width: 80%" /></p>
            <p><ion-skeleton-text :animated="true" style="width: 35%" /></p>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- ── Empty state ─────────────────────────────────────────── -->
      <div
        v-else-if="filteredUsers.length === 0 && !userStore.isLoading"
        class="empty-state"
      >
        <ion-icon :icon="peopleOutline" class="empty-icon" />
        <ion-text color="medium">
          <p>{{ searchQuery ? 'No users match your search.' : 'No users yet. Tap + to add one.' }}</p>
        </ion-text>
        <ion-button
          v-if="!userStore.isOnline"
          fill="outline"
          color="warning"
          size="small"
          class="ion-margin-top"
          @click="userStore.sync()"
        >
          <ion-icon slot="start" :icon="cloudUploadOutline" />
          Retry sync
        </ion-button>
      </div>

      <!-- ── User list ───────────────────────────────────────────── -->
      <ion-list v-else lines="full">
        <ion-item-sliding
          v-for="user in filteredUsers"
          :key="user.localId"
          :ref="el => slidingRefs[user.localId!] = el as any"
        >
          <!-- Swipe left → Edit -->
          <ion-item-options side="start">
            <ion-item-option
              color="primary"
              expandable
              @click="openModal(user); closeSlidingItem(user.localId!)"
            >
              <ion-icon slot="icon-only" :icon="createOutline" />
            </ion-item-option>
          </ion-item-options>

          <!-- Main row -->
          <ion-item button :detail="false" @click="openModal(user)">
            <div
              slot="start"
              class="user-avatar"
              :style="{ background: getAvatarColor(user.localId ?? 0) }"
            >
              {{ getInitials(user.name) }}
            </div>

            <ion-label>
              <h2 class="user-name">{{ user.name }}</h2>
              <p>
                <ion-icon :icon="mailOutline" class="inline-icon" />
                {{ user.email }}
              </p>
              <p class="meta-line">
                <ion-icon :icon="calendarOutline" class="inline-icon" />
                {{ formatDate(user.created_at) }}
              </p>
            </ion-label>

            <!-- Sync status indicator -->
            <ion-note slot="end" :color="getSyncColor(user.syncStatus)" class="sync-note">
              <ion-icon :icon="getSyncIcon(user.syncStatus)" />
            </ion-note>
          </ion-item>

          <!-- Swipe right → Delete -->
          <ion-item-options side="end">
            <ion-item-option
              color="danger"
              expandable
              @click="confirmDelete(user); closeSlidingItem(user.localId!)"
            >
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- ── Infinite scroll (loads more pages from server) ─────── -->
      <ion-infinite-scroll
        :disabled="isInfiniteDisabled"
        @ionInfinite="loadMore($event)"
      >
        <ion-infinite-scroll-content
          loading-text="Loading more…"
          loading-spinner="crescent"
        />
      </ion-infinite-scroll>

      <!-- ── FAB ────────────────────────────────────────────────── -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button color="primary" @click="openModal(null)">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <!-- ── Create / Edit modal ────────────────────────────────────── -->
    <ion-modal :is-open="showModal" @did-dismiss="closeModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button @click="closeModal">
              <ion-icon slot="icon-only" :icon="closeOutline" />
            </ion-button>
          </ion-buttons>
          <ion-title>{{ editingUser ? 'Edit User' : 'New User' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button
              strong
              :disabled="userStore.isSaving || !isFormValid"
              @click="submitForm"
            >
              <ion-spinner v-if="userStore.isSaving" name="crescent" />
              <span v-else>{{ editingUser ? 'Save' : 'Create' }}</span>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Live avatar preview -->
        <div class="modal-avatar-wrap">
          <div
            class="user-avatar avatar-lg"
            :style="{ background: editingUser ? getAvatarColor(editingUser.localId ?? 0) : '#64748b' }"
          >
            {{ form.name ? getInitials(form.name) : '?' }}
          </div>
          <ion-text class="avatar-preview-text">
            <h3>{{ form.name || 'New User' }}</h3>
            <p>{{ form.email || 'email@example.com' }}</p>
          </ion-text>
        </div>

        <!-- Offline notice in modal -->
        <ion-note v-if="!userStore.isOnline" color="warning" class="offline-note">
          <ion-icon :icon="cloudOfflineOutline" />
          You're offline — changes will sync automatically when back online.
        </ion-note>

        <!-- Form fields -->
        <ion-list inset>
          <ion-item>
            <ion-input
              v-model="form.name"
              label="Full Name"
              label-placement="stacked"
              placeholder="e.g. John Doe"
              :clear-input="true"
              autocomplete="name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-input
              v-model="form.email"
              type="email"
              label="Email"
              label-placement="stacked"
              placeholder="user@example.com"
              :clear-input="true"
              autocomplete="email"
              required
            />
          </ion-item>

          <ion-item v-if="!editingUser">
            <ion-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              label-placement="stacked"
              placeholder="••••••••"
              required
            />
            <ion-button
              slot="end"
              fill="clear"
              color="medium"
              class="pw-toggle"
              @click="showPassword = !showPassword"
            >
              <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
            </ion-button>
          </ion-item>
        </ion-list>

        <div class="ion-padding">
          <ion-button
            expand="block"
            color="primary"
            :disabled="userStore.isSaving || !isFormValid"
            @click="submitForm"
          >
            <ion-spinner v-if="userStore.isSaving" name="crescent" class="ion-margin-end" />
            <ion-icon
              v-else
              :icon="editingUser ? checkmarkOutline : personAddOutline"
              slot="start"
            />
            {{ editingUser ? 'Save Changes' : 'Create User' }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- ── Delete alert ───────────────────────────────────────────── -->
    <ion-alert
      :is-open="showDeleteAlert"
      header="Delete User"
      :message="`Remove ${pendingDelete?.name ?? 'this user'}? This cannot be undone.`"
      :buttons="deleteAlertButtons"
      @did-dismiss="showDeleteAlert = false"
    />
  </ion-page>
</template>

<script setup lang="ts">
import useUserStore from '@/store/userStore'
import type { LocalUser, SyncStatus } from '@/database/entities/LocalUser'
import {
  IonAlert,
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue'
import {
  addOutline,
  calendarOutline,
  checkmarkOutline,
  cloudDoneOutline,
  cloudOfflineOutline,
  cloudUploadOutline,
  closeOutline,
  createOutline,
  eyeOffOutline,
  eyeOutline,
  mailOutline,
  peopleOutline,
  personAddOutline,
  syncOutline,
  trashOutline,
} from 'ionicons/icons'
import { computed, ref } from 'vue'

const userStore = useUserStore()

// ── Search ────────────────────────────────────────────────────────────
const searchQuery = ref('')
const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return userStore.users
  return userStore.users.filter(
    u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

// ── Infinite scroll ───────────────────────────────────────────────────
const isInfiniteDisabled = computed(
  () => !userStore.isOnline || userStore.serverPage >= userStore.serverLastPage
)

async function loadMore(ev: CustomEvent) {
  await userStore.fetchFromServer(userStore.serverPage + 1, true)
  ;(ev.target as HTMLIonInfiniteScrollElement).complete()
}

// ── Pull to refresh ───────────────────────────────────────────────────
async function onRefresh(ev: CustomEvent) {
  await userStore.fetchFromServer(1)
  ;(ev.target as HTMLIonRefresherElement).complete()
}

// ── Lifecycle ─────────────────────────────────────────────────────────
onIonViewWillEnter(async () => {
  await userStore.fetchFromServer(1)
})

// ── Sliding item refs (for programmatic close) ────────────────────────
const slidingRefs: Record<number, InstanceType<typeof IonItemSliding>> = {}
function closeSlidingItem(localId: number) {
  slidingRefs[localId]?.close?.()
}

// ── Modal ─────────────────────────────────────────────────────────────
const showModal    = ref(false)
const editingUser  = ref<LocalUser | null>(null)
const form         = ref({ name: '', email: '', password: '' })
const showPassword = ref(false)

const isFormValid = computed(() => {
  if (!form.value.name.trim() || !form.value.email.trim()) return false
  if (!editingUser.value && !form.value.password.trim()) return false
  return true
})

function openModal(user: LocalUser | null) {
  editingUser.value = user
  form.value = user
    ? { name: user.name, email: user.email, password: '' }
    : { name: '', email: '', password: '' }
  showPassword.value = false
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingUser.value = null
  showPassword.value = false
}

async function submitForm() {
  if (!isFormValid.value) return
  let ok: boolean
  if (editingUser.value) {
    ok = await userStore.updateUser(editingUser.value.localId!, form.value.name, form.value.email)
  } else {
    ok = await userStore.createUser(form.value.name, form.value.email, form.value.password)
  }
  if (ok) closeModal()
}

// ── Delete confirm ────────────────────────────────────────────────────
const showDeleteAlert = ref(false)
const pendingDelete   = ref<LocalUser | null>(null)

function confirmDelete(user: LocalUser) {
  pendingDelete.value = user
  showDeleteAlert.value = true
}

const deleteAlertButtons = [
  { text: 'Cancel', role: 'cancel' },
  {
    text: 'Delete',
    role: 'confirm',
    handler: async () => {
      if (pendingDelete.value) {
        await userStore.deleteUser(pendingDelete.value.localId!)
        pendingDelete.value = null
      }
    },
  },
]

// ── Avatar helpers ────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
]

function getAvatarColor(seed: number): string {
  return AVATAR_COLORS[seed % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase() || '?'
}

// ── Sync status helpers ───────────────────────────────────────────────
function getSyncColor(status: SyncStatus): string {
  if (status === 'synced')         return 'success'
  if (status === 'pending_delete') return 'danger'
  return 'warning'
}

function getSyncIcon(status: SyncStatus): string {
  if (status === 'synced')         return cloudDoneOutline
  if (status === 'pending_create') return cloudUploadOutline
  if (status === 'pending_update') return syncOutline
  return trashOutline
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
/* ── Avatar ─────────────────────────────────────────────────────── */
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  flex-shrink: 0;
}

.avatar-lg {
  width: 72px;
  height: 72px;
  font-size: 26px;
}

/* ── Modal avatar preview ───────────────────────────────────────── */
.modal-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px 8px;
}

.avatar-preview-text {
  text-align: center;
}

.avatar-preview-text h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.avatar-preview-text p {
  margin: 0;
  font-size: 13px;
  color: var(--ion-color-medium);
}

/* ── Offline notice in modal ────────────────────────────────────── */
.offline-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  margin: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  background-color: color-mix(in srgb, var(--ion-color-warning) 15%, transparent);
}

.offline-note ion-icon { flex-shrink: 0; margin-top: 1px; }

/* ── Empty state ────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
  opacity: 0.4;
  margin-bottom: 16px;
}

/* ── List row ───────────────────────────────────────────────────── */
.user-name { font-weight: 600; }

.meta-line,
ion-item p {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.inline-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.sync-note {
  font-size: 18px;
  display: flex;
  align-items: center;
}

/* ── Header chips / badges ──────────────────────────────────────── */
.status-chip {
  height: 28px;
  font-size: 11px;
  margin-right: 4px;
  --background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.pending-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 9px;
  min-width: 16px;
  height: 16px;
}

.title-badge {
  margin-left: 6px;
  font-size: 11px;
  vertical-align: middle;
}

.pw-toggle {
  align-self: flex-end;
  margin-bottom: 4px;
}
</style>

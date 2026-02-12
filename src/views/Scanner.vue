<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon aria-hidden="true" :icon="qrCode"></ion-icon>
          Scanner
        </ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="scannerStore.scannedItems.length > 0" @click="confirmClearAll">
            <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Scanner</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">

        <!-- Scan Button -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>QR &amp; Barcode Scanner</ion-card-title>
            <ion-card-subtitle>
              Offline — results are saved locally on device
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>

            <!-- Native platform: full scanner button -->
            <template v-if="scannerStore.isSupported">
              <!-- Permission permanently denied: guide user to device settings -->
              <ion-note
                v-if="permissionStore.permissions.camera === 'denied'"
                color="danger"
                class="perm-note"
              >
                <ion-icon :icon="cameraOutline"></ion-icon>
                Camera access was denied. Enable it in Settings &gt; Privacy &gt; Camera, then try again.
              </ion-note>

              <ion-button
                expand="block"
                color="primary"
                :disabled="scannerStore.isScanning"
                @click="scannerStore.scan()"
              >
                <ion-icon slot="start" :icon="scanOutline"></ion-icon>
                <ion-spinner v-if="scannerStore.isScanning" name="crescent" class="ion-margin-end"></ion-spinner>
                <span>{{ scannerStore.isScanning ? 'Scanning…' : 'Scan Code' }}</span>
              </ion-button>
            </template>

            <!-- Web / unsupported: manual entry fallback -->
            <template v-else>
              <ion-note color="warning" class="web-note">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
                Native scanning requires an iOS or Android device.
                Use manual entry below to test offline storage.
              </ion-note>

              <div class="manual-entry">
                <ion-item>
                  <ion-label position="stacked">Value</ion-label>
                  <ion-input
                    v-model="manualValue"
                    placeholder="e.g. https://example.com"
                    clearInput
                    label=""
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Format</ion-label>
                  <ion-select v-model="manualFormat" interface="popover">
                    <ion-select-option value="QR_CODE">QR Code</ion-select-option>
                    <ion-select-option value="CODE_128">Code 128</ion-select-option>
                    <ion-select-option value="CODE_39">Code 39</ion-select-option>
                    <ion-select-option value="EAN_13">EAN-13</ion-select-option>
                    <ion-select-option value="EAN_8">EAN-8</ion-select-option>
                    <ion-select-option value="UPC_A">UPC-A</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-button
                  expand="block"
                  color="secondary"
                  class="ion-margin-top"
                  :disabled="!manualValue.trim()"
                  @click="saveManual"
                >
                  <ion-icon slot="start" :icon="saveOutline"></ion-icon>
                  Save Entry
                </ion-button>
              </div>
            </template>
          </ion-card-content>
        </ion-card>

        <!-- Scan History -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Scan History</ion-card-title>
            <ion-card-subtitle>{{ scannerStore.scannedItems.length }} item(s) stored offline</ion-card-subtitle>
          </ion-card-header>

          <!-- Loading Skeleton -->
          <ion-list v-if="scannerStore.isLoading">
            <ion-item v-for="n in 3" :key="n">
              <ion-label>
                <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
                <p><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></p>
              </ion-label>
            </ion-item>
          </ion-list>

          <!-- Empty State -->
          <ion-card-content v-else-if="scannerStore.scannedItems.length === 0" class="empty-state">
            <ion-icon :icon="qrCode" class="empty-icon"></ion-icon>
            <p>No scans yet. Tap <strong>Scan Code</strong> to get started.</p>
          </ion-card-content>

          <!-- History List -->
          <ion-list v-else>
            <ion-item-sliding v-for="item in scannerStore.scannedItems" :key="item.id">
              <ion-item>
                <ion-icon :icon="barcodeOutline" slot="start" color="primary"></ion-icon>
                <ion-label>
                  <h3 class="scan-value">{{ item.rawValue }}</h3>
                  <p>{{ item.format }} &bull; {{ formatDate(item.scannedAt) }}</p>
                  <p v-if="item.label" class="scan-label">{{ item.label }}</p>
                </ion-label>
              </ion-item>

              <!-- Swipe-to-delete -->
              <ion-item-options side="end">
                <ion-item-option color="danger" expandable @click="scannerStore.deleteItem(item.id!)">
                  <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </ion-list>
        </ion-card>
      </div>

      <!-- Confirm clear-all alert -->
      <ion-alert
        :is-open="showClearAlert"
        header="Clear History"
        message="Delete all scanned items from local storage?"
        :buttons="clearAlertButtons"
        @did-dismiss="showClearAlert = false"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useScannerStore from '@/store/scannerStore'
import usePermissionStore from '@/store/permissionStore'
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue'
// liveQuery in the store keeps scannedItems in sync automatically.
import {
  barcodeOutline,
  cameraOutline,
  informationCircleOutline,
  qrCode,
  saveOutline,
  scanOutline,
  trashOutline,
} from 'ionicons/icons'
import { ref } from 'vue'

const scannerStore = useScannerStore()
const permissionStore = usePermissionStore()

const manualValue = ref('')
const manualFormat = ref('QR_CODE')
const showClearAlert = ref(false)

const clearAlertButtons = [
  { text: 'Cancel', role: 'cancel' },
  { text: 'Clear All', role: 'confirm', handler: () => scannerStore.clearAll() },
]

// checkSupport on every enter so permission state stays fresh.
onIonViewWillEnter(() => scannerStore.checkSupport())

async function saveManual() {
  const value = manualValue.value.trim()
  if (!value) return
  await scannerStore.saveItem(value, manualFormat.value)
  manualValue.value = ''
}

function confirmClearAll() {
  showClearAlert.value = true
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.web-note,
.perm-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}

.web-note {
  background-color: color-mix(in srgb, var(--ion-color-warning) 15%, transparent);
}

.perm-note {
  background-color: color-mix(in srgb, var(--ion-color-danger) 15%, transparent);
}

.web-note ion-icon,
.perm-note ion-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.manual-entry {
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: var(--ion-color-medium);
  text-align: center;
  gap: 8px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

.scan-value {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scan-label {
  font-style: italic;
  color: var(--ion-color-medium);
}
</style>

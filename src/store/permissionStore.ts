import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { Capacitor } from '@capacitor/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Shared state values for every Capacitor permission type. */
export type PermissionState = 'unknown' | 'prompt' | 'granted' | 'limited' | 'denied'

/**
 * All permission types the app may ever request.
 *
 * Installed now:
 *   camera              — @capacitor-mlkit/barcode-scanning
 *
 * Install to enable (add the plugin, then uncomment the matching
 * cases in checkPermission / requestPermission):
 *   microphone          — @capacitor-community/speech-recognition  (or recording plugin)
 *   location            — @capacitor/geolocation
 *   locationBackground  — @capacitor/geolocation  (requires foreground location first)
 *   photos              — @capacitor/camera
 *   notifications       — @capacitor/local-notifications  or  @capacitor/push-notifications
 *   contacts            — @capacitor-community/contacts
 *   storage             — @capacitor/filesystem
 *   bluetooth           — @capacitor-community/bluetooth-le
 *   nfc                 — @capacitor-community/nfc
 *   biometric           — @capacitor-community/biometric-auth
 */
export type PermissionType =
  | 'camera'
  | 'microphone'
  | 'location'
  | 'locationBackground'
  | 'photos'
  | 'notifications'
  | 'contacts'
  | 'storage'
  | 'bluetooth'
  | 'nfc'
  | 'biometric'

const usePermissionStore = defineStore('permissions', () => {
  // ── State ──────────────────────────────────────────────────────────
  const permissions = ref<Record<PermissionType, PermissionState>>({
    camera: 'unknown',
    microphone: 'unknown',
    location: 'unknown',
    locationBackground: 'unknown',
    photos: 'unknown',
    notifications: 'unknown',
    contacts: 'unknown',
    storage: 'unknown',
    bluetooth: 'unknown',
    nfc: 'unknown',
    biometric: 'unknown',
  })

  // ── Actions ────────────────────────────────────────────────────────

  /**
   * Query the OS for the current permission state WITHOUT prompting the user.
   * Call on page enter to sync UI before any interaction.
   */
  async function checkPermission(type: PermissionType): Promise<void> {
    if (!Capacitor.isNativePlatform()) return
    switch (type) {
      case 'camera': {
        const { camera } = await BarcodeScanner.checkPermissions()
        permissions.value.camera = camera as PermissionState
        break
      }
      // ── Uncomment each block when the corresponding plugin is installed ──

      // case 'microphone': {
      //   const { microphone } = await SpeechRecognition.checkPermissions()
      //   permissions.value.microphone = microphone as PermissionState
      //   break
      // }

      // case 'location': {
      //   const { location } = await Geolocation.checkPermissions()
      //   permissions.value.location = location as PermissionState
      //   break
      // }

      // case 'locationBackground': {
      //   // iOS: same as location; Android: coarseLocation vs backgroundLocation
      //   const { coarseLocation } = await Geolocation.checkPermissions()
      //   permissions.value.locationBackground = coarseLocation as PermissionState
      //   break
      // }

      // case 'photos': {
      //   const { photos } = await Camera.checkPermissions()
      //   permissions.value.photos = photos as PermissionState
      //   break
      // }

      // case 'notifications': {
      //   const { display } = await LocalNotifications.checkPermissions()
      //   permissions.value.notifications = display as PermissionState
      //   break
      // }

      // case 'contacts': {
      //   const { contacts } = await Contacts.checkPermissions()
      //   permissions.value.contacts = contacts as PermissionState
      //   break
      // }

      // case 'storage': {
      //   const { publicStorage } = await Filesystem.checkPermissions()
      //   permissions.value.storage = publicStorage as PermissionState
      //   break
      // }

      // case 'bluetooth': {
      //   const { bluetooth } = await BleClient.checkPermissions()
      //   permissions.value.bluetooth = bluetooth as PermissionState
      //   break
      // }

      // case 'nfc': {
      //   // NFC availability check — no Capacitor checkPermissions() API yet;
      //   // use Capacitor.Plugins.NFC.isEnabled() when the plugin supports it.
      //   break
      // }

      // case 'biometric': {
      //   const { biometry } = await BiometricAuth.checkBiometry()
      //   permissions.value.biometric = biometry.isAvailable ? 'granted' : 'denied'
      //   break
      // }
    }
  }

  /**
   * Prompt the user to grant the given permission.
   * Returns the resulting state so callers can act immediately.
   */
  async function requestPermission(type: PermissionType): Promise<PermissionState> {
    if (!Capacitor.isNativePlatform()) return 'denied'
    switch (type) {
      case 'camera': {
        const { camera } = await BarcodeScanner.requestPermissions()
        permissions.value.camera = camera as PermissionState
        return permissions.value.camera
      }
      // ── Uncomment each block when the corresponding plugin is installed ──

      // case 'microphone': {
      //   const { microphone } = await SpeechRecognition.requestPermissions()
      //   permissions.value.microphone = microphone as PermissionState
      //   return permissions.value.microphone
      // }

      // case 'location': {
      //   const { location } = await Geolocation.requestPermissions({ permissions: ['location'] })
      //   permissions.value.location = location as PermissionState
      //   return permissions.value.location
      // }

      // case 'locationBackground': {
      //   const { coarseLocation } = await Geolocation.requestPermissions({ permissions: ['coarseLocation'] })
      //   permissions.value.locationBackground = coarseLocation as PermissionState
      //   return permissions.value.locationBackground
      // }

      // case 'photos': {
      //   const { photos } = await Camera.requestPermissions({ permissions: ['photos'] })
      //   permissions.value.photos = photos as PermissionState
      //   return permissions.value.photos
      // }

      // case 'notifications': {
      //   const { display } = await LocalNotifications.requestPermissions()
      //   permissions.value.notifications = display as PermissionState
      //   return permissions.value.notifications
      // }

      // case 'contacts': {
      //   const { contacts } = await Contacts.requestPermissions()
      //   permissions.value.contacts = contacts as PermissionState
      //   return permissions.value.contacts
      // }

      // case 'storage': {
      //   const { publicStorage } = await Filesystem.requestPermissions()
      //   permissions.value.storage = publicStorage as PermissionState
      //   return permissions.value.storage
      // }

      // case 'bluetooth': {
      //   const { bluetooth } = await BleClient.requestPermissions()
      //   permissions.value.bluetooth = bluetooth as PermissionState
      //   return permissions.value.bluetooth
      // }

      // case 'nfc': {
      //   // NFC is enabled/disabled system-wide; direct user to Settings.
      //   return permissions.value.nfc
      // }

      // case 'biometric': {
      //   // Biometric auth is checked, not "requested" — enroll via device Settings.
      //   return permissions.value.biometric
      // }

      default:
        return 'unknown'
    }
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return { permissions, checkPermission, requestPermission }
})

export default usePermissionStore

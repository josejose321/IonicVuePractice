import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { Capacitor } from '@capacitor/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Shared state values for all Capacitor permission types. */
export type PermissionState = 'unknown' | 'prompt' | 'granted' | 'limited' | 'denied'

/**
 * Every permission type the app may ever request.
 * Add a new entry here alongside its plugin implementation below.
 *
 * Installed now:
 *   camera        — @capacitor-mlkit/barcode-scanning
 *
 * Install to enable (uncomment the matching cases in checkPermission /
 * requestPermission when the plugin is added):
 *   microphone    — @capacitor/microphone (or your recording plugin)
 *   location      — @capacitor/geolocation
 *   photos        — @capacitor/camera
 *   notifications — @capacitor/local-notifications
 */
export type PermissionType = 'camera' | 'microphone' | 'location' | 'photos' | 'notifications'

const usePermissionStore = defineStore('permissions', () => {
  // ── State ──────────────────────────────────────────────────────────
  const permissions = ref<Record<PermissionType, PermissionState>>({
    camera: 'unknown',
    microphone: 'unknown',
    location: 'unknown',
    photos: 'unknown',
    notifications: 'unknown',
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
      // ── Uncomment when the corresponding plugin is installed ────────
      // case 'location': {
      //   const { location } = await Geolocation.checkPermissions()
      //   permissions.value.location = location as PermissionState
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
      // ── Uncomment when the corresponding plugin is installed ────────
      // case 'location': {
      //   const { location } = await Geolocation.requestPermissions()
      //   permissions.value.location = location as PermissionState
      //   return permissions.value.location
      // }
      // case 'photos': {
      //   const { photos } = await Camera.requestPermissions()
      //   permissions.value.photos = photos as PermissionState
      //   return permissions.value.photos
      // }
      // case 'notifications': {
      //   const { display } = await LocalNotifications.requestPermissions()
      //   permissions.value.notifications = display as PermissionState
      //   return permissions.value.notifications
      // }
      default:
        return 'unknown'
    }
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return { permissions, checkPermission, requestPermission }
})

export default usePermissionStore

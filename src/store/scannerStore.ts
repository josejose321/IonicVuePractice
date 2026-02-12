import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning'
import { Capacitor } from '@capacitor/core'
import { liveQuery } from 'dexie'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { db } from '@/database/AppDataSource'
import type { ScannedItem } from '@/database/entities/ScannedItem'
import { toast } from '@/utils/toast'
import usePermissionStore from '@/store/permissionStore'

const useScannerStore = defineStore('scanner', () => {
  const permStore = usePermissionStore()

  // ── State ──────────────────────────────────────────────────────────
  const scannedItems = shallowRef<ScannedItem[]>([])
  const isScanning = ref(false)
  const isLoading = ref(true)
  const isSupported = ref(false)

  // ── Live query ─────────────────────────────────────────────────────
  // liveQuery() returns a Dexie Observable that re-emits whenever the
  // underlying IndexedDB table changes (add / put / delete / clear).
  // We subscribe once per store instance so every write automatically
  // updates scannedItems — no manual fetchItems() calls needed.
  liveQuery(() =>
    db.scannedItems.orderBy('scannedAt').reverse().toArray()
  ).subscribe({
    next(rows) {
      scannedItems.value = rows
      isLoading.value = false
    },
    error() {
      toast.error('Failed to load scan history.')
      isLoading.value = false
    },
  })

  // ── Actions ────────────────────────────────────────────────────────

  /** Check if barcode scanning is supported on this device/platform. */
  async function checkSupport(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      isSupported.value = false
      return
    }
    const { supported } = await BarcodeScanner.isSupported()
    isSupported.value = supported
    if (supported) await permStore.checkPermission('camera')
  }

  /** Request camera permission and launch the native barcode scanner. */
  async function scan(): Promise<void> {
    if (!isSupported.value) {
      toast.warning('Barcode scanning is only available on native mobile devices.')
      return
    }

    const state = await permStore.requestPermission('camera')
    if (state !== 'granted' && state !== 'limited') {
      toast.error('Camera permission is required to scan barcodes.')
      return
    }

    isScanning.value = true
    try {
      const { barcodes } = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE,
          BarcodeFormat.DataMatrix,
          BarcodeFormat.Pdf417,
          BarcodeFormat.Aztec,
        ],
      })

      for (const barcode of barcodes) {
        await saveItem(barcode.rawValue ?? '', barcode.format ?? 'Unknown')
      }

      if (barcodes.length > 0) {
        toast.success(`Scanned: ${barcodes[0].rawValue}`)
      }
    } catch (err) {
      const message = (err as Error).message ?? ''
      if (!message.toLowerCase().includes('cancel')) {
        toast.error('Scan failed. Please try again.')
      }
    } finally {
      isScanning.value = false
    }
  }

  /** Persist a scanned barcode — liveQuery pushes the update automatically. */
  async function saveItem(rawValue: string, format: string, label: string | null = null): Promise<void> {
    await db.scannedItems.add({ rawValue, format, label, scannedAt: new Date() })
  }

  /** Delete a single item — liveQuery reflects the removal automatically. */
  async function deleteItem(id: number): Promise<void> {
    await db.scannedItems.delete(id)
    toast.success('Item removed.')
  }

  /** Wipe all scanned items — liveQuery clears the list automatically. */
  async function clearAll(): Promise<void> {
    await db.scannedItems.clear()
    toast.success('Scan history cleared.')
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return {
    scannedItems,
    isScanning,
    isLoading,
    isSupported,
    checkSupport,
    scan,
    saveItem,
    deleteItem,
    clearAll,
  }
})

export default useScannerStore

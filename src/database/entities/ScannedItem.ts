/**
 * ScannedItem — a single QR / barcode scan result stored locally (IndexedDB).
 *
 * No decorators needed: Dexie uses plain TypeScript interfaces.
 */
export interface ScannedItem {
  id?: number          // auto-incremented primary key (optional on insert)
  rawValue: string     // decoded payload (URL, product code, text, …)
  format: string       // barcode format, e.g. "QR_CODE", "CODE_128"
  label: string | null // optional user-editable label
  scannedAt: Date      // insertion timestamp
}

import Dexie, { type Table } from 'dexie'
import type { ScannedItem } from './entities/ScannedItem'

/**
 * AppDatabase — Dexie-backed IndexedDB database.
 *
 * Why Dexie instead of TypeORM + Capacitor SQLite:
 *  - Uses the browser/WebView's built-in IndexedDB engine — no WASM, no
 *    custom-element bootstrap, no native plugin required.
 *  - Works identically on iOS, Android, and web without any platform checks.
 *  - First-class TypeScript support with zero decorator magic.
 *
 * Schema versioning: increment version + add upgrade() when changing stores.
 */
class AppDatabase extends Dexie {
  scannedItems!: Table<ScannedItem, number>

  constructor() {
    super('app_db')
    this.version(1).stores(
      // Indexed columns only — other fields are stored but not indexed.
      // '++id' = auto-increment primary key
      { scannedItems: '++id, format, scannedAt' }
    )
  }
}

export const db = new AppDatabase()

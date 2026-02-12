import Dexie, { type Table } from 'dexie'
import type { ScannedItem } from './entities/ScannedItem'
import type { LocalUser } from './entities/LocalUser'

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
 *   v1 — initial: scannedItems
 *   v2 — add: users (offline-first with sync queue via syncStatus)
 */
class AppDatabase extends Dexie {
  scannedItems!: Table<ScannedItem, number>
  users!: Table<LocalUser, number>

  constructor() {
    super('app_db')

    this.version(1).stores({
      scannedItems: '++id, format, scannedAt',
    })

    // v2: add users table.
    // All previous tables must be re-listed to preserve them.
    this.version(2).stores({
      scannedItems: '++id, format, scannedAt',
      users: '++localId, serverId, syncStatus',
    })
  }
}

export const db = new AppDatabase()

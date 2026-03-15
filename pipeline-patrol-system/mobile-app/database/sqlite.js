import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pipeline-patrol.db');

export function initDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS offline_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER,
      comment TEXT,
      actual_latitude REAL,
      actual_longitude REAL,
      submitted_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS offline_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      offline_report_id INTEGER,
      image_uri TEXT,
      location_id INTEGER,
      sync_status TEXT DEFAULT 'pending'
    );
  `);
}

export default db;

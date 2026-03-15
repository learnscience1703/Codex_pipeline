import * as Network from 'expo-network';
import db from '../database/sqlite';
import api from '../services/api';

async function syncPending() {
  const network = await Network.getNetworkStateAsync();
  if (!network.isConnected) return;

  const reports = db.getAllSync('SELECT * FROM offline_reports WHERE sync_status = ?', ['pending']);

  for (const report of reports) {
    try {
      const response = await api.post('/patrol-report', report);
      const images = db.getAllSync('SELECT * FROM offline_images WHERE offline_report_id = ? AND sync_status = ?', [
        report.id,
        'pending',
      ]);

      for (const image of images) {
        const formData = new FormData();
        formData.append('report_id', String(response.data.id));
        formData.append('location_id', String(image.location_id));
        formData.append('image', {
          uri: image.image_uri,
          name: `report-${report.id}.jpg`,
          type: 'image/jpeg',
        });
        await api.post('/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        db.runSync('UPDATE offline_images SET sync_status = ? WHERE id = ?', ['synced', image.id]);
      }

      db.runSync('UPDATE offline_reports SET sync_status = ? WHERE id = ?', ['synced', report.id]);
    } catch (error) {
      console.warn('Sync failed', error?.response?.data || error.message);
    }
  }
}

export function startSyncEngine() {
  syncPending();
  return setInterval(syncPending, 30000);
}

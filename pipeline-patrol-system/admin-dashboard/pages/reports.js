import { useEffect, useState } from 'react';
import api, { setToken } from '../services/api';

function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    (async () => {
      setToken(localStorage.getItem('adminToken'));
      const response = await api.get('/reports');
      setReports(response.data);
    })();
  }, []);

  const downloadExport = async (type) => {
    const response = await api.get(`/export/${type}`, { responseType: 'blob' });
    triggerDownload(response.data, type === 'excel' ? 'patrol-reports.xlsx' : 'patrol-reports.kmz');
  };

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Patrol Reports</h1>
      <div className="space-x-3">
        <button className="underline" onClick={() => downloadExport('excel')}>Export Excel</button>
        <button className="underline" onClick={() => downloadExport('kmz')}>Export KMZ</button>
      </div>
      {reports.map((report) => (
        <article key={report.id} className="bg-white rounded p-4 shadow">
          <p><b>Location:</b> {report.location_name}</p>
          <p><b>Guard:</b> {report.guard_name}</p>
          <p><b>Comment:</b> {report.comment}</p>
          <p><b>Submitted:</b> {new Date(report.submitted_at).toLocaleString()}</p>
          <p><b>Coordinates:</b> {report.actual_latitude}, {report.actual_longitude}</p>
          {report.image_url && <img className="mt-2 w-48" src={`http://localhost:5000${report.image_url}`} alt="patrol" />}
        </article>
      ))}
    </main>
  );
}

import { useState } from 'react';
import api, { setToken } from '../services/api';

export default function Locations() {
  const [message, setMessage] = useState('');

  const upload = async (event) => {
    const file = event.target.files[0];
    const token = localStorage.getItem('adminToken');
    setToken(token);

    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/locations/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setMessage(`Uploaded ${response.data.count} locations`);
  };

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Location Upload</h1>
      <input type="file" accept=".csv" onChange={upload} />
      {message && <p className="text-green-700">{message}</p>}
    </main>
  );
}

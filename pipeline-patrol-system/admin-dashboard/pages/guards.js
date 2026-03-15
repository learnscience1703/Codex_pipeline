import { useEffect, useState } from 'react';
import api, { setToken } from '../services/api';

export default function Guards() {
  const [guards, setGuards] = useState([]);

  const load = async () => {
    const token = localStorage.getItem('adminToken');
    setToken(token);
    const response = await api.get('/guards');
    setGuards(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (guard_id, status) => {
    await api.post('/guards/approve', { guard_id, status });
    load();
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Guard Management</h1>
      {guards.map((guard) => (
        <div key={guard.id} className="bg-white rounded p-3 mb-2 shadow flex justify-between">
          <div>
            <p>{guard.name}</p>
            <p className="text-sm text-gray-500">{guard.mobile_number}</p>
          </div>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => approve(guard.id, 'approved')}>Approve</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => approve(guard.id, 'rejected')}>Reject</button>
          </div>
        </div>
      ))}
    </main>
  );
}

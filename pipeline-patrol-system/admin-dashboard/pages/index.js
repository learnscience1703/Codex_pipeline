import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { setToken } from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({ totalLocations: 0, totalGuards: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setToken(token);

    (async () => {
      const [locations, guards, reports] = await Promise.all([api.get('/locations'), api.get('/guards'), api.get('/reports')]);
      setStats({
        totalLocations: locations.data.length,
        totalGuards: guards.data.length,
        pending: locations.data.length - reports.data.length,
        completed: reports.data.length,
      });
    })();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Pipeline Patrol Admin</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card label="Total Locations" value={stats.totalLocations} />
        <Card label="Total Guards" value={stats.totalGuards} />
        <Card label="Pending Patrols" value={stats.pending} />
        <Card label="Completed Patrols" value={stats.completed} />
      </div>
      <div className="space-x-3">
        <Link className="underline" href="/guards">Guard Management</Link>
        <Link className="underline" href="/locations">Location Upload</Link>
        <Link className="underline" href="/map">Map Monitoring</Link>
        <Link className="underline" href="/reports">Patrol Reports</Link>
      </div>
    </main>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

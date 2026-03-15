import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async () => {
    try {
      const result = await api.post('/auth/login', { mobile_number: mobile, password });
      if (result.data.user?.role !== 'admin') {
        setError('Admin access only');
        return;
      }
      localStorage.setItem('adminToken', result.data.token);
      router.push('/');
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="max-w-sm mx-auto mt-24 bg-white p-6 rounded shadow space-y-3">
      <h1 className="font-bold text-xl">Admin Login</h1>
      <input className="w-full border p-2" placeholder="Mobile number" onChange={(e) => setMobile(e.target.value)} />
      <input className="w-full border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={submit}>Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}

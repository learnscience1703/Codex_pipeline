import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../components/MapView'), { ssr: false });

export default function MapPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Map Monitoring</h1>
      <MapView />
    </main>
  );
}

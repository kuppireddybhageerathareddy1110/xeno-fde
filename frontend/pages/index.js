import { useEffect, useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/tenants`);
      setTenants(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function createTenant(e) {
    e.preventDefault();
    try {
      const payload = { name, shopDomain, accessToken };
      const res = await axios.post(`${API}/tenants`, payload);

      const tenantId = res.data.id;
      localStorage.setItem('tenantId', tenantId);
      Router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Xeno – Shopify Ingestion Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Existing Tenants</h2>
      {loading ? <p>Loading tenants…</p> : (
        <div className="grid gap-4 mb-8">
          {tenants.map(t => (
            <div key={t.id} className="p-4 border rounded flex justify-between">
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-gray-500">{t.shopDomain}</p>
              </div>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  localStorage.setItem('tenantId', t.id);
                  Router.push('/dashboard');
                }}
              >
                Open
              </button>
            </div>
          ))}
          {tenants.length === 0 && <p>No tenants yet.</p>}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Add New Tenant</h2>

      <form onSubmit={createTenant} className="grid gap-3 max-w-md">
        <input className="p-2 border rounded" placeholder="Name"
          value={name} onChange={e => setName(e.target.value)} />

        <input className="p-2 border rounded" placeholder="shopDomain"
          value={shopDomain} onChange={e => setShopDomain(e.target.value)} />

        <input className="p-2 border rounded" placeholder="accessToken"
          value={accessToken} onChange={e => setAccessToken(e.target.value)} />

        <button className="bg-green-600 text-white px-3 py-2 rounded">
          Create Tenant
        </button>
      </form>
    </div>
  );
}

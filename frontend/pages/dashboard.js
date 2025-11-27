import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [tenantId, setTenantId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const t = localStorage.getItem("tenantId");
    if (!t) window.location.href = "/";
    setTenantId(t);
    loadAll(t);
  }, []);

  async function loadAll(tid) {
    const res1 = await axios.get(`${API}/dashboard/${tid}/summary`);
    const res2 = await axios.get(`${API}/dashboard/${tid}/ordersByDate`);
    const res3 = await axios.get(`${API}/dashboard/${tid}/topCustomers`);

    setSummary(res1.data);
    setOrdersByDate(
      Object.entries(res2.data).map(([date, revenue]) => ({ date, revenue }))
    );
    setTopCustomers(res3.data);
  }

  async function syncNow() {
    await axios.post(`${API}/sync/${tenantId}/all`);
    loadAll(tenantId);
    alert("Sync Completed!");
  }

  const chartData = {
    labels: ordersByDate.map(o => o.date),
    datasets: [
      {
        label: "Revenue",
        data: ordersByDate.map(o => o.revenue),
        borderColor: "blue",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <button className="bg-blue-600 text-white px-3 py-2 rounded mr-2"
            onClick={syncNow}>Sync Now</button>
          <button className="border px-3 py-2 rounded"
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
            Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold">{summary?.totalCustomers ?? "-"}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{summary?.totalOrders ?? "-"}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">₹{summary?.totalRevenue ?? "-"}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-4 bg-white rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Revenue by Date</h2>
        <Line data={chartData} />
      </div>

      {/* Top Customers */}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Top 5 Customers</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>ID</th>
              <th>Email</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.id}</td>
                <td>{c.email}</td>
                <td>₹{c.totalSpent}</td>
              </tr>
            ))}
            {topCustomers.length === 0 && (
              <tr><td colSpan="3" className="p-4 text-gray-500 text-center">
                No customers found
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

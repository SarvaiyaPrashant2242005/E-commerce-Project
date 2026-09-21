import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/vendor/orders").then(({ data }) => setOrders(Array.isArray(data) ? data : data.orders || []));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/vendor/orders/${id}`, { status });
    setOrders((o) => o.map((ord) => (ord._id === id ? { ...ord, status } : ord)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Orders</h1>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left">
          <thead className="border-b text-gray-500 text-sm bg-gray-50">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">#{o._id.slice(-8)}</td>
                <td className="p-3">
                  <p className="font-medium">{o.customerId?.name || "Customer"}</p>
                  <p className="text-xs text-gray-500">{o.customerId?.email}</p>
                </td>
                <td className="p-3 text-sm">{o.items?.length} item(s)</td>
                <td className="p-3 font-semibold">₹{o.totalAmount}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer ${statusColor[o.status] || ""}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
};

export default VendorOrders;

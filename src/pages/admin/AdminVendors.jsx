
import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    const { data } = await api.get("/admin/vendors");
    setVendors(Array.isArray(data) ? data : data.vendors || []);
  };

  useEffect(() => { fetchVendors(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/vendors/${id}/status`, { status });
    fetchVendors();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left">
          <thead className="border-b text-gray-500 text-sm bg-gray-50">
            <tr>
              <th className="p-3">Vendor</th>
              <th className="p-3">Store</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-gray-500">{v.email}</p>
                </td>
                <td className="p-3">{v.storeId?.name || "—"}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium rounded-full px-3 py-1 ${
                    v.status === "approved" ? "bg-green-100 text-green-700"
                    : v.status === "suspended" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                    {v.status}
                  </span>
                </td>
                <td className="p-3 flex gap-3">
                  {v.status !== "approved" && (
                    <button onClick={() => updateStatus(v._id, "approved")}
                      className="text-green-600 hover:underline font-medium">Approve</button>
                  )}
                  {v.status === "approved" && (
                    <button onClick={() => updateStatus(v._id, "suspended")}
                      className="text-red-600 hover:underline font-medium">Suspend</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVendors;



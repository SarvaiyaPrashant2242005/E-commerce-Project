import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await api.get("/vendor/products");
    setProducts(Array.isArray(data) ? data : data.products || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link to="/vendor/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left">
          <thead className="border-b text-gray-500 text-sm bg-gray-50">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-3 font-semibold">₹{p.price}</td>
                <td className="p-3">
                  <span className={p.stock > 5 ? "text-green-600" : "text-orange-500"}>{p.stock}</span>
                </td>
                <td className="p-3 flex gap-4">
                  <Link to={`/vendor/products/edit/${p._id}`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-gray-500">No products yet. Apna pehla product add karo! 🚀</p>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;
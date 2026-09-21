import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios";

const EMPTY = { name: "", description: "", price: "", stock: "", category: "", image: "" };

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit mode: existing product load karo
  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) =>
        setForm({
          name: data.name, description: data.description, price: data.price,
          stock: data.stock, category: data.category || "", image: data.image || "",
        })
      );
    }
  }, [id, isEdit]);

  // Cloudinary unsigned upload
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        fd
      );
      setForm((f) => ({ ...f, image: data.secure_url }));
    } catch {
      alert("Image upload failed — Cloudinary settings check karo (.env file)");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) await api.put(`/products/${id}`, form);
      else await api.post("/products", form);
      navigate("/vendor/products");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <input className="input" placeholder="Product Name" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea className="input" placeholder="Description" rows="3" required
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-3 gap-4">
          <input className="input" type="number" placeholder="Price ₹" required min="1"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" type="number" placeholder="Stock" required min="0"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input className="input" placeholder="Category"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="input" />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading to Cloudinary...</p>}
          {form.image && <img src={form.image} alt="preview" className="w-32 h-32 object-cover rounded-lg mt-3" />}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={submitting || uploading}>
            {submitting ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={() => navigate("/vendor/products")}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;


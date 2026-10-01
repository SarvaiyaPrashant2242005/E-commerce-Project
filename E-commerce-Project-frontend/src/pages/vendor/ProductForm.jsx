// VEYRA Seller Workspace — Add / Edit Product
// Aligned with Google Stitch: veyra_seller_add_edit_product
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { productsApi } from "../../api/products.api";

const PRESET_PRODUCT_IMAGES = [
  {
    label: "Handloom Silk Weave",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Hammered Brass Urli",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Smoky Terracotta Urn",
    url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Chanderi Gold Zari",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Pure Pashmina Stole",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
];

const PRODUCT_CATEGORIES = [
  "Textiles & Weaves",
  "Ceramics & Stoneware",
  "Living & Decor",
  "Fragrance & Rituals",
  "Brass & Bell Metal",
  "Woodcraft & Furniture",
];

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Textiles & Weaves",
    price: "",
    originalPrice: "",
    stock: "10",
    origin: "Varanasi, Uttar Pradesh",
    material: "100% Hand-Spun Natural Mulberry Silk",
    craftTime: "2-3 business days",
    dimensions: "140 cm × 220 cm",
    care: "Dry clean or gentle hand wash with mild soap.",
    image: PRESET_PRODUCT_IMAGES[0].url,
    isGiCertified: true,
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      productsApi
        .getProductById(id)
        .then((product) => {
          if (product) {
            setForm({
              title: product.title || product.name || "",
              subtitle: product.subtitle || "",
              description: product.description || "",
              category: product.category || "Textiles & Weaves",
              price: product.price ? String(product.price) : "",
              originalPrice: product.originalPrice ? String(product.originalPrice) : "",
              stock: product.stock !== undefined ? String(product.stock) : "12",
              origin: product.attributes?.origin || "Varanasi, Uttar Pradesh",
              material: product.attributes?.material || "Natural Material",
              craftTime: product.attributes?.craftTime || "1-2 business days",
              dimensions: product.attributes?.dimensions || "Standard Edition",
              care: product.attributes?.care || "Preserve in cool dry conditions.",
              image: product.images?.[0] || product.image || PRESET_PRODUCT_IMAGES[0].url,
              isGiCertified: product.isGiCertified ?? true,
            });
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to retrieve product details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      title: form.title,
      name: form.title,
      subtitle: form.subtitle,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : Math.round(Number(form.price) * 1.2),
      stock: Number(form.stock),
      image: form.image,
      images: [form.image],
      isGiCertified: form.isGiCertified,
      seller: {
        _id: "66f44d5c9e2b1a3d4f8e9b01",
        name: "Kaveri Living",
        storeName: "Kaveri Living",
        location: form.origin,
        isVerified: true,
      },
      storeId: "66f44d5c9e2b1a3d4f8e9b01",
      storeName: "Kaveri Living",
      attributes: {
        origin: form.origin,
        material: form.material,
        craftTime: form.craftTime,
        dimensions: form.dimensions,
        care: form.care,
      },
      tags: [form.category.toLowerCase().split(" ")[0], "handcrafted"],
    };

    try {
      if (isEdit) {
        await productsApi.updateProduct(id, payload);
      } else {
        await productsApi.createProduct(payload);
      }
      navigate("/vendor/products");
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-6">
        <div className="h-10 bg-surface-container rounded-xl w-1/3" />
        <div className="h-64 bg-surface-container rounded-2xl" />
        <div className="h-48 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-outline mb-1.5">
            <Link to="/vendor/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
            <span className="text-on-surface font-semibold">
              {isEdit ? "Edit Product" : "Add New Product"}
            </span>
          </nav>
          <h1 className="font-serif-caslon font-bold text-2xl text-primary tracking-tight">
            {isEdit ? "Edit Product Details" : "Add New Product"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/vendor/products"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-outline hover:text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors"
          >
            Discard
          </Link>
          <button
            type="submit"
            form="productForm"
            disabled={submitting}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-container text-white transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>{isEdit ? "Update Product" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Core Product Information */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Basic Product Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Hand-Spun Raw Mulberry Silk Throw"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Short Description / Subtitle
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g. Pit-loom woven with organic yarns and golden zari borders"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-11 px-3 text-xs font-semibold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none cursor-pointer"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Geographical Indication (GI) Verified
                </label>
                <div className="h-11 flex items-center px-4 rounded-xl bg-surface-container-low border border-surface-container justify-between">
                  <span className="text-xs text-on-surface font-medium">GI Certified Origin</span>
                  <input
                    type="checkbox"
                    checked={form.isGiCertified}
                    onChange={(e) => setForm({ ...form, isGiCertified: e.target.checked })}
                    className="accent-primary-container w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Product Description *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter detailed product specifications, materials, and description..."
                className="w-full p-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Pricing & Stock Inventory */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Pricing &amp; Inventory
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Price (₹) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-outline">₹</span>
                <input
                  type="number"
                  required
                  min="100"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="4850"
                  className="w-full h-11 pl-8 pr-4 text-xs font-bold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Compare-at Price (₹)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-outline">₹</span>
                <input
                  type="number"
                  min="100"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="5900"
                  className="w-full h-11 pl-8 pr-4 text-xs font-bold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Available Stock Units *
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="10"
                className="w-full h-11 px-4 text-xs font-bold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Product Specifications & Details */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              03
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Product Specifications &amp; Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Origin / Location
              </label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="e.g. Varanasi, Uttar Pradesh"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Material Composition
              </label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="e.g. 100% Raw Mulberry Wild Silk"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Fulfillment / Processing Time
              </label>
              <input
                type="text"
                value={form.craftTime}
                onChange={(e) => setForm({ ...form, craftTime: e.target.value })}
                placeholder="e.g. 1-2 business days"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Dimensions / Sizing
              </label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                placeholder="e.g. 140 cm × 220 cm"
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Care Instructions
            </label>
            <input
              type="text"
              value={form.care}
              onChange={(e) => setForm({ ...form, care: e.target.value })}
              placeholder="e.g. Professional cashmere dry clean only. Store in muslin cloth."
              className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest transition-all"
            />
          </div>
        </div>

        {/* SECTION 4: Product Images & Preview */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              04
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Product Images &amp; Preview
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Primary Photograph URL *
            </label>
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest transition-all"
            />
          </div>

          {/* Quick preset photographs */}
          <div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">
              Or select a sample product photo:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setForm({ ...form, image: preset.url })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    form.image === preset.url
                      ? "border-primary bg-primary text-white"
                      : "border-surface-container bg-surface-container-low text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <img src={preset.url} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview Box */}
          {form.image && (
            <div className="pt-2">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">
                Product Card Preview:
              </span>
              <div className="w-48 h-48 rounded-2xl overflow-hidden border border-surface-container-high shadow-sm relative group">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  Verified Format
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/vendor/products"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-outline hover:text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-container text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span>Saving Product...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isEdit ? "Save Product" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

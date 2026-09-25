// VEYRA Seller Workspace — Product Catalog & Inventory
// Aligned with Google Stitch: veyra_seller_product_catalog & veyra_seller_inventory_stock
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../../api/products.api";

const KAVERI_STORE_ID = "66f44d5c9e2b1a3d4f8e9b01";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all"); // 'all', 'in_stock', 'low_stock', 'out_of_stock'
  const [sortBy, setSortBy] = useState("default");

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getProducts({ store: KAVERI_STORE_ID, limit: 100 });
      setProducts(res.products || []);
    } catch (err) {
      setError(err.message || "Failed to load product catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productsApi.deleteProduct(productToDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setProductToDelete(null);
    } catch (err) {
      alert(err.message || "Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const title = (p.title || p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const sku = ("VYR-KVR-" + (p._id?.substring(18) || "")).toLowerCase();
        const matchesSearch =
          searchQuery.trim() === "" ||
          title.includes(searchQuery.toLowerCase()) ||
          category.includes(searchQuery.toLowerCase()) ||
          sku.includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || category === selectedCategory.toLowerCase();

        const stock = p.stock ?? 12;
        let matchesStock = true;
        if (stockFilter === "in_stock") matchesStock = stock >= 10;
        else if (stockFilter === "low_stock") matchesStock = stock > 0 && stock < 10;
        else if (stockFilter === "out_of_stock") matchesStock = stock === 0;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "stock_desc") return (b.stock ?? 0) - (a.stock ?? 0);
        if (sortBy === "title_asc") return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-caslon font-bold text-2xl text-primary tracking-tight">
              Product Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Manage your product catalog, stock inventory, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/vendor/products/new"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU or category..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-44 px-3 py-2 text-xs font-semibold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-40 px-3 py-2 text-xs font-semibold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_desc">Highest Stock</option>
              <option value="title_asc">Title: A to Z</option>
            </select>
          </div>
        </div>

        {/* Stock Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-surface-container">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline shrink-0 mr-1">
            Inventory Filter:
          </span>
          {[
            { id: "all", label: "All Items" },
            { id: "in_stock", label: "In Stock (10+)" },
            { id: "low_stock", label: "Low Stock (<10)" },
            { id: "out_of_stock", label: "Out of Stock (0)" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStockFilter(pill.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                stockFilter === pill.id
                  ? "bg-primary-container text-white shadow-xs"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-surface-container rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-outline">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant block">
              category
            </span>
            <h3 className="font-serif-caslon font-bold text-base text-on-surface mb-1">
              No matching products found
            </h3>
            <p className="text-xs max-w-sm mx-auto mb-4">
              Try adjusting your search query, clearing filters, or adding a new product.
            </p>
            <Link
              to="/vendor/products/new"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add New Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-outline uppercase font-semibold text-[10px] tracking-wider border-b border-surface-container">
                <tr>
                  <th className="py-3 px-4">Product SKU &amp; Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Fulfillment Time</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Inventory Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredProducts.map((p) => {
                  const stock = p.stock ?? 12;
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock < 10;
                  const imageSrc =
                    p.images?.[0] ||
                    p.image ||
                    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80";

                  return (
                    <tr key={p._id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imageSrc}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-surface-container-high shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <span className="font-mono text-[10px] text-outline uppercase tracking-wider block">
                              VYR-KVR-{p._id.substring(18).toUpperCase()}
                            </span>
                            <span className="font-bold text-on-surface text-xs truncate block max-w-xs sm:max-w-sm">
                              {p.title || p.name}
                            </span>
                            <span className="text-[11px] text-outline truncate block">
                              {p.attributes?.origin || "Varanasi, Uttar Pradesh"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-on-surface">
                        <span className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-outline">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-secondary">
                            schedule
                          </span>
                          <span>{p.attributes?.craftTime || "1-2 business days"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sm text-primary">
                          ₹{p.price?.toLocaleString("en-IN")}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-outline line-through ml-1.5">
                            ₹{p.originalPrice?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isOutOfStock
                              ? "bg-error-container text-on-error-container"
                              : isLowStock
                              ? "bg-secondary-fixed text-on-secondary-fixed"
                              : "bg-tertiary-fixed text-on-tertiary-fixed"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>
                            {isOutOfStock
                              ? "Out of Stock"
                              : isLowStock
                              ? `Low (${stock})`
                              : `In Stock (${stock})`}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/product/${p._id}`}
                            title="View Product Page"
                            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </Link>
                          <Link
                            to={`/vendor/products/edit/${p._id}`}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </Link>
                          <button
                            onClick={() => setProductToDelete(p)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Product Deletion */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-surface-container-high shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <div>
                <h3 className="font-serif-caslon font-bold text-lg text-on-surface">
                  Delete Product?
                </h3>
                <span className="text-xs text-outline">Remove Product from Store</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you wish to archive{" "}
              <strong className="text-on-surface">
                "{productToDelete.title || productToDelete.name}"
              </strong>
              ? This action will remove the product from your store.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-error text-white hover:bg-error/90 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
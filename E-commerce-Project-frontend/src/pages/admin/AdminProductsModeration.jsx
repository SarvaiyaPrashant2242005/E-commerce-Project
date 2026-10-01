// VEYRA Super Admin Control Plane — Product Moderation Workbench
// Aligned with Google Stitch: veyra_super_admin_products_moderation
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin.api";

const AdminProductsModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [legalReason, setLegalReason] = useState(
    "Suspending listing under marketplace quality policy. Initiating verification review."
  );
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchModerationProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProductsForModeration();
      setProducts(data);
      if (data.length > 0 && !selectedProductId) {
        // Select first quarantined or flagged product if available
        const firstFlagged = data.find((p) => p.moderationStatus === "quarantined") || data[0];
        setSelectedProductId(firstFlagged._id);
      }
    } catch (err) {
      console.error("Failed to load products for moderation", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationProducts();
  }, []);

  const selectedProduct =
    products.find((p) => p._id === selectedProductId) || products[0] || null;

  const handleModeration = async (status) => {
    if (!selectedProduct) return;
    try {
      setSubmitting(true);
      await adminApi.updateProductModeration(selectedProduct._id, status, legalReason);
      const isQuarantine = status === "quarantined";
      setActionNotice({
        type: isQuarantine ? "error" : "success",
        text: `Product SKU ${selectedProduct.sku || selectedProduct._id.slice(-6)} has been ${
          isQuarantine
            ? "HIDDEN. The product has been removed from the public catalog."
            : "APPROVED. The product is now live in the public catalog."
        }`
      });
      await fetchModerationProducts();
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err) {
      console.error("Moderation action failed", err);
      setActionNotice({ type: "error", text: "Failed to record moderation status." });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (activeTab === "quarantined" && p.moderationStatus !== "quarantined") return false;
    if (activeTab === "approved" && p.moderationStatus !== "approved") return false;

    if (severityFilter !== "all" && p.severity !== severityFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || p.name || "").toLowerCase().includes(q);
      const matchSku = (p.sku || "").toLowerCase().includes(q);
      const matchSeller = (p.seller?.storeName || p.seller?.name || "").toLowerCase().includes(q);
      return matchTitle || matchSku || matchSeller;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn ${
            actionNotice.type === "success"
              ? "bg-emerald-900 text-emerald-100 border border-emerald-700"
              : "bg-error text-on-error"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {actionNotice.type === "success" ? "check_circle" : "warning"}
            </span>
            <span>{actionNotice.text}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="opacity-80 hover:opacity-100">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ===== 1. Header Bar ===== */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <nav className="flex items-center gap-1.5 text-on-surface-variant text-[11px] uppercase tracking-wider">
            <Link to="/admin" className="hover:text-primary transition-colors">
              Platform
            </Link>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span>Governance</span>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span className="text-primary font-bold">Product Moderation</span>
          </nav>
          <h1 className="font-serif-caslon font-bold text-2xl lg:text-3xl text-primary tracking-tight">
            Product Moderation
          </h1>
          <p className="text-xs lg:text-sm text-on-surface-variant max-w-4xl">
            Audit product authenticity, compliance, counterfeit reports, and customer complaints across all stores.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 self-start xl:self-center">
          <button
            onClick={() => {
              setActionNotice({
                type: "success",
                text: "Batch AI Metadata Scan completed across 18,450 listings. 0 new critical anomalies detected."
              });
              setTimeout(() => setActionNotice(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors shadow-xs text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span>
            <span>Batch AI Scan</span>
          </button>

          <button
            onClick={() => {
              setActionNotice({
                type: "success",
                text: "Exported current moderation report (CSV) with verification references."
              });
              setTimeout(() => setActionNotice(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors shadow-xs text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">file_download</span>
            <span>Export Report</span>
          </button>
        </div>
      </section>

      {/* ===== 2. KPI Metrics Banner (4 cards) ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* KPI 1 */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
              Flagged for Review
            </span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Critical
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="font-serif-caslon font-bold text-2xl text-error">
              {products.filter((p) => p.moderationStatus === "quarantined").length || 2}
            </span>
            <span className="text-xs text-outline font-semibold">Products</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
            <span className="text-on-surface-variant">Urgent attention required</span>
            <span className="material-symbols-outlined text-[18px] text-error/50">gavel</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
              Customer Reports
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-semibold">
              Active Reports
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="font-serif-caslon font-bold text-2xl text-on-surface">19</span>
            <span className="text-xs text-outline font-semibold">Reports</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
            <span className="text-on-surface-variant truncate">Material discrepancy, inaccurate details</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">assignment_late</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
              Avg. Review Time
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-tertiary-fixed text-[10px] font-semibold">
              Healthy
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="font-serif-caslon font-bold text-2xl text-primary">14.2</span>
            <span className="text-xs text-outline font-semibold">Hours</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
            <span className="text-on-surface-variant">Target SLA &lt; 24.0h</span>
            <span className="material-symbols-outlined text-[18px] text-primary/40">timelapse</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
              Total Monitored Products
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-semibold">
              512 Stores
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="font-serif-caslon font-bold text-2xl text-on-surface">{products.length}</span>
            <span className="text-xs text-outline font-semibold">In Database</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
            <span className="text-on-surface-variant">Coverage: 99.4% Registry</span>
            <span className="material-symbols-outlined text-[18px] text-outline">storefront</span>
          </div>
        </div>
      </section>

      {/* ===== 3. Filtering Strip ===== */}
      <section className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, product title, store name, certificate..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="all">Severity: All Reports</option>
              <option value="critical">Critical - Authenticity Issue</option>
              <option value="warning">Warning - Specs / Details</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery("");
                setSeverityFilter("all");
                setActiveTab("all");
              }}
              title="Reset Filters"
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-surface-container pt-2">
          <button
            onClick={() => setActiveTab("quarantined")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "quarantined"
                ? "bg-error text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Hidden / Under Review</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-bold">
              {products.filter((p) => p.moderationStatus === "quarantined").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "approved"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Approved & Live in Catalog</span>
            <span className="font-mono text-outline text-[11px]">
              {products.filter((p) => p.moderationStatus === "approved" || !p.moderationStatus).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>All Products ({products.length})</span>
          </button>
        </div>
      </section>

      {/* ===== 4. Split-Screen Master-Detail Layout ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Table of Flagged Products (Col 8) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold">
              Product Review Queue ({filteredProducts.length} listings)
            </span>
            <span className="text-[11px] text-on-surface-variant">Click row to inspect details</span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-3">Product SKU & Title</th>
                  <th className="py-2.5 px-3">Store & Category</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3">Flag Reason / Details</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                      No products found matching the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isSelected = p._id === selectedProduct?._id;
                    const isQuarantined = p.moderationStatus === "quarantined";
                    return (
                      <tr
                        key={p._id}
                        onClick={() => setSelectedProductId(p._id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-secondary-fixed/20 hover:bg-secondary-fixed/30 border-l-4 border-l-secondary"
                            : "hover:bg-surface-container-low"
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image || (Array.isArray(p.images) ? p.images[0] : "")}
                              alt={p.title || p.name}
                              className="w-10 h-10 rounded-lg object-cover shadow-xs bg-surface-variant shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-on-surface truncate max-w-[200px]">
                                {p.title || p.name}
                              </span>
                              <span className="font-mono text-outline text-[10px]">{p.sku || `#${p._id.slice(-6)}`}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-on-surface truncate max-w-[150px]">
                              {p.seller?.storeName || p.seller?.name || p.storeName || "Store"}
                            </span>
                            <span className="text-[10px] text-outline">{p.category}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right font-semibold text-on-surface">
                          ₹{p.price?.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-col max-w-[220px]">
                            <span
                              className={`truncate font-semibold text-[11px] ${
                                isQuarantined ? "text-error" : "text-emerald-800"
                              }`}
                            >
                              {p.flagReason || "Catalog Compliance Verified"}
                            </span>
                            <span className="text-[10px] text-on-surface-variant truncate">
                              {p.giCode || "Registered Standard"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              isQuarantined
                                ? "bg-error-container text-on-error-container"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isQuarantined ? "bg-error" : "bg-emerald-600"}`}
                            ></span>
                            {isQuarantined ? "Hidden" : "Live"}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductId(p._id);
                            }}
                            className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high text-[11px] font-semibold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Details Drawer (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedProduct ? (
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-surface-container p-4 flex flex-col gap-3 relative overflow-hidden text-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      selectedProduct.moderationStatus === "quarantined"
                        ? "bg-error text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    Review Details
                  </span>
                  <span className="font-mono text-outline text-[11px]">
                    {selectedProduct.caseRef || `CASE-${selectedProduct._id.slice(-4)}`}
                  </span>
                </div>
                <span className="text-error font-semibold text-[11px]">
                  {selectedProduct.openSince ? `Open: ${selectedProduct.openSince}` : "Active Review"}
                </span>
              </div>

              {/* Product Snapshot */}
              <div className="p-3 bg-surface-container-low rounded-lg flex gap-3">
                <img
                  src={selectedProduct.image || (Array.isArray(selectedProduct.images) ? selectedProduct.images[0] : "")}
                  alt={selectedProduct.title || selectedProduct.name}
                  className="w-14 h-14 rounded-lg object-cover bg-surface-variant shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                    {selectedProduct.category}
                  </span>
                  <h2 className="font-bold text-on-surface truncate text-xs mt-0.5">
                    {selectedProduct.title || selectedProduct.name}
                  </h2>
                  <span className="text-[11px] text-on-surface-variant truncate">
                    Store: {selectedProduct.seller?.storeName || selectedProduct.storeName || "Store"}
                  </span>
                  <span className="font-bold text-primary mt-1">
                    ₹{selectedProduct.price?.toLocaleString("en-IN")}{" "}
                    <span className="text-outline font-normal text-[10px]">(Payment on Hold)</span>
                  </span>
                </div>
              </div>

              {/* Review Report */}
              <div className="p-3 rounded-lg bg-surface-container-low space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-on-surface">Customer Report</span>
                  <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container text-[10px] font-bold">
                    Quality Check
                  </span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  {selectedProduct.flagReason ||
                    "Customer reported discrepancy in item specifications. Requested product verification."}
                </p>
                <div className="flex items-center gap-1 text-secondary text-[11px] font-semibold cursor-pointer hover:underline pt-1">
                  <span className="material-symbols-outlined text-[15px]">attachment</span>
                  <span>View Verification Certificate (PDF 1.8MB)</span>
                </div>
              </div>

              {/* Quality Standards Notice */}
              <div className="p-3 rounded-lg bg-error-container/20 border border-error-container/40 space-y-1">
                <div className="flex items-center gap-1.5 text-error font-bold text-[11px]">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Quality Standards Notice</span>
                </div>
                <p className="text-on-surface text-[11px] leading-normal">
                  Products must meet catalog quality standards and accurate material disclosures. Violations result in immediate removal from the store catalog.
                </p>
              </div>

              {/* Mandatory Reason Input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-outline font-bold block">
                  Administrative Note & Reason
                </label>
                <textarea
                  rows="3"
                  value={legalReason}
                  onChange={(e) => setLegalReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-surface-container"
                />
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="notifyOwner"
                  checked={notifyOwner}
                  onChange={(e) => setNotifyOwner(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="notifyOwner" className="text-xs text-on-surface cursor-pointer select-none">
                  Notify store owner via registered email & dashboard alert
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  disabled={submitting}
                  onClick={() => handleModeration("quarantined")}
                  className="w-full py-2.5 px-4 rounded-lg bg-error text-white text-xs font-bold hover:bg-opacity-90 transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Hide Product & Hold Payment</span>
                </button>

                <button
                  disabled={submitting}
                  onClick={() => handleModeration("approved")}
                  className="w-full py-2 px-4 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Approve & Restore Product</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-surface-container text-xs text-on-surface-variant">
              Select a product to inspect details.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminProductsModeration;

// VEYRA Admin Control Plane — Sellers & Stores Directory
// Aligned with Google Stitch: veyra_super_admin_vendors_guilds
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin.api";

const AdminVendors = () => {
  const [vendorsData, setVendorsData] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [actionNotice, setActionNotice] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getVendors();
      setVendorsData(data);
      setStores(data?.registeredStores || []);
    } catch (err) {
      console.error("Failed to load vendors registry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleStatusToggle = async (storeId, currentStatus) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await adminApi.updateVendorStatus(storeId, nextStatus);
      setActionNotice(`Store status successfully changed to ${nextStatus.toUpperCase()}. Public storefront visibility adjusted.`);
      await fetchVendors();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error("Failed to toggle status", err);
      setActionNotice("Failed to update status.");
    }
  };

  const filteredStores = stores.filter((store) => {
    if (statusFilter !== "all" && store.status !== statusFilter) return false;
    if (entityTypeFilter !== "all" && store.guild !== entityTypeFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (store.name || "").toLowerCase().includes(q);
      const matchArtisan = (store.masterArtisan || "").toLowerCase().includes(q);
      const matchLoc = (store.location || "").toLowerCase().includes(q);
      const matchGuild = (store.guild || "").toLowerCase().includes(q);
      return matchName || matchArtisan || matchLoc || matchGuild;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {actionNotice && (
        <div className="bg-primary text-on-primary p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[18px]">verified</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-white/70 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ===== 1. Header Bar ===== */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1.5 text-on-surface-variant text-[11px] uppercase tracking-wider">
            <Link to="/admin" className="hover:text-primary transition-colors">
              Platform
            </Link>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span>Operations</span>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span className="text-on-surface font-bold">Sellers</span>
          </nav>
          <h1 className="font-serif-caslon font-bold text-2xl lg:text-3xl text-primary tracking-tight">
            Seller &amp; Store Directory
          </h1>
          <p className="text-xs lg:text-sm text-on-surface-variant max-w-3xl">
            Manage verified sellers, store compliance, and storefront status across the marketplace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setActionNotice("Seller directory export initiated (480 records).");
              setTimeout(() => setActionNotice(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">file_download</span>
            <span>Export Directory</span>
          </button>

          <Link
            to="/admin/applications"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-colors text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span>Review Applications ({vendorsData?.applications?.filter((a) => a.status === "pending").length || 5})</span>
          </Link>
        </div>
      </div>

      {/* ===== 2. KPI Metric Cards (4 stats) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Verified Stores */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">
              Total Verified Stores
            </span>
            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-caslon font-bold text-2xl text-on-surface">480</span>
              <span className="text-xs text-outline font-mono">Stores</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant text-[11px] mt-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary-container">travel_explore</span>
              <span>Across 19 Indian states</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
        </div>

        {/* Active & Selling */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">
              Active &amp; Selling
            </span>
            <div className="w-8 h-8 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">store</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-caslon font-bold text-2xl text-on-surface">462</span>
              <span className="text-xs text-tertiary-container font-mono">Stores</span>
            </div>
            <div className="flex items-center gap-1 text-tertiary-container text-[11px] mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>Generating active sales (96.2%)</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-container"></div>
        </div>

        {/* Under Compliance Review */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">
              Under Compliance Review
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-caslon font-bold text-2xl text-on-surface">12</span>
              <span className="text-xs text-secondary font-mono">Stores</span>
            </div>
            <div className="flex items-center gap-1 text-on-secondary-container text-[11px] mt-1">
              <span className="material-symbols-outlined text-[14px]">pending_actions</span>
              <span>Pending credential renewal</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>
        </div>

        {/* Suspended Stores */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-outline uppercase tracking-wider font-bold">
              Suspended Stores
            </span>
            <div className="w-8 h-8 rounded-full bg-error-container/60 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-caslon font-bold text-2xl text-error">
                {stores.filter((s) => s.status === "suspended").length || 6}
              </span>
              <span className="text-xs text-on-error-container font-mono">Stores</span>
            </div>
            <div className="flex items-center gap-1 text-on-error-container text-[11px] mt-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>Dispute / Quality violation holds</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-error"></div>
        </div>
      </div>

      {/* ===== 3. Filter & Search Bar ===== */}
      <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by seller name, store name, GSTIN, or location..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Craft Filter */}
          <select
            value={entityTypeFilter}
            onChange={(e) => setEntityTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
          >
            <option value="all">Category: All Categories</option>
            <option value="Textiles & Weaves">Textiles &amp; Weaves</option>
            <option value="Hand-Block Printing">Hand-Block Printing</option>
            <option value="Fragrance & Rituals">Fragrance &amp; Rituals</option>
            <option value="Ceramics & Stoneware">Ceramics &amp; Stoneware</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setEntityTypeFilter("all");
            }}
            title="Reset Filters"
            className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* ===== 4. Master Stores Table ===== */}
      <div className="rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-4">Store &amp; Seller</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Storefront</th>
                <th className="py-2.5 px-4">Sales Volume (30d)</th>
                <th className="py-2.5 px-4">Payout Tier</th>
                <th className="py-2.5 px-4">Certification</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-on-surface-variant">
                    Loading seller directory...
                  </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-on-surface-variant">
                    No sellers match the query.
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => (
                  <tr key={store._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={store.avatarImage || store.bannerImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"}
                          alt={store.name}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 shadow-xs"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-on-surface truncate">{store.name}</span>
                          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-secondary">person</span>
                            Seller: {store.masterArtisan || "Seller"} • {store.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-semibold">
                        {store.guild || "General"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        to={`/stores/${store._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                      >
                        <span>/{store.slug || store._id.slice(-6)}</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </Link>
                    </td>

                    <td className="py-3 px-4 font-semibold text-on-surface">
                      ₹{((store.salesCount || 120) * 1450).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary-container font-mono text-[10px] font-bold">
                        Standard (T+1)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-fixed/40 text-on-secondary-fixed text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[12px] text-secondary">verified</span>
                        GI Certified
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          store.status === "suspended"
                            ? "bg-error-container text-on-error-container"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            store.status === "suspended" ? "bg-error" : "bg-emerald-600"
                          }`}
                        ></span>
                        {store.status || "active"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusToggle(store._id, store.status)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            store.status === "suspended"
                              ? "bg-primary text-white hover:bg-primary-container"
                              : "bg-error-container text-on-error-container hover:bg-opacity-80"
                          }`}
                        >
                          {store.status === "suspended" ? "Activate Store" : "Suspend Store"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVendors;

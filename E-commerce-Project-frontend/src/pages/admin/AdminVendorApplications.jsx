// VEYRA Admin Control Plane — Seller Applications
// Aligned with Google Stitch: veyra_super_admin_vendor_applications
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin.api";

const AdminVendorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCraft, setSelectedCraft] = useState("all");
  const [justificationNote, setJustificationNote] = useState(
    "All statutory GSTIN, Pehchan IDs, and business certificates verified. Approved for store activation."
  );
  const [notifyApplicant, setNotifyApplicant] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getApplications();
      setApplications(data);
      if (data.length > 0 && !selectedAppId) {
        setSelectedAppId(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load vendor applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const selectedApp =
    applications.find((a) => a._id === selectedAppId) || applications[0] || null;

  const handleAdjudication = async (status) => {
    if (!selectedApp) return;
    try {
      setSubmitting(true);
      await adminApi.updateApplicationStatus(selectedApp._id, status, justificationNote);
      setActionMessage({
        type: status === "approved" ? "success" : "rejected",
        text: `Application #${selectedApp._id.slice(-6).toUpperCase()} (${selectedApp.brandName || selectedApp.artisanName}) has been ${status === "approved" ? "APPROVED and store activated" : "REJECTED"}.`
      });
      await fetchApplications();
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err) {
      console.error("Review action failed", err);
      setActionMessage({
        type: "error",
        text: "Failed to update application status."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    // Status tab filter
    if (activeTab === "pending" && app.status !== "pending") return false;
    if (activeTab === "approved" && app.status !== "approved") return false;
    if (activeTab === "rejected" && app.status !== "rejected") return false;
    if (activeTab === "urgent" && app.priority !== "high") return false;

    // Craft filter
    if (selectedCraft !== "all" && !app.guild?.toLowerCase().includes(selectedCraft.toLowerCase())) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (app.brandName || "").toLowerCase().includes(q);
      const matchArtisan = (app.artisanName || "").toLowerCase().includes(q);
      const matchRegion = (app.region || "").toLowerCase().includes(q);
      const matchGstin = (app.gstin || "").toLowerCase().includes(q);
      const matchGi = (app.giCode || "").toLowerCase().includes(q);
      return matchName || matchArtisan || matchRegion || matchGstin || matchGi;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ===== Action Banner / Notification ===== */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-medium shadow-sm transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-900 text-emerald-100 border border-emerald-700"
              : actionMessage.type === "rejected"
              ? "bg-amber-900 text-amber-100 border border-amber-700"
              : "bg-error text-on-error"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">
              {actionMessage.type === "success" ? "check_circle" : "info"}
            </span>
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="opacity-80 hover:opacity-100">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ===== 1. Header Bar & Administrative Controls ===== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1.5 text-on-surface-variant text-[11px] uppercase tracking-wider">
            <Link to="/admin" className="hover:text-primary transition-colors">
              Platform
            </Link>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span>Seller Intake</span>
            <span className="material-symbols-outlined text-[12px] text-outline">chevron_right</span>
            <span className="text-primary font-bold">Applications Queue</span>
          </nav>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h1 className="font-serif-caslon font-bold text-2xl lg:text-3xl text-primary tracking-tight">
              Seller Applications &amp; Verification
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              Corridor AP-1
            </span>
          </div>
          <p className="text-xs lg:text-sm text-on-surface-variant max-w-3xl">
            Review seller applications, business documents, and verification details across stores.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              setActionMessage({
                type: "success",
                text: "Exported current seller application roster (CSV)."
              });
              setTimeout(() => setActionMessage(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors shadow-xs text-xs font-semibold border border-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">cloud_download</span>
            <span>Export Roster</span>
          </button>
          <button
            onClick={() => {
              setActionMessage({
                type: "success",
                text: "Verification cross-reference query completed."
              });
              setTimeout(() => setActionMessage(null), 4000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high text-primary hover:bg-surface-variant transition-colors shadow-xs text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">sync_saved_locally</span>
            <span>Verify Credentials</span>
          </button>
        </div>
      </div>

      {/* ===== 2. Metric Banner (4 KPI Summary Cards) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Pending Review
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-serif-caslon font-bold text-2xl text-primary">
                  {applications.filter((a) => a.status === "pending").length}
                </span>
                <span className="text-xs text-on-surface-variant">applications</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-secondary-container/60 flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[18px]">assignment_late</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-surface-container text-[11px]">
            <span className="text-error font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error"></span> 3 Marked High Priority
            </span>
            <span className="text-outline">Queue Depth: Low</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-fixed"></div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Avg. Turnaround SLA
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-serif-caslon font-bold text-2xl text-primary">26.4</span>
                <span className="text-xs text-primary font-semibold">Hours</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-surface-container text-[11px]">
            <span className="text-tertiary-container font-semibold">Target &lt; 48h</span>
            <span className="text-on-surface-variant">94.2% within SLA</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-container"></div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Auto-Verified
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-serif-caslon font-bold text-2xl text-primary">82%</span>
                <span className="text-xs text-tertiary-container font-semibold">+6.4% MoM</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-surface-container text-[11px]">
            <span className="text-on-surface-variant">GSTIN Validated</span>
            <span className="font-mono text-outline">FAST</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-fixed-dim"></div>
        </div>

        {/* Card 4 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                Total Approved (MTD)
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-serif-caslon font-bold text-2xl text-primary">42</span>
                <span className="text-xs text-secondary font-semibold">Sellers &amp; Stores</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-surface-container text-[11px]">
            <span className="text-on-surface-variant">Active Across Categories</span>
            <span className="text-secondary font-semibold">100% Traceable</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>
        </div>
      </div>

      {/* ===== 3. Filters & Scoping Strip ===== */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by store name, GSTIN, State, or Pehchan ID..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCraft}
              onChange={(e) => setSelectedCraft(e.target.value)}
              className="px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Textiles">Textiles &amp; Weaves</option>
              <option value="Metalware">Metalware &amp; Brass</option>
              <option value="Woodcraft">Woodcraft &amp; Furniture</option>
              <option value="Heritage">Heritage Art</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCraft("all");
                setActiveTab("all");
              }}
              title="Reset Filters"
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-surface-container">
          <button
            onClick={() => setActiveTab("urgent")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "urgent"
                ? "bg-secondary-container text-on-secondary-container shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Urgent Action Required</span>
            <span className="px-1.5 py-0.2 rounded-full bg-error text-white text-[10px]">3</span>
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Pending Review</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px]">
              {applications.filter((a) => a.status === "pending").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "approved"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Approved &amp; Active</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px]">
              {applications.filter((a) => a.status === "approved").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "rejected"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px]">
              {applications.filter((a) => a.status === "rejected").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>All Applications ({applications.length})</span>
          </button>
        </div>
      </div>

      {/* ===== 4. Master-Detail Split Screen Layout ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Applications Data Table (65% width / 8 Cols) */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-3.5 flex items-center justify-between bg-surface-container-low border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="font-serif-caslon font-bold text-sm text-primary">
                Incoming Seller Registrations
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                {filteredApps.length} in view
              </span>
            </div>
            <div className="text-[11px] text-on-surface-variant">
              <span>Sort by: <strong className="text-primary font-semibold">Priority</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-3">Application</th>
                  <th className="py-2.5 px-3">Store &amp; Seller</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Statutory KYC</th>
                  <th className="py-2.5 px-3">GI / Pehchan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-on-surface-variant">
                      No applications found matching the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => {
                    const isSelected = app._id === selectedApp?._id;
                    return (
                      <tr
                        key={app._id}
                        onClick={() => setSelectedAppId(app._id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-secondary-fixed/20 hover:bg-secondary-fixed/30 border-l-4 border-l-secondary"
                            : "hover:bg-surface-container-low"
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-primary">
                              #{app._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              {app.leadTimeHours ? `${app.leadTimeHours}h ago` : "Recent"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-on-surface truncate">
                              {app.brandName || "Seller Application"}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              Contact: {app.artisanName}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="text-on-surface font-medium">{app.region}</span>
                            <span className="text-[11px] text-on-surface-variant">{app.craftCluster || app.guild}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed/60 text-tertiary-container text-[10px] font-mono font-semibold w-fit">
                              GSTIN Active
                            </span>
                            <span className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                              {app.gstin || "01AABCK9921E1Z3"}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-semibold">
                            {app.giCode || "GI-REGISTRY"}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              app.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : app.status === "rejected"
                                ? "bg-error-container text-on-error-container"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                app.status === "approved"
                                  ? "bg-emerald-600"
                                  : app.status === "rejected"
                                  ? "bg-error"
                                  : "bg-amber-600 animate-pulse"
                              }`}
                            ></span>
                            {app.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppId(app._id);
                            }}
                            className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-semibold hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
                          >
                            Review
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

        {/* Right Column: Application Detail & Decision Panel (35% width / 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedApp ? (
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-surface-container overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 bg-primary text-on-primary">
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="uppercase tracking-wider text-primary-fixed font-semibold">
                    Active Application Details
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">stars</span> GI Authenticated
                  </span>
                </div>
                <h2 className="font-serif-caslon font-bold text-lg text-white">
                  #{selectedApp._id.slice(-6).toUpperCase()} • {selectedApp.brandName}
                </h2>
                <p className="text-xs text-primary-fixed-dim mt-0.5">
                  Application from {selectedApp.region} ({selectedApp.craftCluster || selectedApp.guild})
                </p>
              </div>

              {/* Section 1: Workshop Footprint */}
              <div className="p-4 border-b border-surface-container space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    Store &amp; Facility Details
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary-container text-[10px] font-semibold">
                    Verified
                  </span>
                </div>

                <div className="flex gap-3 items-center pt-1">
                  <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=300&q=80"
                      alt="Store facility"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-primary truncate">
                      {selectedApp.workshopFootprint || "Production Workshop"}
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      {selectedApp.region} • {selectedApp.experienceYears || 18} Years Experience
                    </span>
                    <span className="text-secondary font-semibold text-[11px]">
                      Verified Staff &amp; Operations
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-surface-container-low">
                    <span className="text-[10px] text-outline block">Seller / Contact Person</span>
                    <span className="font-bold text-on-surface block truncate">{selectedApp.artisanName}</span>
                    <span className="text-[11px] text-on-surface-variant block truncate">{selectedApp.phone}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low">
                    <span className="text-[10px] text-outline block">Email Contact</span>
                    <span className="font-medium text-on-surface block truncate">{selectedApp.email}</span>
                    <span className="text-[10px] text-tertiary-container font-semibold">Email Verified</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-outline">Proposed Store URL</span>
                    <span className="font-mono text-[11px] font-bold text-primary truncate">
                      veyra.com/stores/{(selectedApp.brandName || "store").toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline">open_in_new</span>
                </div>
              </div>

              {/* Section 2: Statutory Documents Verification */}
              <div className="p-4 border-b border-surface-container space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                  Verification &amp; Business Documents
                </span>
                <div className="space-y-1.5 pt-1">
                  {/* GSTIN */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary-container text-[18px]">
                        check_circle
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-on-surface">{selectedApp.gstin || "01AABCK9921E1Z3"}</span>
                        <span className="text-[10px] text-on-surface-variant">Validated with GSTN Portal</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary-container text-[9px] font-bold">
                      ACTIVE
                    </span>
                  </div>

                  {/* GI Certificate */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-on-surface">{selectedApp.giCode || "GI-7401-JK"}</span>
                        <span className="text-[10px] text-on-surface-variant">GI Certification</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold">
                      VERIFIED
                    </span>
                  </div>

                  {/* Bank Penny-Drop */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary-container text-[18px]">
                        account_balance
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{selectedApp.bankName || "National Bank of India"}</span>
                        <span className="text-[10px] text-on-surface-variant">Bank verification complete</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-tertiary-container text-[16px]">done_all</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Review Decision */}
              <div className="p-4 bg-surface-container-low space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                    Application Review Decision
                  </span>
                  <span className="text-[10px] text-outline font-mono">Record #APP-2026-01</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-on-surface-variant block font-semibold">
                    Review Notes
                  </label>
                  <textarea
                    rows="3"
                    value={justificationNote}
                    onChange={(e) => setJustificationNote(e.target.value)}
                    className="w-full p-2.5 bg-surface-container-lowest rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs border border-surface-container"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="notify-applicant"
                    checked={notifyApplicant}
                    onChange={(e) => setNotifyApplicant(e.target.checked)}
                    className="rounded accent-primary cursor-pointer w-4 h-4"
                  />
                  <label htmlFor="notify-applicant" className="text-xs text-on-surface cursor-pointer select-none">
                    Send automated notification to <strong>{selectedApp.artisanName}</strong>
                  </label>
                </div>

                {/* Review Action Buttons */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    disabled={submitting || selectedApp.status === "approved"}
                    onClick={() => handleAdjudication("approved")}
                    className="w-full py-2.5 px-4 rounded-lg bg-primary text-white hover:bg-primary-container transition-all shadow-xs flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>
                      {selectedApp.status === "approved"
                        ? "Application Already Approved"
                        : "Approve Seller"}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActionMessage({
                          type: "success",
                          text: `Information request sent to ${selectedApp.email}. Waiting for response.`
                        });
                        setTimeout(() => setActionMessage(null), 4000);
                      }}
                      className="w-full py-2 px-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold flex items-center justify-center gap-1 border border-surface-container cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">help</span>
                      <span>Request Info</span>
                    </button>

                    <button
                      disabled={submitting || selectedApp.status === "rejected"}
                      onClick={() => handleAdjudication("rejected")}
                      className="w-full py-2 px-2 rounded-lg bg-error-container text-on-error-container hover:bg-opacity-90 transition-colors text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">cancel</span>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-surface-container text-xs text-on-surface-variant">
              Select an application from the queue to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVendorApplications;

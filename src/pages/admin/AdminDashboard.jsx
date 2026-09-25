// VEYRA Admin Dashboard — Multi-Vendor Marketplace Overview
// Aligned with Google Stitch: veyra_super_admin_multi_tenant_marketplace_overview
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin.api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auditMessage, setAuditMessage] = useState(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load admin telemetry", err);
        setError("Unable to synchronize marketplace data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, []);

  const triggerAuditExport = () => {
    setAuditMessage("Audit records snapshot generated and exported.");
    setTimeout(() => setAuditMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* ===== Explicit Development Simulation Notice ===== */}
      <div className="bg-secondary-fixed/40 border border-secondary-fixed text-on-secondary-fixed p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
        <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
          developer_mode_tv
        </span>
        <div className="flex-1 text-xs leading-relaxed">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-secondary">
              Simulated Financial Model (Development Sandbox)
            </span>
            <span className="px-1.5 py-0.2 rounded bg-secondary text-white font-mono text-[9px] font-bold">
              NON-PRODUCTION
            </span>
          </div>
          <p className="mt-1 text-on-surface">
            The <strong>₹24.8L Gross Merchandise Value</strong>, <strong>₹3.42L Payment Hold</strong>, and{" "}
            <strong>12.5% Platform Commission</strong> are simulated demonstration metrics. No real payment
            collection, banking rails, payment releases, or tax remittances are executed.
          </p>
        </div>
      </div>

      {auditMessage && (
        <div className="bg-primary text-on-primary p-3 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">verified</span>
            <span>{auditMessage}</span>
          </div>
          <button onClick={() => setAuditMessage(null)} className="text-white/70 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ===== Executive Context Bar ===== */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4 border-b border-surface-container-highest">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-on-surface-variant text-[11px] font-semibold tracking-wider uppercase">
            <span>Platform Operations</span>
            <span>/</span>
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-primary font-bold">Admin Dashboard</span>
          </div>
          <h1 className="font-serif-caslon font-bold text-2xl lg:text-3xl text-primary tracking-tight">
            Marketplace Operations &amp; Store Management
          </h1>
          <p className="text-xs lg:text-sm text-on-surface-variant max-w-4xl">
            Real-time marketplace telemetry, seller intake, compliance, and platform transaction
            governance across 480 verified sellers and 512 live stores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-on-surface font-medium">Real-time Sync Active</span>
            <span className="text-outline text-[11px]">• 12s ago</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs shadow-xs border border-surface-container flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
            <span>FY 2024–25 (Q3) • Nov 1 – Nov 15</span>
          </div>

          <button
            onClick={triggerAuditExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold shadow-xs border border-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-outline">download_for_offline</span>
            <span>Export Records</span>
          </button>

          <button
            onClick={() => navigate("/admin/settings")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all text-xs font-semibold shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Platform Settings</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
          <span>Synchronizing marketplace data...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>
      ) : (
        <>
          {/* ===== Macro Governance Performance Metrics (6 Cards) ===== */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Card 1: GMV */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    Gross Merchandise Value
                  </span>
                  <span className="font-serif-caslon font-bold text-xl text-primary mt-1">
                    {metrics?.grossMerchandiseValueStr || "₹24.8L"}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    ₹1.48 Cr Platform Run-Rate
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +22.4% MoM
                  </span>
                  <span className="text-outline">vs ₹1.21 Cr prev</span>
                </div>
                <svg className="w-full h-4 mt-1 text-emerald-700" fill="none" viewBox="0 0 100 24">
                  <path d="M0 18 L15 17 L30 19 L45 13 L60 14 L75 8 L90 10 L100 3" stroke="currentColor" strokeWidth="2" />
                  <path d="M0 18 L15 17 L30 19 L45 13 L60 14 L75 8 L90 10 L100 3 L100 24 L0 24 Z" fill="currentColor" fillOpacity="0.1" />
                </svg>
              </div>
            </div>

            {/* Card 2: Take Rate / Net Commission */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    Net Platform Revenue
                  </span>
                  <span className="font-serif-caslon font-bold text-xl text-primary mt-1">
                    ₹{((metrics?.marketplaceGMV * (metrics?.platformTakeRatePct || 12.5)) / 100).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-secondary font-semibold mt-0.5">
                    {metrics?.platformTakeRatePct || 12.5}% Platform Commission
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-900">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container text-[11px] space-y-0.5">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Standard Commission (8%)</span>
                  <span className="font-semibold text-on-surface">₹1.98L</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Logistics &amp; Processing (4.5%)</span>
                  <span className="font-semibold text-on-surface">₹1.11L</span>
                </div>
              </div>
            </div>

            {/* Card 3: Active Vendors & Groups */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    Sellers &amp; Groups
                  </span>
                  <span className="font-serif-caslon font-bold text-xl text-primary mt-1">
                    480 Verified
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    38 Seller Groups
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span><strong>{metrics?.pendingApplicationsCount || 5}</strong> in review queue</span>
                </div>
                <span className="text-emerald-700 font-semibold">+14 this wk</span>
              </div>
            </div>

            {/* Card 4: Tenant Stores */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    Stores
                  </span>
                  <span className="font-serif-caslon font-bold text-xl text-primary mt-1">
                    512 Live
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    99.8% Catalog Compliance
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">store</span>
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">18 temporarily paused</span>
                <span className="font-semibold text-primary">494 active</span>
              </div>
            </div>

            {/* Card 5: Customer Base */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    Customers
                  </span>
                  <span className="font-serif-caslon font-bold text-xl text-primary mt-1">
                    42,850
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    Active Buyers
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">loyalty</span>
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">Repeat: <strong>34.8%</strong></span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-primary font-bold">NPS +72</span>
              </div>
            </div>

            {/* Card 6: Platform Orders & Payments */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                    Payments on Hold
                  </span>
                  <span className="font-serif-caslon font-bold text-xl text-primary mt-1">
                    {metrics?.escrowHeldTotalStr || "₹3.42L"}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    3,412 Total Orders
                  </span>
                </div>
                <span className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant">Dispute Rate:</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                  0.41% Low Risk
                </span>
              </div>
            </div>
          </section>

          {/* ===== Priority Action Queues (Split 2-Column Bento) ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Queue A: Urgent Merchant KYC & GI Approvals */}
            <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container overflow-hidden">
              <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                  <div>
                    <h2 className="font-serif-caslon font-bold text-base text-primary">
                      Seller Applications &amp; Verification
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {metrics?.pendingApplicationsCount || 5} applications waiting for admin approval
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                  {metrics?.pendingApplicationsCount || 5} Pending
                </span>
              </div>

              <div className="divide-y divide-surface-container">
                {/* Applicant 1 */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">texture</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          Kashmir Loom Masters
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px]">
                          Srinagar, J&amp;K
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        Pashmina &amp; Kani • GI: <strong>GI-7401-JK</strong>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">
                          GSTIN + Pehchan In Review
                        </span>
                        <span className="text-outline text-[10px]">Submitted 3h ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>

                {/* Applicant 2 */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">hardware</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          Moradabad Brass Artisan Co-op
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px]">
                          Moradabad, UP
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        Cast Brass &amp; Bell Metal • Pehchan: <strong>PEH-9921-MB</strong>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                          Bank Penny-Drop Verified
                        </span>
                        <span className="text-outline text-[10px]">Submitted 6h ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>

                {/* Applicant 3 */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">palette</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          Kutch Rogan Art Studio
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px]">
                          Nirona, Gujarat
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        Castor Oil Pigments • GI: <strong>GI-ROGAN-04</strong>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-semibold">
                          Manual Registry Cross-Check
                        </span>
                        <span className="text-outline text-[10px]">Submitted 9h ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Open Queue
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface text-center border-t border-surface-container">
                <Link
                  to="/admin/applications"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Seller Application Queue</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Queue B: Product Moderation & Compliance Flags */}
            <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container overflow-hidden">
              <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[20px]">shield_with_heart</span>
                  <div>
                    <h2 className="font-serif-caslon font-bold text-base text-primary">
                      Product Compliance &amp; Integrity Flags
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Products flagged for quality or policy review
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                  {metrics?.flaggedProductsCount || 14} Flagged
                </span>
              </div>

              <div className="divide-y divide-surface-container">
                {/* Flagged Item 1 */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-error-container/40 flex items-center justify-center text-error shrink-0">
                      <span className="material-symbols-outlined text-[20px]">report</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          Machine-spun "Pashmina" Shawl
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-error text-white text-[9px] uppercase font-bold">
                          CRITICAL
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        SKU #PR-9821 • Vendor: <em>Urban Heritage Threads</em>
                      </span>
                      <p className="text-[11px] text-error font-medium mt-1">
                        Failed lab test submitted by customer (Synthetic blend detected)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="px-2.5 py-1.5 rounded-lg bg-error text-white hover:bg-opacity-90 transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Hide Product
                    </button>
                  </div>
                </div>

                {/* Flagged Item 2 */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                      <span className="material-symbols-outlined text-[20px]">scale</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          Chettinad Teak Pillar Console
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-[9px] uppercase font-bold">
                          LOGISTICS
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        SKU #PR-8402 • Vendor: <em>Heritage Woodworks Karaikudi</em>
                      </span>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Weight discrepancy at Delhivery hub (+12.4kg vs declared AWB card)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Audit
                    </button>
                  </div>
                </div>

                {/* Flagged Item 3 */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                      <span className="material-symbols-outlined text-[20px]">science</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-on-surface truncate">
                          Organic Turmeric Dye Silk Saree
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-[9px] uppercase font-bold">
                          AUDIT
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        SKU #PR-6119 • Vendor: <em>Vanya Silk Loom</em>
                      </span>
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        Pending GOTS organic certification renewal upload (Grace period expired)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface text-center border-t border-surface-container">
                <Link
                  to="/admin/products"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Product Moderation</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ===== Marketplace Volume & Clusters Telemetry ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chart: GMV Trajectory & Craft Sectors (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container">
                <div>
                  <h2 className="font-serif-caslon font-bold text-base text-primary">
                    GMV Velocity &amp; Category Yield
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Daily transaction run-rate across categories (Nov 1 – Nov 15)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-xs bg-primary"></span> Handloom (₹68.2L)
                  </span>
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-xs bg-secondary"></span> Metal &amp; Clay (₹58.6L)
                  </span>
                </div>
              </div>

              {/* Chart Graphic */}
              <div className="relative w-full h-56 mt-4 flex flex-col justify-end">
                <div className="absolute top-2 left-[64%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-semibold shadow-md">
                    Diwali Gifting Peak: ₹14.8L
                  </span>
                  <div className="w-px h-12 bg-primary/40 dashed"></div>
                </div>

                <svg className="w-full h-44 overflow-visible" fill="none" viewBox="0 0 700 200">
                  <line stroke="#DFE3E1" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="40" y2="40" />
                  <line stroke="#DFE3E1" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="90" y2="90" />
                  <line stroke="#DFE3E1" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="140" y2="140" />
                  <line stroke="#DFE3E1" strokeWidth="1" x1="0" x2="700" y1="190" y2="190" />
                  {/* Area 1: Handloom */}
                  <path
                    d="M 0 160 Q 60 140, 120 130 T 240 105 T 360 85 T 450 35 T 540 75 T 620 60 T 700 45 L 700 190 L 0 190 Z"
                    fill="#002520"
                    fillOpacity="0.08"
                  />
                  <path
                    d="M 0 160 Q 60 140, 120 130 T 240 105 T 360 85 T 450 35 T 540 75 T 620 60 T 700 45"
                    stroke="#002520"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Line 2: Metal & Pottery */}
                  <path
                    d="M 0 180 Q 70 170, 140 155 T 260 145 T 380 130 T 450 95 T 540 115 T 620 100 T 700 88"
                    stroke="#7D5718"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <circle cx="450" cy="35" r="4.5" fill="#002520" className="ring-4 ring-white" />
                  <circle cx="700" cy="45" r="4" fill="#002520" />
                </svg>

                <div className="flex items-center justify-between text-outline text-[11px] pt-2">
                  <span>Nov 01</span>
                  <span>Nov 03</span>
                  <span>Nov 06</span>
                  <span>Nov 09</span>
                  <span className="font-semibold text-primary">Nov 11 (Peak)</span>
                  <span>Nov 13</span>
                  <span className="font-semibold text-primary">Nov 15 (Today)</span>
                </div>
              </div>

              {/* Category Pills Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-surface-container">
                <div className="p-2 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase font-semibold">Handlooms</span>
                  <span className="font-semibold text-xs text-on-surface mt-0.5">₹68.2L</span>
                  <span className="text-[10px] text-emerald-800 font-medium">45.8% GMV</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase font-semibold">Pottery &amp; Clay</span>
                  <span className="font-semibold text-xs text-on-surface mt-0.5">₹34.5L</span>
                  <span className="text-[10px] text-emerald-800 font-medium">23.2% GMV</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase font-semibold">Bell Metal</span>
                  <span className="font-semibold text-xs text-on-surface mt-0.5">₹24.1L</span>
                  <span className="text-[10px] text-emerald-800 font-medium">16.2% GMV</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low flex flex-col">
                  <span className="text-[10px] text-outline uppercase font-semibold">Gourmet Spice</span>
                  <span className="font-semibold text-xs text-on-surface mt-0.5">₹22.1L</span>
                  <span className="text-[10px] text-emerald-800 font-medium">14.8% GMV</span>
                </div>
              </div>
            </div>

            {/* Clusters & Logistics (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Top Craft Clusters */}
              <div className="p-5 rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <h2 className="font-serif-caslon font-bold text-base text-primary">
                      Top Seller Groups
                    </h2>
                    <span className="text-[11px] text-outline uppercase font-semibold">By Active GMV</span>
                  </div>

                  <div className="flex flex-col gap-3 mt-3.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-on-surface">1. Bagru &amp; Sanganer Block-print Guild</span>
                        <span className="font-bold text-primary">₹28.4L</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-on-surface">2. Moradabad Brass Artisan Co-op</span>
                        <span className="font-bold text-primary">₹22.1L</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-on-surface">3. Kashmir Pashmina Master Weavers</span>
                        <span className="font-bold text-primary">₹19.5L</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: "58%" }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-on-surface">4. Varanasi Silk Weaver Syndicate</span>
                        <span className="font-bold text-primary">₹18.4L</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: "52%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">State Coverage: <strong>19 Indian States</strong></span>
                  <Link to="/admin/vendors" className="text-primary font-bold hover:underline">
                    View Sellers →
                  </Link>
                </div>
              </div>

              {/* Payment Hold Reserve Mini-Tile */}
              <div className="p-4 rounded-xl bg-primary text-on-primary shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-secondary-fixed">
                    <span className="material-symbols-outlined text-[22px]">lock_clock</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-primary-fixed uppercase tracking-wider font-semibold">
                      Payment Protection Reserve
                    </span>
                    <span className="font-serif-caslon font-bold text-lg text-white">
                      ₹3,42,000 Total Held
                    </span>
                    <span className="text-[11px] text-white/70">
                      Nodal Account AP-1 • 48h Payment Release
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/orders"
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors text-xs font-bold shrink-0 shadow-xs"
                >
                  Manage Payments
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import adminApi from "../../api/admin.api";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rbac"); // "identity", "taxonomies", "escrow", "rbac", "webhooks"
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Settings State Form
  const [settings, setSettings] = useState({
    legalEntityName: "VEYRA Mercantile Technologies Ltd.",
    cin: "U74999MH2022PTC384912",
    helpline: "1800-VEYRA-MKR (1800-83972-657)",
    grievanceOfficerName: "Vikramaditya Roy (Designated Director)",
    grievanceOfficerEmail: "grievance@veyra.in",
    maintenanceMode: false,
    handloomCommission: 8.0,
    metalCommission: 10.0,
    gourmetCommission: 6.0,
    escrowHoldHours: 48,
    idleSessionTimeout: 15,
    cidrAllowlist: "103.21.58.0/24",
    mandatoryJustification: true,
  });

  // Admin Roster State
  const [admins, setAdmins] = useState([
    {
      id: "ADM-001",
      name: "Vikramaditya Roy",
      email: "v.roy@veyra.gov.in",
      initials: "VR",
      role: "Root Administrator",
      privileges: "Payment Overrides, Platform Lock, Database Write, Key Rotation",
      tokenType: "YubiKey 5C FIPS (Serial: #882109)",
      status: "Active",
      statusClass: "bg-emerald-100 text-emerald-900",
      avatarBg: "bg-emerald-900 text-white",
    },
    {
      id: "ADM-002",
      name: "Meenakshi Sen",
      email: "m.sen@veyra.gov.in",
      initials: "MS",
      role: "Trust & Safety Officer",
      privileges: "Product Moderation, Compliance Audits, Seller Sanctions",
      tokenType: "Authenticator App (TOTP)",
      status: "Active",
      statusClass: "bg-emerald-100 text-emerald-900",
      avatarBg: "bg-emerald-950 text-white",
    },
    {
      id: "ADM-003",
      name: "Rajeshwar Rao",
      email: "r.rao@veyra.gov.in",
      initials: "RR",
      role: "Financial Controller",
      privileges: "Payment Releases, TDS/TCS Filings, Settlement Reconciliations",
      tokenType: "YubiKey 5 NFC (Serial: #610492)",
      status: "Active",
      statusClass: "bg-emerald-100 text-emerald-900",
      avatarBg: "bg-amber-800 text-white",
    },
    {
      id: "ADM-004",
      name: "Anjali Kapoor",
      email: "a.kapoor@veyra.gov.in",
      initials: "AK",
      role: "Customer Concierge Lead",
      privileges: "Customer Credits (<₹5k), Order Tracking, Buyer Support",
      tokenType: "SMS Fallback & App",
      status: "Restricted Support",
      statusClass: "bg-stone-200 text-stone-700",
      avatarBg: "bg-stone-400 text-white",
    },
  ]);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "Trust & Safety Officer",
    tokenType: "Authenticator App (TOTP)",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSettings();
      if (res && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      } else if (res && typeof res === "object") {
        setSettings((prev) => ({ ...prev, ...res }));
      }
    } catch (err) {
      console.error("Failed to load platform settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings(settings);
      showToast("Platform policies successfully saved.");
    } catch (err) {
      showToast(err.message || "Failed to persist settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    fetchSettings();
    showToast("All modifications reverted to stored commit.");
  };

  const handleInviteAdmin = (e) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      showToast("Name and email are required.", "error");
      return;
    }

    const initials = inviteForm.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newAdmin = {
      id: `ADM-00${admins.length + 1}`,
      name: inviteForm.name,
      email: inviteForm.email,
      initials,
      role: inviteForm.role,
      privileges:
        inviteForm.role === "Root Administrator"
          ? "Payment Overrides, Platform Lock, Database Write, Key Rotation"
          : inviteForm.role === "Financial Controller"
          ? "Payment Releases, TDS/TCS Filings, Settlement Reconciliations"
          : "Product Moderation, Compliance Audits, Seller Sanctions",
      tokenType: inviteForm.tokenType,
      status: "Invited",
      statusClass: "bg-amber-100 text-amber-900",
      avatarBg: "bg-emerald-800 text-white",
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setShowInviteModal(false);
    setInviteForm({
      name: "",
      email: "",
      role: "Trust & Safety Officer",
      tokenType: "Authenticator App (TOTP)",
    });
    showToast(`Security credentials and invitation sent to ${inviteForm.email}`);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-stone-800 antialiased">
      {/* Interactive Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white transition-all transform animate-bounce ${
            toast.type === "error" ? "bg-red-800" : "bg-emerald-900"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-amber-300">
            {toast.type === "error" ? "warning" : "check_circle"}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Primary Configuration Header Area */}
      <div className="w-full bg-white px-4 md:px-8 py-6 border-b border-stone-200 shadow-sm -mt-6 -mx-4 md:-mx-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-semibold">
              <span className="text-stone-400">Home</span>
              <span className="material-symbols-outlined text-[13px] text-stone-300">chevron_right</span>
              <span className="text-stone-400">System & Audit</span>
              <span className="material-symbols-outlined text-[13px] text-stone-300">chevron_right</span>
              <span className="text-emerald-950 font-bold">Platform Settings</span>
            </nav>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950 tracking-tight">
                Platform Settings
              </h1>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono text-xs uppercase font-semibold">
                Rev 48.09
              </span>
            </div>
            <p className="text-xs md:text-sm text-stone-600 max-w-3xl">
              Configure marketplace parameters, product categories, payment schedules, administrator roles, and notification webhooks.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
            <button
              onClick={handleDiscardChanges}
              className="px-4 py-2.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
              Discard Changes
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              type="button"
            >
              {saving ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              )}
              <span>Save Platform Configurations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Canvas */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        {/* Navigation Tabs Architecture */}
        <div className="bg-white rounded-xl p-1.5 border border-stone-200 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            <button
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "identity"
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
              onClick={() => setActiveTab("identity")}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">store</span>
              Marketplace Information
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "taxonomies"
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
              onClick={() => setActiveTab("taxonomies")}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">category</span>
              Product Categories & Standards
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "escrow"
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
              onClick={() => setActiveTab("escrow")}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              Payment & Payout Rules
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "rbac"
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
              onClick={() => setActiveTab("rbac")}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              Admin Roles & Permissions
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px]">
                4 ACTIVE
              </span>
            </button>
            <button
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeTab === "webhooks"
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
              onClick={() => setActiveTab("webhooks")}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Notification Webhooks & Gateways
            </button>
          </div>
        </div>

        {/* Quick Platform Health Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">
                Gateway Operational State
              </span>
              <span className="text-lg font-serif font-bold text-emerald-950 mt-1">Live Normal</span>
              <span className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Payment Gateway Stable
              </span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center text-emerald-900">
              <span className="material-symbols-outlined text-[24px]">dns</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">
                Active Super Admins
              </span>
              <span className="text-lg font-serif font-bold text-emerald-950 mt-1">4 Principals</span>
              <span className="text-xs text-amber-800 font-medium mt-0.5">All 2FA Enforced</span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center text-emerald-900">
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">
                Current Payment Hold Pool
              </span>
              <span className="text-lg font-mono font-bold text-emerald-950 mt-1">₹1,42,85,600</span>
              <span className="text-xs text-stone-500 mt-0.5">Disbursement batch in 4h</span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <span className="material-symbols-outlined text-[24px]">account_balance</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">
                CIDR Allowlist Security
              </span>
              <span className="text-lg font-mono font-bold text-emerald-950 mt-1">
                {settings.cidrAllowlist}
              </span>
              <span className="text-xs text-emerald-700 mt-0.5 font-medium">Mumbai Core Perimeter</span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center text-emerald-900">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
          </div>
        </div>

        {/* Tab Sub-views or Main Settings Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Core Identity, Escrow Controls, and RBAC Matrix (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {/* Section A: Marketplace Identity & Tenant Parameters */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-900 text-[20px]">domain</span>
                  <h2 className="font-serif font-bold text-lg text-emerald-950">
                    Section A: Marketplace Identity & Tenant Parameters
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px] font-bold uppercase">
                  Platform Legal Information
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-stone-600 uppercase font-bold">
                    Platform Legal Entity Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-[18px]">
                       assured_workload
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 shadow-inner"
                      type="text"
                      value={settings.legalEntityName}
                      onChange={(e) => setSettings({ ...settings, legalEntityName: e.target.value })}
                    />
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Incorporated under Indian Companies Act 2013 | CIN: {settings.cin}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-stone-600 uppercase font-bold">
                    Merchant & Seller Support Helpline
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-[18px]">
                      support_agent
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 shadow-inner"
                      type="text"
                      value={settings.helpline}
                      onChange={(e) => setSettings({ ...settings, helpline: e.target.value })}
                    />
                  </div>
                  <span className="text-[11px] text-stone-400">
                    24/7 dedicated seller and customer escalation queue
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs text-stone-600 uppercase font-bold">
                    Statutory Grievance Officer & Redressal Desk
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-[18px]">
                        person
                      </span>
                      <input
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 shadow-inner"
                        type="text"
                        value={settings.grievanceOfficerName}
                        onChange={(e) =>
                          setSettings({ ...settings, grievanceOfficerName: e.target.value })
                        }
                      />
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-[18px]">
                        mail
                      </span>
                      <input
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-800 shadow-inner"
                        type="text"
                        value={settings.grievanceOfficerEmail}
                        onChange={(e) =>
                          setSettings({ ...settings, grievanceOfficerEmail: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Mandated under Information Technology (Intermediary Guidelines) Rules, 2021
                  </span>
                </div>
              </div>

              {/* Maintenance Mode Toggle Switch */}
              <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-emerald-950 shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">pause_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-stone-900">
                        Storefront Maintenance State
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          settings.maintenanceMode
                            ? "bg-amber-200 text-amber-900"
                            : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        {settings.maintenanceMode ? "MAINTENANCE ACTIVE" : "LIVE PUBLIC"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 max-w-xl mt-0.5">
                      When switched to maintenance mode, public browsing and checkout will render an unbranded institutional notice. Admin backend stays operational.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="text-xs text-stone-400 font-bold uppercase font-mono">
                    STATUS: {settings.maintenanceMode ? "ACTIVE" : "OFF"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.maintenanceMode}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setSettings({ ...settings, maintenanceMode: val });
                        showToast(
                          val
                            ? "Storefront set to maintenance mode. Public access restricted."
                            : "Storefront restored to live public operation."
                        );
                      }}
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section B: Payment Settlement & Payout Rules */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-900 text-[20px]">
                    account_balance
                  </span>
                  <h2 className="font-serif font-bold text-lg text-emerald-950">
                    Section B: Payment Settlement & Payout Rules
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
                  RBI NODAL COMPLIANT
                </span>
              </div>

              {/* Commission Tier Matrix with Sliders */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-stone-800">
                    Platform Commission Rates by Category
                  </h3>
                  <span className="text-xs text-stone-500">
                    Default Baseline: <strong className="text-emerald-950">8.0%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tier 1 */}
                  <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">Handlooms & Textiles</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-xs">
                        {settings.handloomCommission}%
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">Silk, Wool, Cotton, Apparel</span>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        className="w-full accent-emerald-900 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                        max="15"
                        min="3"
                        step="0.5"
                        type="range"
                        value={settings.handloomCommission}
                        onChange={(e) =>
                          setSettings({ ...settings, handloomCommission: parseFloat(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">Brass, Bronze & Metalware</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-xs">
                        {settings.metalCommission}%
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">Castings, utensils, decor</span>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        className="w-full accent-amber-700 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                        max="15"
                        min="3"
                        step="0.5"
                        type="range"
                        value={settings.metalCommission}
                        onChange={(e) =>
                          setSettings({ ...settings, metalCommission: parseFloat(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">Gourmet & Coffee</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-xs">
                        {settings.gourmetCommission}%
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400">Specialty Coffee, Spices, Teas</span>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        className="w-full accent-emerald-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                        max="15"
                        min="3"
                        step="0.5"
                        type="range"
                        value={settings.gourmetCommission}
                        onChange={(e) =>
                          setSettings({ ...settings, gourmetCommission: parseFloat(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hold Period & T+1 Qualifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div className="flex flex-col gap-2 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-600 uppercase font-bold">
                    Standard Payment Hold Duration
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="relative flex-1">
                      <input
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-800 shadow-inner"
                        type="number"
                        value={settings.escrowHoldHours}
                        onChange={(e) =>
                          setSettings({ ...settings, escrowHoldHours: parseInt(e.target.value) || 0 })
                        }
                      />
                      <span className="absolute right-3 top-2 text-xs text-stone-400 font-medium">
                        Hours
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-stone-400 text-[20px]">timer</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Countdown commences upon digital delivery proof and customer delivery confirmation.
                  </p>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600 uppercase font-bold">
                      Fast Payout Eligibility
                    </span>
                    <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
                  </div>
                  <ul className="flex flex-col gap-1.5 mt-1 text-xs text-stone-700">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">
                        check_circle
                      </span>
                      <span>
                        Seller dispatch rate strictly <strong>&gt; 99.0%</strong> over last 90 days
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">
                        check_circle
                      </span>
                      <span>
                        Minimum <strong>&gt; 100 lifetime completed</strong> marketplace orders
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">
                        check_circle
                      </span>
                      <span>Zero (0) unresolved product policy or quality claims</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section C: Role-Based Access Control (RBAC) & Administrative Team */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-900 text-[20px]">
                      shield_person
                    </span>
                    <h2 className="font-serif font-bold text-lg text-emerald-950">
                      Section C: Administrator Roles & Permissions
                    </h2>
                  </div>
                  <span className="text-xs text-stone-500">
                    Active Administrator roster with fine-grained capability delegation
                  </span>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Invite Administrator
                </button>
              </div>

              {/* RBAC Table */}
              <div className="overflow-x-auto rounded-lg border border-stone-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                      <th className="py-3 px-4">Administrator & Identity</th>
                      <th className="py-3 px-4">Assigned Role & Privileges</th>
                      <th className="py-3 px-4">MFA / Cryptographic Token</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${admin.avatarBg} flex items-center justify-center font-serif font-bold text-xs`}
                            >
                              {admin.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-stone-900 leading-tight">
                                {admin.name}
                              </span>
                              <span className="font-mono text-stone-400 text-[11px]">
                                {admin.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-emerald-950">{admin.role}</span>
                            <span className="text-stone-500 text-[11px]">{admin.privileges}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-stone-100 text-stone-800 font-mono text-[11px] border border-stone-200">
                            <span className="material-symbols-outlined text-[15px] text-emerald-800">
                              usb
                            </span>
                            {admin.tokenType}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${admin.statusClass}`}
                          >
                            {admin.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() =>
                              showToast(`Access key options for ${admin.name} opened.`)
                            }
                            className="p-1 rounded text-stone-400 hover:text-emerald-900 transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Security Vault & Privileged Controls (4 Cols) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            {/* Section D: Security & Cryptographic Audit Vault */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <span className="material-symbols-outlined text-emerald-900 text-[20px]">
                  encrypted
                </span>
                <h2 className="font-serif font-bold text-lg text-emerald-950">
                  Section D: Security & Audit Vault
                </h2>
              </div>

              {/* Inactivity Timeout Parameter */}
              <div className="flex flex-col gap-1 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 uppercase font-bold">
                    Idle Session Timeout
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                    {settings.idleSessionTimeout} MIN
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Zero-tolerance automatic session invalidation on non-interactive supervisory consoles.
                </p>
              </div>

              {/* IP Allowlisting */}
              <div className="flex flex-col gap-1.5 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 uppercase font-bold">
                    Mumbai Core CIDR Allowlist
                  </span>
                  <span className="material-symbols-outlined text-emerald-900 text-[18px]">lock</span>
                </div>
                <div className="font-mono text-xs px-2 py-1.5 rounded bg-white border border-stone-200 text-emerald-950 font-bold">
                  {settings.cidrAllowlist}
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Enforced on Admin & Payments</span>
                  <button
                    onClick={() => showToast("Subnet addition protocol opened.")}
                    className="text-amber-800 font-semibold hover:underline"
                    type="button"
                  >
                    Add Subnet
                  </button>
                </div>
              </div>

              {/* Mandatory Justification Reason Capture */}
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex flex-col gap-1">
                <div className="flex items-start gap-2.5">
                  <input
                    checked={settings.mandatoryJustification}
                    onChange={(e) =>
                      setSettings({ ...settings, mandatoryJustification: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-emerald-900 accent-emerald-900 cursor-pointer"
                    id="reason-capture-check"
                    type="checkbox"
                  />
                  <label className="flex flex-col cursor-pointer" htmlFor="reason-capture-check">
                    <span className="text-xs font-bold text-stone-900">
                      Mandatory Written Justification
                    </span>
                    <span className="text-[11px] text-stone-500 mt-0.5">
                      Strictly require verifiable operational justification notes prior to committing store suspensions, product delisting, or payment hold overrides.
                    </span>
                  </label>
                </div>
              </div>

              {/* Micro Cryptographic Ledger Signature Visualizer */}
              <div className="p-4 rounded-lg bg-emerald-950 text-white flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
                    Immutable Audit Head
                  </span>
                  <span className="font-mono text-[11px] text-amber-300">BLOCK #984,219</span>
                </div>
                <div className="font-mono text-[10px] text-emerald-200 break-all leading-tight bg-black/40 p-2 rounded border border-emerald-800">
                  SHA256: 8fa02e9bc2e1189d53c7a149b1192e59178ad3cf461e51f8a84618a8b1ef2d84
                </div>
                <div className="flex items-center justify-between text-[10px] text-emerald-400 pt-1">
                  <span>Sync Node: ap-south-1a</span>
                  <span>Verified by 3 Quorum Nodes</span>
                </div>
              </div>
            </div>

            {/* Section E: Destructive Action Zone (Privileged Zone) */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-red-700 uppercase font-bold tracking-wider">
                    RESTRICTED ZONE
                  </span>
                  <h3 className="font-serif font-bold text-sm text-stone-900 mt-0.5">
                    Emergency Marketplace Halt & Payment Freeze
                  </h3>
                </div>
              </div>
              <p className="text-xs text-stone-600">
                Immediately halts all checkout transactions across all 512 storefronts and locks scheduled disbursements from payment reserves.
              </p>
              <div className="p-3 rounded-lg bg-white border border-red-200 text-stone-600 text-xs flex flex-col gap-1">
                <span className="font-bold text-red-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">key_vertical</span>
                  Requires Dual-Admin Physical Key Protocol
                </span>
                <span className="text-[11px] text-stone-500">
                  Must be co-signed by Root Administrator + Financial Controller within 90 seconds.
                </span>
              </div>
              <button
                onClick={() =>
                  showToast(
                    "Emergency Lock requires dual physical security tokens. Protocol aborted.",
                    "error"
                  )
                }
                className="w-full mt-1 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Initiate Emergency Halt Handshake</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 border border-stone-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-900 text-[22px]">
                  person_add
                </span>
                <h3 className="font-serif font-bold text-lg text-emerald-950">
                  Invite Administrator
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-stone-600">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Kavita Krishnan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 shadow-inner"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-stone-600">Government / Institutional Email</label>
                <input
                  required
                  type="email"
                  placeholder="k.krishnan@veyra.gov.in"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 shadow-inner"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-stone-600">Delegated Role</label>
                <select
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                >
                  <option value="Trust & Safety Officer">Trust & Safety Officer</option>
                  <option value="Financial Controller">Financial Controller</option>
                  <option value="Customer Concierge Lead">Customer Concierge Lead</option>
                  <option value="Root Administrator">Root Administrator</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-stone-600">MFA Challenge Method</label>
                <select
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
                  value={inviteForm.tokenType}
                  onChange={(e) => setInviteForm({ ...inviteForm, tokenType: e.target.value })}
                >
                  <option value="Authenticator App (TOTP)">Authenticator App (TOTP)</option>
                  <option value="YubiKey 5C FIPS">Hardware Security Key (FIPS)</option>
                  <option value="SMS Fallback & App">App + SMS Fallback</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 mt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-medium transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-900 text-white hover:bg-emerald-950 text-xs font-semibold shadow-sm transition-colors"
                >
                  Dispatch Security Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

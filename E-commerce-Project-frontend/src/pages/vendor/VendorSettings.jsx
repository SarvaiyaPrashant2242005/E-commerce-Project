// VEYRA Seller Workspace — Store Settings
// Aligned with Google Stitch: veyra_seller_storefront_settings
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { vendorApi } from "../../api/vendor.api";

const KAVERI_STORE_ID = "66f44d5c9e2b1a3d4f8e9b01";

const PRESET_BANNERS = [
  {
    label: "Bagru Courtyard Textile Racks",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "Varanasi Ghat Loom Studio",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "Brass Foundry Crucible",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80",
  },
];

const VendorSettings = () => {
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({
    name: "Kaveri Living",
    tagline: "Slow-spun mulberry silk and handloom heirloom textiles from the ghats of Varanasi.",
    description: "Founded by fifth-generation master weavers, Kaveri Living preserves ancestral pit-loom techniques, cultivating ethical wild silks and botanical indigo vats that breathe timeless Indian heritage into contemporary sanctuaries.",
    guild: "Textiles & Weaves",
    location: "Varanasi, Uttar Pradesh",
    masterArtisan: "Devendra & Shanti Sharma",
    artisanTitle: "Master Weaver",
    artisanStory: "Every piece passes through thirty-six precise hand gestures, beginning with raw yarn warping in the morning river mist and concluding with hand-twisted golden zari edging.",
    bannerImage: PRESET_BANNERS[0].url,
    avatarImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    contactEmail: "support@kaveriliving.com",
    contactPhone: "+91 542 228 9011",
    establishedYear: 1894,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    vendorApi
      .getStoreProfile()
      .then((data) => {
        if (data) {
          setStore(data);
          setForm({
            name: data.name || "Kaveri Living",
            tagline: data.tagline || "",
            description: data.description || "",
            guild: data.guild || "Textiles & Weaves",
            location: data.location || "Varanasi, Uttar Pradesh",
            masterArtisan: data.masterArtisan || "Devendra Sharma",
            artisanTitle: data.artisanTitle || "Master Weaver",
            artisanStory: data.artisanStory || "",
            bannerImage: data.bannerImage || PRESET_BANNERS[0].url,
            avatarImage: data.avatarImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
            contactEmail: data.contactEmail || "support@kaveriliving.com",
            contactPhone: data.contactPhone || "+91 542 228 9011",
            establishedYear: data.establishedYear || 1894,
          });
        }
      })
      .catch((err) => setError(err.message || "Failed to load store profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await vendorApi.updateStoreProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || "Failed to save store settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-6">
        <div className="h-8 bg-surface-container rounded-xl w-1/3" />
        <div className="h-64 bg-surface-container rounded-2xl" />
        <div className="h-48 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header & Live Storefront Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-caslon font-bold text-2xl text-primary tracking-tight">
            Store Settings
          </h1>
          <p className="text-xs text-outline mt-0.5">
            Configure your store identity, description, banner imagery, and customer communication channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/stores/${KAVERI_STORE_ID}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">visibility</span>
            <span>Preview Store ↗</span>
          </Link>
          <button
            type="submit"
            form="storeSettingsForm"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-container text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Store profile updated successfully! Changes are live on your public storefront.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      <form id="storeSettingsForm" onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Core Store Identity */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Core Store Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Store Display Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 px-4 text-xs font-bold bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary-container"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Store Category *
              </label>
              <input
                type="text"
                required
                value={form.guild}
                onChange={(e) => setForm({ ...form, guild: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Store Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Store Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Store Visual Assets */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Store Logo &amp; Banner
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Logo */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Store Logo (1:1 Avatar)
              </label>
              <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col items-center gap-3 border border-surface-container">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-container-high shadow-xs">
                  <img src={form.avatarImage} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <input
                  type="url"
                  value={form.avatarImage}
                  onChange={(e) => setForm({ ...form, avatarImage: e.target.value })}
                  placeholder="Avatar URL"
                  className="w-full px-3 py-1.5 text-[11px] bg-surface-container-lowest rounded-lg border border-surface-container"
                />
              </div>
            </div>

            {/* Store Banner */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                Store Banner (16:9 Recommended)
              </label>
              <div className="h-32 rounded-2xl overflow-hidden border border-surface-container shadow-xs relative">
                <img src={form.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/30 flex items-end p-3 text-white text-xs font-bold">
                  <span>{form.name} Banner</span>
                </div>
              </div>

              <input
                type="url"
                value={form.bannerImage}
                onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                placeholder="Banner Image URL"
                className="w-full px-4 py-2 text-xs bg-surface-container-low text-on-surface rounded-xl border border-surface-container"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] text-outline font-semibold uppercase block w-full">
                  Presets:
                </span>
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setForm({ ...form, bannerImage: preset.url })}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all cursor-pointer ${
                      form.bannerImage === preset.url
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Store Description & About */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
                03
              </span>
              <h2 className="font-serif-caslon font-bold text-base text-primary">
                Store Description &amp; About
              </h2>
            </div>
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]" title="GI Tag Verified">
              verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Seller / Owner Name
              </label>
              <input
                type="text"
                value={form.masterArtisan}
                onChange={(e) => setForm({ ...form, masterArtisan: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Seller Title
              </label>
              <input
                type="text"
                value={form.artisanTitle}
                onChange={(e) => setForm({ ...form, artisanTitle: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Store Description
            </label>
            <textarea
              rows={4}
              value={form.artisanStory}
              onChange={(e) => setForm({ ...form, artisanStory: e.target.value })}
              className="w-full p-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container leading-relaxed"
            />
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center gap-3 border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[22px]">workspace_premium</span>
            <div>
              <p className="font-bold text-xs text-primary">Geographical Indication (GI) Registered Seller</p>
              <p className="text-[11px] text-outline">
                Authenticated under Registry of Handloom Artisans, Varanasi corridor (#GI-UP-8821).
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Public Contact & Support */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <span className="w-6 h-6 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
              04
            </span>
            <h2 className="font-serif-caslon font-bold text-base text-primary">
              Public Contact &amp; Support
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Public Store Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Customer Support WhatsApp
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full h-11 px-4 text-xs font-medium bg-surface-container-low text-on-surface rounded-xl border border-surface-container"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VendorSettings;

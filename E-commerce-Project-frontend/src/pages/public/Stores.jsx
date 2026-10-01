// VEYRA Stores Directory
// Aligned with Google Stitch: veyra_all_stores_directory
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { storesApi } from "../../api";

const STORE_CATEGORIES = [
  "All",
  "Textiles & Weaves",
  "Ceramics & Stoneware",
  "Hand-Block Printing",
  "Fragrance & Rituals",
  "Woodcraft & Furniture",
];

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storesApi.getStores();
      setStores(data);
    } catch (err) {
      setError(err.message || "Unable to load stores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.guild?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.masterArtisan?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        store.guild?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, selectedCategory]);

  const spotlightStores = useMemo(() => {
    return stores.filter((s) => s.isVerified);
  }, [stores]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Header */}
      <nav className="flex items-center gap-1.5 text-xs text-outline mb-4">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
        <span className="text-on-surface font-semibold">Stores</span>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-semibold">
          {stores.length} Verified Stores
        </span>
      </nav>

      <div>
        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
          Store Directory
        </span>
        <h1 className="font-serif-caslon font-bold text-3xl sm:text-4xl text-primary-container mt-1">
          Stores &amp; Boutiques
        </h1>
        <p className="font-sans text-sm sm:text-base text-outline mt-2 max-w-2xl leading-relaxed">
          Discover verified sellers, ethical handloom weavers, and generational makers across the Indian subcontinent.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="mt-8 bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-4 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by store name, city (e.g. Varanasi, Jaipur, Bhuj), or product category..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STORE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-primary-container text-white shadow-xs"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Stores Spotlight Section */}
      {!searchQuery && selectedCategory === "All" && spotlightStores.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
                Featured Stores
              </h2>
            </div>
            <span className="font-sans text-xs text-secondary font-semibold">Featured Stores</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spotlightStores.slice(0, 4).map((store) => (
              <Link
                key={store._id}
                to={`/stores/${store._id}`}
                className="group bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                  <img
                    src={store.bannerImage}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs text-primary font-sans text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <span>{store.badges?.[0] || "Verified Store"}</span>
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-caslon font-bold text-base text-primary-container group-hover:text-secondary transition-colors">
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-secondary text-xs font-bold">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span>{store.rating}</span>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-outline line-clamp-1 mt-0.5">{store.tagline}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-outline pt-2 border-t border-surface-container">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span>{store.location}</span>
                    </span>
                    <span className="font-medium text-on-surface">{store.salesCount}+ orders</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Stores Directory */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
            <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
              All Stores ({filteredStores.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-surface-container-low rounded-2xl h-72 animate-pulse border border-surface-container" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-error/30 text-center max-w-md mx-auto">
            <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
            <p className="text-sm text-error font-medium">{error}</p>
            <button
              onClick={fetchStores}
              className="mt-4 px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-surface-container">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">storefront</span>
            <h3 className="font-serif-caslon font-bold text-lg text-primary-container">No Stores Match Your Search</h3>
            <p className="text-xs text-outline mt-1 max-w-sm mx-auto">
              Try adjusting your category filter or searching for another keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store._id}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Banner & Avatar */}
                <div className="relative h-40 bg-surface-container overflow-hidden">
                  <img
                    src={store.bannerImage}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <img
                      src={store.avatarImage}
                      alt={store.masterArtisan}
                      className="w-12 h-12 rounded-full object-cover border-2 border-surface-container-lowest shadow-sm"
                    />
                    <div>
                      <h3 className="font-serif-caslon font-bold text-lg text-white">
                        {store.name}
                      </h3>
                      <p className="font-sans text-[11px] text-white/80">{store.guild}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                      {store.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {store.badges?.map((b) => (
                        <span key={b} className="text-[10px] font-semibold text-secondary bg-surface-container px-2 py-0.5 rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                    <div>
                      <span className="font-sans text-[11px] text-outline block">{store.location}</span>
                      <span className="font-sans text-xs font-semibold text-secondary">
                        ★ {store.rating} ({store.reviewsCount} reviews)
                      </span>
                    </div>
                    <Link
                      to={`/stores/${store._id}`}
                      className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <span>Visit Store</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Stores;
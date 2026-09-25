// VEYRA Individual Storefront
// Aligned with Google Stitch: veyra_storefront_kaveri_living
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storesApi, productsApi } from "../../api";
import ProductCard from "../../components/ProductCard";

const StoreDetail = () => {
  const { id } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storeData = await storesApi.getStoreById(id);
        setStore(storeData);

        // Fetch products created by this studio
        const prodsData = await productsApi.getProducts({ store: storeData?._id || id });
        setProducts(prodsData.products || []);
      } catch (err) {
        setError(err.message || "Unable to load store.");
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-64 bg-surface-container rounded-3xl" />
        <div className="h-32 bg-surface-container rounded-2xl max-w-2xl mx-auto" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center text-error mb-4">
          <span className="material-symbols-outlined text-3xl">storefront</span>
        </div>
        <h2 className="font-serif-caslon font-bold text-2xl text-primary-container mb-2">
          Store Not Found
        </h2>
        <p className="text-xs text-outline mb-6">
          The requested store does not exist or is currently inactive.
        </p>
        <Link
          to="/stores"
          className="inline-flex px-6 py-2.5 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-all"
        >
          Return to All Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-outline mb-4">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
        <Link to="/stores" className="hover:text-primary transition-colors">
          Stores
        </Link>
        <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
        <span className="text-on-surface font-semibold truncate max-w-[200px]">{store.name}</span>
      </nav>

      {/* Panoramic Store Banner */}
      <div className="relative w-full h-56 sm:h-72 lg:h-80 rounded-3xl overflow-hidden shadow-sm bg-surface-container">
        <img
          src={store.bannerImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
            Verified Store
          </span>
        </div>
      </div>

      {/* Store Identity Card (Overlapping Hero) */}
      <div className="max-w-4xl mx-auto -mt-16 sm:-mt-20 relative z-10 px-2 sm:px-4">
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-surface-container-high space-y-6">
          {/* Header Row: Avatar, Name & Location */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              <img
                src={store.avatarImage}
                alt={store.masterArtisan}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-surface-container-lowest shadow-md"
              />
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shadow-xs"
                title="Verified Seller"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="font-serif-caslon font-bold text-2xl sm:text-3xl text-primary-container">
                  {store.name}
                </h1>
                <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <p className="font-sans text-xs text-outline mt-1 flex items-center justify-center sm:justify-start gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>{store.location}</span>
                <span className="mx-1">•</span>
                <span className="text-secondary font-medium">{store.guild}</span>
              </p>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed">
                {store.description}
              </p>
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-3 bg-surface-container-low rounded-xl p-3 sm:p-4 text-center divide-x divide-surface-container">
            <div>
              <div className="flex items-center justify-center gap-1 text-secondary font-bold text-base sm:text-lg">
                <span>{store.rating}</span>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <span className="font-sans text-[11px] text-outline mt-0.5 block">{store.reviewsCount} Customer Reviews</span>
            </div>
            <div>
              <span className="font-sans font-bold text-base sm:text-lg text-primary block">
                {store.salesCount}+
              </span>
              <span className="font-sans text-[11px] text-outline mt-0.5 block">Orders Fulfilled</span>
            </div>
            <div>
              <span className="font-sans font-bold text-base sm:text-lg text-primary block">
                {products.length}
              </span>
              <span className="font-sans text-[11px] text-outline mt-0.5 block">Products</span>
            </div>
          </div>

          {/* Action Buttons & Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-surface-container">
            <div className="flex flex-wrap items-center gap-2">
              {store.badges?.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full bg-tertiary-container/10 text-on-tertiary-container text-[11px] font-semibold"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setFollowing(!following)}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  following
                    ? "bg-surface-container text-primary border border-surface-container-high"
                    : "bg-primary-container text-white hover:bg-primary shadow-xs"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {following ? "check" : "add"}
                </span>
                <span>{following ? "Following Store" : "Follow Store"}</span>
              </button>

              <a
                href={`mailto:${store.contactEmail}`}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Store Tabs */}
      <div className="mt-12 border-b border-surface-container flex items-center gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-outline hover:text-on-surface"
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("story")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "story"
              ? "border-primary text-primary"
              : "border-transparent text-outline hover:text-on-surface"
          }`}
        >
          Store Story
        </button>
      </div>

      {/* Tab Content: Products */}
      {activeTab === "all" ? (
        <div className="mt-8">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-surface-container">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">inventory_2</span>
              <p className="text-xs text-outline">Currently preparing new inventory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Tab Content: Story */
        <div className="mt-8 bg-surface-container-lowest p-8 rounded-2xl border border-surface-container-high max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={store.avatarImage}
              alt={store.masterArtisan}
              className="w-16 h-16 rounded-full object-cover border-2 border-surface-container"
            />
            <div>
              <h3 className="font-serif-caslon font-bold text-xl text-primary-container">
                {store.masterArtisan}
              </h3>
              <p className="font-sans text-xs text-secondary font-semibold">{store.artisanTitle}</p>
            </div>
          </div>
          <blockquote className="font-serif-caslon italic text-base sm:text-lg text-on-surface border-l-4 border-secondary pl-4 py-1 leading-relaxed">
            "{store.artisanStory}"
          </blockquote>
          <p className="font-sans text-xs sm:text-sm text-outline leading-relaxed">
            Established in {store.establishedYear}, this store maintains fair business practices and certified quality standards on VEYRA.
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;

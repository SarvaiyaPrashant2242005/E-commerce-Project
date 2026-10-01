import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productsApi } from "../../api";
import ProductCard from "../../components/ProductCard";

// Department categories aligned with VEYRA Master Taxonomy
const CATEGORIES = [
  "All",
  "Handloom",
  "Home Living",
  "Artisan Coffee",
  "Desk & Tech",
  "Pottery",
  "Fine Jewelry",
];

const POPULAR_SEARCH_SUGGESTIONS = [
  "Handloom Cotton",
  "Brass Coffee Filter",
  "Ceramic Tableware",
  "Kaveri Living",
  "Origin Roasters",
];

// Skeleton loading card matching Stitch 4-col grid
const ProductSkeleton = () => (
  <div className="bg-surface-container-lowest rounded-2xl p-3 sm:p-4 border border-surface-container-high shadow-xs animate-pulse flex flex-col justify-between">
    <div>
      <div className="aspect-square w-full rounded-xl bg-surface-container mb-3" />
      <div className="h-3 bg-surface-container rounded w-1/3 mb-2" />
      <div className="h-4 bg-surface-container rounded w-3/4 mb-1.5" />
      <div className="h-3 bg-surface-container rounded w-1/2" />
    </div>
    <div className="pt-3 mt-3 border-t border-surface-container flex items-center justify-between">
      <div className="h-5 bg-surface-container rounded w-1/3" />
      <div className="w-9 h-9 bg-surface-container rounded-xl" />
    </div>
  </div>
);

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const storeParam = searchParams.get("store") || "";
  const sortParam = searchParams.get("sort") || "featured";
  const inStockParam = searchParams.get("inStock") === "true";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  // Component State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Sync search input if query param changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch live products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getProducts({
        search: searchQuery || undefined,
        category: categoryParam && categoryParam !== "All" ? categoryParam : undefined,
        store: storeParam || undefined,
      });
      setProducts(data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load products. Please check server connection."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryParam, storeParam]);

  // Update query params helper
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    updateParam("search", "");
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  // Client-side filtering & sorting on actual live data
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Category filter (ensures match if backend did not filter)
    if (categoryParam && categoryParam !== "All") {
      const targetCat = categoryParam.toLowerCase();
      list = list.filter((p) => p.category && p.category.toLowerCase().includes(targetCat));
    }

    // In-Stock only filter
    if (inStockParam) {
      list = list.filter((p) => p.stock > 0);
    }

    // Max Price filter
    if (maxPriceParam && Number(maxPriceParam) > 0) {
      list = list.filter((p) => Number(p.price) <= Number(maxPriceParam));
    }

    // Sort order
    switch (sortParam) {
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "featured":
      default:
        break;
    }

    return list;
  }, [products, categoryParam, inStockParam, maxPriceParam, sortParam]);

  // Active filter count
  const activeFilterCount =
    (categoryParam && categoryParam !== "All" ? 1 : 0) +
    (inStockParam ? 1 : 0) +
    (maxPriceParam ? 1 : 0) +
    (storeParam ? 1 : 0);

  const sortLabels = {
    featured: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    rating: "Customer Rating",
    newest: "Newest Arrivals",
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* =========================================================================
          SECTION 1: Breadcrumbs & Header Context
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav
          className="flex items-center gap-1.5 text-xs text-outline overflow-x-auto whitespace-nowrap pb-2 select-none"
          aria-label="Breadcrumbs"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          {categoryParam && (
            <>
              <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
              <span className="text-on-surface font-semibold">{categoryParam}</span>
            </>
          )}
          {searchQuery && (
            <>
              <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
              <span className="text-on-surface font-semibold truncate max-w-[200px]">
                Search: "{searchQuery}"
              </span>
            </>
          )}
        </nav>

        {/* Search Context Bar (If user is searching or clicks search icon) */}
        {searchQuery ? (
          <div className="mt-2 mb-4 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high shadow-xs">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <span className="material-symbols-outlined text-[20px] text-primary ml-3 select-none">
                search
              </span>
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products or stores..."
                className="w-full h-11 pl-2.5 pr-20 bg-transparent font-sans text-sm text-on-surface placeholder:text-outline outline-none"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="w-7 h-7 flex items-center justify-center text-outline hover:text-primary rounded-full hover:bg-surface-container transition-colors"
                    title="Clear search query"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Suggestions Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-surface-container mt-3">
              <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">
                Suggestions:
              </span>
              {POPULAR_SEARCH_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => {
                    setSearchInput(sug);
                    updateParam("search", sug);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-surface-container hover:bg-secondary-fixed hover:text-on-secondary-fixed text-xs text-on-surface-variant whitespace-nowrap transition-colors border border-surface-container-high cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Catalog Headline & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mt-2">
          <div>
            <h1 className="font-serif-caslon font-bold text-2xl sm:text-3xl text-primary-container tracking-tight">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : categoryParam && categoryParam !== "All"
                ? `${categoryParam} Collection`
                : "All Products"}
            </h1>
            <p className="text-xs text-on-surface-variant font-sans mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              <span>
                Showing <strong className="text-on-surface font-semibold">{filteredAndSortedProducts.length}</strong>{" "}
                item{filteredAndSortedProducts.length === 1 ? "" : "s"}
                {storeParam ? ` from store (${storeParam})` : " across verified independent stores"}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Sticky Filter, Category Strip & Sort Bar
          ========================================================================= */}
      <section className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-y border-surface-container-high py-2.5 px-4 sm:px-6 lg:px-8 mt-2 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Filter Drawer Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary-container font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              aria-label="Toggle Filter Options"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary-container text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick Category Chips Strip (Desktop & Mobile) */}
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-xl">
              {CATEGORIES.map((cat) => {
                const isSelected = (!categoryParam && cat === "All") || categoryParam === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => updateParam("category", cat)}
                    className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-primary-container text-white border-primary font-semibold"
                        : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary-container font-sans text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer select-none"
              aria-label="Select sorting option"
            >
              <span className="material-symbols-outlined text-[16px] text-outline">swap_vert</span>
              <span>
                Sort: <strong className="text-primary font-semibold">{sortLabels[sortParam] || "Featured"}</strong>
              </span>
              <span className="material-symbols-outlined text-[15px] text-outline">expand_more</span>
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-surface-container-lowest shadow-lg border border-surface-container-high p-1.5 z-40 flex flex-col gap-0.5 animate-fade-up">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      updateParam("sort", key);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-sans flex items-center justify-between transition-colors ${
                      sortParam === key
                        ? "bg-surface-container text-primary font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                    }`}
                  >
                    <span>{label}</span>
                    {sortParam === key && (
                      <span className="material-symbols-outlined text-[15px] text-secondary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {activeFilterCount > 0 && (
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
            <span className="text-[11px] font-semibold text-outline uppercase tracking-wider mr-1">
              Active:
            </span>
            {categoryParam && categoryParam !== "All" && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface font-medium">
                <span>Category: {categoryParam}</span>
                <button
                  onClick={() => updateParam("category", "")}
                  className="hover:text-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )}
            {inStockParam && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface font-medium">
                <span>In Stock Only</span>
                <button
                  onClick={() => updateParam("inStock", "")}
                  className="hover:text-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )}
            {maxPriceParam && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface font-medium">
                <span>Max: ₹{maxPriceParam}</span>
                <button
                  onClick={() => updateParam("maxPrice", "")}
                  className="hover:text-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )}
            {storeParam && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface font-medium">
                <span>Store ID: {storeParam}</span>
                <button
                  onClick={() => updateParam("store", "")}
                  className="hover:text-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-secondary hover:underline font-semibold ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: Expandable Filter Drawer / Sidebar Panel
          ========================================================================= */}
      {filterDrawerOpen && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 animate-fade-up">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Taxonomy Filter */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-primary uppercase tracking-wider mb-2.5">
                Category
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam("category", cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                      (!categoryParam && cat === "All") || categoryParam === cat
                        ? "bg-primary-container text-white font-semibold"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Brackets Filter */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-primary uppercase tracking-wider mb-2.5">
                Price Ceiling (INR)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2500, 5000].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateParam("maxPrice", maxPriceParam === String(val) ? "" : String(val))}
                    className={`py-1.5 px-2 rounded-xl text-xs font-sans text-center transition-colors cursor-pointer border ${
                      maxPriceParam === String(val)
                        ? "bg-primary-container text-white border-primary font-semibold"
                        : "bg-surface-container text-on-surface border-surface-container-high hover:bg-surface-container-high"
                    }`}
                  >
                    Under ₹{val.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-primary uppercase tracking-wider mb-2.5">
                Availability
              </h3>
              <label className="flex items-center gap-2 text-xs font-sans text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateParam("inStock", e.target.checked ? "true" : "")}
                  className="w-4 h-4 rounded text-primary accent-primary"
                />
                <span>In Stock Only ({products.filter((p) => p.stock > 0).length} items)</span>
              </label>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-1.5 rounded-xl border border-outline-variant text-xs font-medium hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors cursor-pointer"
                >
                  Close Filters
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: Products Grid & Explicit State Handling
          ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {/* State A: Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* State B: Error State (Real backend failure with Retry button) */}
        {!loading && error && (
          <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-2xl border border-error/30 text-center max-w-xl mx-auto shadow-xs flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-error">cloud_off</span>
            <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
              Unable to load products
            </h2>
            <p className="font-sans text-xs sm:text-sm text-outline max-w-md">
              {error}
            </p>
            <button
              onClick={fetchProducts}
              className="mt-2 px-5 py-2 rounded-xl bg-primary-container text-white font-sans text-xs sm:text-sm font-semibold hover:bg-primary transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* State C: Empty State (Successful request but 0 matching items) */}
        {!loading && !error && filteredAndSortedProducts.length === 0 && (
          <div className="bg-surface-container-lowest p-8 sm:p-14 rounded-2xl border border-surface-container-high text-center max-w-xl mx-auto shadow-xs flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-outline/60">inventory_2</span>
            <h2 className="font-serif-caslon font-bold text-xl text-primary-container">
              No products found
            </h2>
            <p className="font-sans text-xs sm:text-sm text-outline max-w-md leading-relaxed">
              {searchQuery
                ? `No products matched "${searchQuery}". Try broadening your search or clearing active filters.`
                : activeFilterCount > 0
                ? "No products match the selected filters. Try resetting the filters."
                : "No products are currently published in the catalog. Check back soon!"}
            </p>
            {activeFilterCount > 0 || searchQuery ? (
              <button
                onClick={clearAllFilters}
                className="mt-2 px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary-container font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Clear All Filters &amp; Search
              </button>
            ) : null}
          </div>
        )}

        {/* State D: Success State (Live Product Grid) */}
        {!loading && !error && filteredAndSortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
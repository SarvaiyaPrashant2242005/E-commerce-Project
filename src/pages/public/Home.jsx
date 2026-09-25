import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productsApi, storesApi } from "../../api";
import { addToCart } from "../../features/cart/cartSlice";

// Curated Category Departments from Google Stitch
const departments = [
  {
    name: "All Items",
    icon: "auto_awesome",
    isIcon: true,
    query: "",
  },
  {
    name: "Handloom",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPu2qhO3ONl2BjFu-m4yCacfc-k4r3XdtySNy9PJhUk4XfW1fFHlmgMRER-EUtzXj5-NgcAIQh2TVaXsbFMgDtZ-dwjfw8iO9xBLrFPkUfXxQvg1jEkgwm7ZA41pq066tOzxbZ1sD2FUY2QjPe9hQ_tV_jd1yqA7_BlN4cHJ9CeFCAAEDvElH_igFNubP6ETyMc5wK9mvIWN2UIR7HV1sGIyDM9RcJwWkKMWAefXfuWPfKJixmaTnzLQ",
    query: "Handloom",
  },
  {
    name: "Home Living",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEm64WztimBpThAQ14o9kPk5pzWuC6XpIt-JP-CDoHZ3aLHOs6bcqfDOScNisE1o9YJE3eI6bPzxTzr9KJd0qJvV86hwoDns8XJlVGx3LrMLC6KkklCeFkG3McDpZ1bk2nTSigSF9OnugBW3po0mVTXAm3gvvT0h7Tq0_5rNqt-T3lwOA4usFJx72wJLUyvPPBXuhpVyFsgV7A6-XY0pBZnqxl-gEZYeGqDUiF4J1cF0rPttgNjG_HcA",
    query: "Home",
  },
  {
    name: "Artisan Coffee",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEHPBklf_NbdZLAyXwCnqzBWM_Tf-n4pYOdKl321FH_37FpWIJUJD4GPwC5KeOKaZb-Hfn92mpEz7z4efKAOEXyypA0Er9zxu70_Il1Zo0JWBmShlgrMtiKRYMh4xkoHS07FESZUkpUDfzEHWBKJyI3Q2TkYmBmg2mBzCduqjpaP4SLxWuw6YJK8rRdqN1bszHbhm49IFWuNQnwGIHjPgvmjI7uIWYwQqpzjb490Mn9emINhpeZBYV9Q",
    query: "Coffee",
  },
  {
    name: "Desk & Tech",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMZe1WwaeAQ7o8-yZ_Y_Ylg8rWW6gcnXpV5KZg4m8OjMf0VHjl_D94PQlMTvFatUDO2VSKKTpXkLLFjWwxSS17ACQO5zQR2wdl2_YycqV3GD8u6Wc_KNB0WkXKU_Ruz5_93t0gcqzKbEgaLHGvveLFcjnHkYY7qLupS_f27gbbE88063rtsJtRIAa_338LIYrcCdMiUYe03N_jlS3d2yas2VZ5gQaDo9Fn9Z3T6m50p-kcgafmGcszmw",
    query: "Desk",
  },
  {
    name: "Pottery",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9nIvX28VZpndCk9Mft8M30JrPhKEGQnW1T1wBh8tJGucr_dgvS5rtiu2V-Dm7xJ-kkPJkdqMWnbuqx5fT90dENnGyYA4sDQ0dclWhyYXgyoFvozpKJ5M0rmOsg7vl-f_iVViTMrJnv6K7STNZUIuftmlU1iKjEGCnWQ-Ya8VwQPAcNNKHs6C_AO016wbN09V6fAKk9TEcXiR6BufHA1_mmkHGgsqrSyfXhj_b-MdEHUlutEwvtjGBBA",
    query: "Ceramics",
  },
  {
    name: "Fine Jewelry",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVzK5HRBOdVUoiIIWdAC3GPWWP8Mj3guoYaVP3uLEjYWgUj483Tms7LF0030TFI-Lm799Hs_LP-6F3HJDq1DwsDyhFQn2w4d5BTPPqrZB40IYoIF-fs-BuxCvNFP-z9IYAbKu83DaX1_zYlY4OuD9CuPHLpkFJCNqqREQrLixidXhTQNGoPuahSqPRiKbDwbSc5XFvzz7G6p3Z1fSVD0vL82xxYk_ozV77x8S1zzJAZO3QmaTox6qW_g",
    query: "Jewelry",
  },
];

// Verified Stores
const defaultStores = [
  {
    _id: "store-kaveri",
    name: "Kaveri Living",
    tagline: "Organic blockprint bedding",
    location: "Jaipur, RJ",
    avatar: "K",
    rating: "4.9",
    reviews: "1,240",
    badge: "48 curated items",
    banner:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvH8tidELOi_6G8KyPnQ8x_UFUzYj3-XhXuflDNFkIuLB1vKq87pXi4cBcOuuHZqmqs4GIsjTiMzBj17qFYPyxom_drNZP-uEzvGAPzMcl_WuFo_L3KKERtHnoG3lAqNOFWdvh7TAQnBYo0wRNR9wBgI_YQ4guqkE6VtqIRGhAkWXF0UvY--ycgu6M9ciS07JUcbJEYQX4VpUHs2kpRnLYwqj8MS-Z5i1T-74PU7d0L0ycTGU8ysnztQ",
  },
  {
    _id: "store-origin",
    name: "Origin Roasters",
    tagline: "Estate beans & brass brewers",
    location: "Coorg, KA",
    avatar: "O",
    rating: "4.8",
    reviews: "890",
    badge: "Fast Dispatch",
    banner:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0ICIy47Ielc5so9NRolFAndByf4Q4-t2aiXVMllvXlsWnRHrfcKit8NI7roMXFiybGkvCPhXulVUeUs263bEPPudVNUAZaQG78OHrnRO-bYpoxA2ieoPFD-jXGqxOmXJIBQzGODDF-dciUTsjUKQxiWQ1UNsHkF7TI1utFx0dUXooOJe0UdY2xc-J_kOdb0OGgihbGgxRSqgi_ykDix57kDe6TsQtJwrbokDIixqwh01tQOdd79O3aw",
  },
  {
    _id: "store-earth",
    name: "Earth Pottery Studio",
    tagline: "Stoneware tableware & vases",
    location: "Pondicherry",
    avatar: "E",
    rating: "4.9",
    reviews: "412",
    badge: "Small Batch",
    banner:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXc6eX7KylGF1xvQvjO3Am06lv0d0_6W3i07dMgMEOOCdpRSUxRJWxKURfw6D-Nsiqjkf5oe9U859b9qBL5rlZ0qA00SSmCTrc43s1R41M7-VfG71b5jPNGoCrZtDPF-SVtncjtXFcDMfCOvbcgfiFps01ciFsocxAkcG-szML_mrmdqjzHXOde8J--Aujg2p-aF9rXv8qqt1QZOlg8GzJy26pNKAlDQttAl5RDZY6ZrZCft8ChnF7Jw",
  },
  {
    _id: "store-loom",
    name: "Loom & Weft",
    tagline: "Heritage silk & cotton sarees",
    location: "Maheshwar, MP",
    avatar: "L",
    rating: "5.0",
    reviews: "650",
    badge: "Master Weavers",
    banner:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQtC99bY36O_LZXVGGSqHMQW8RWitzKe5Ael9N6Kob5Cm3CFP6H4Nj3ZQKUD6CJE0Mv0IYjYq88LlYVVkcLr29qgQQpCfn_w8Ss7gbjX8yEQOI-H0yaTEFepYTvDGmbYV2_QjcFlU_X8jM9XWYINmLcLdiaHaLPMb4S4TaNhGLh7-bCGMOvY4gm1hl3qvFI26nsa_Dp-n3uASk3uH6_APFTsg8QJi2s0A0rmx6UH_ZIUAqVNAGzMnX1g",
  },
];

// Reference Products from Google Stitch
const defaultProducts = [
  {
    _id: "prod-1",
    name: "Hand-Hammered Brass Filter Coffee Maker",
    storeName: "Origin Roasters",
    price: 1650,
    originalPrice: 2100,
    discount: "21% OFF",
    rating: "4.9",
    reviews: 318,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKm03OCT3CJB8VWVb1OjTRotyK1fC9VqV7mSZ5M8jldKeZeVbBjw3ILdM3YhJmqF51-TVJLOvptqoi_0v7rUmAEH9dYnQTilQsA2IJ8c-5Z6tcICwtGp66SJufVV0MDGOH6DP-qXa3joozWKM70N7cxwbNIk7LqO48DJuq41Ol8OXiBI5i5CaJjGQMZ2k_3x1U0CpbcLAe75KHMQHobsu4rrQetQAubfQ75vNnam1wxAryIVHhoGQwCA",
    stock: 12,
  },
  {
    _id: "prod-2",
    name: "Indigo Kantha Quilted Bed Throw (Queen)",
    storeName: "Kaveri Living",
    price: 3890,
    originalPrice: 4990,
    discount: "22% OFF",
    rating: "4.8",
    reviews: 142,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBn-iuZuM_UyKEnZHNM-zPl4efNMK_9DBGp0-H4bdZWowRiKCQFrOYZuYz7_A-ZGjmmX87nDJue9rKPSYlgy0tPz-LRF0wxwP7Z5iKobAQjckDEACWj48gJiyyPcWdvTURD71T1R3XH_U8RUbg9EPrzzLlq4D-bQlnN17gZ7mumMKHabmG_6N69HUvJHLe3yphNobMttPY227bL4g4FHTtDM9qqMl8Srg5BIcVw25Z-kQIYZW3OJE08Zw",
    stock: 8,
  },
  {
    _id: "prod-3",
    name: "Matte Sand Glazed Ramen Bowl (Set of 2)",
    storeName: "Earth Pottery Studio",
    price: 1420,
    originalPrice: 1800,
    discount: "21% OFF",
    rating: "4.9",
    reviews: 86,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLmVEmjreBEdXgXw4clvyvLWC980ViwdxqC6TkC0xWMuEGIbdBdEXL01AMDoqg3lAwRmLm2l9LW7xOwioNDwdAP3R5Gxqu0Fq7n9BiLnmejkwa-FmTLxoY96XUaUv_jwYOt-CKFFY3fbOHwnqaHf164eJeaP7t25VX8JI4y3Za8UHro-q1LqghRHKNdSOQ001Qm-AD4XMDtPMSH-Z_vX_2K_YX13OgQZOxUUh_9UKve2LOTsprfw1LCg",
    stock: 15,
  },
  {
    _id: "prod-4",
    name: "Handloom Chanderi Zari Silk Stole",
    storeName: "Loom & Weft Works",
    price: 2450,
    originalPrice: 3200,
    discount: "23% OFF",
    rating: "5.0",
    reviews: 210,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAe7-78_Vug7TIhKyLCdSUttSv65JUZ23v7fCfLc_KbX5xhKwShuebEwvwf5uGU0oXyirJ_if65jcn9M4aaURt0Oze9hkgM0I7ihxbvxAuYBcJUuIDBY8-tqS0pbiwMiMEjOlAXgdXKOMB8p2jTRm6Qsga88kazE2APZPj2yAMFRTlSn43bVe9abf8CTayzYW2wXJ1GNUPiJC2Ai7QY9eUU7jZoeQeZL9hRzhZBfvsJ2ydPs_GEd6LyXA",
    stock: 5,
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [wishlist, setWishlist] = useState({});
  const [addedIds, setAddedIds] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch live products from API layer
    productsApi
      .getProducts({ limit: 8 })
      .then((data) => {
        const list = data?.products || [];
        setProducts(list.length > 0 ? list : defaultProducts);
      })
      .catch(() => {
        setProducts(defaultProducts);
      })
      .finally(() => setLoading(false));

    // 2. Fetch live stores from API layer
    storesApi
      .getStores()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setStores(list.length > 0 ? list : defaultStores);
      })
      .catch(() => {
        setStores(defaultStores);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleChipClick = (term) => {
    setSearchInput(term);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock !== undefined ? product.stock : 10,
        storeId: product.storeId?._id || product.storeId || "store-1",
        storeName: product.storeId?.name || product.storeName || "Store",
        quantity: 1,
      })
    );
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* =========================================================================
          SECTION 1: Top Search & Discovery Quickbar (with Popular Chips)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <form onSubmit={handleSearch} className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <span className="material-symbols-outlined text-[20px] text-outline ml-3.5 select-none">
            search
          </span>
          <input
            id="global-search-input"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products across verified stores..."
            className="w-full h-12 pl-2.5 pr-20 bg-transparent font-sans text-xs sm:text-sm text-on-surface placeholder:text-outline outline-none"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Visual Camera Search"
              className="w-8 h-8 flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-surface-container"
              title="Visual Search"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
            <button
              type="submit"
              aria-label="Filter Options"
              className="w-8 h-8 flex items-center justify-center bg-surface-container text-primary-container rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors"
              title="Apply Filters"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </form>

        {/* Popular Autocomplete Chips Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 pb-1">
          <span className="font-sans text-[11px] font-semibold text-outline uppercase tracking-wider whitespace-nowrap">
            Popular:
          </span>
          {[
            "Handloom Cotton",
            "Brass Coffee Filter",
            "Ceramic Tableware",
            "Mechanical Keyboards",
            "Maheshwari Silk",
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-3 py-1 bg-surface-container-lowest hover:bg-secondary-fixed hover:text-on-secondary-fixed rounded-full font-sans text-xs text-on-surface-variant whitespace-nowrap transition-colors border border-surface-container-high cursor-pointer shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Editorial Hero Section
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="relative overflow-hidden rounded-2xl bg-primary-container text-white shadow-md p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[340px] md:min-h-[420px]">
          {/* Background Scrim */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsVOGH1E_ebmmeF4aptIPxiSjj1Fw_7_UEPnMB9r3_32HQNI2Hhj5RvsdWEJP9Ee-NIenoM063IKsZ2oev2UCDeji0CClUB6lBTP0ESPfCIq996gIRRnkuQdcI0zud3nm_hvas0mnUQN9ENOCqwhXwcNwNLF2px9z_80SLBd-uAVJKKkwrGL_z7opi7UZTRx14iSHXLlUGNgyE_Pg9F0N8lkeeikGIbYxqS8IPRtE6VGgT1GnoLmawqg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/80 to-primary-container/30" />

          {/* Store Spotlight Pill */}
          <div className="relative z-10 self-start inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md border border-white/10 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-secondary-container" />
            <span className="font-sans text-xs font-semibold text-secondary-fixed tracking-wide">
              Featured Store: Nilgiri Crafts
            </span>
            <span className="text-xs text-white/80 font-medium">• 4.9 ★</span>
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 flex flex-col gap-3 mt-auto pt-8 max-w-2xl">
            <h1 className="font-serif-caslon font-bold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Discover something different.
            </h1>
            <p className="font-sans text-sm sm:text-base text-on-primary-container max-w-xl leading-relaxed">
              Explore products from verified independent stores, all in one trusted marketplace.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to="/products"
                className="h-11 px-6 bg-secondary-fixed text-on-secondary-fixed font-sans text-sm font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 hover:bg-secondary-container transition-all active:scale-[0.98]"
              >
                <span>Shop Now</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/stores"
                className="h-11 px-6 bg-surface-container-lowest/20 backdrop-blur-md border border-white/20 text-white font-sans text-sm font-medium rounded-xl hover:bg-surface-container-lowest/30 transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Browse Stores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Responsive Category List
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-widest block">
              Categories
            </span>
            <h2 className="font-serif-caslon font-bold text-2xl text-primary-container">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-sans font-semibold text-secondary hover:text-primary flex items-center gap-0.5 transition-colors"
          >
            <span>View all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        {/* Category Strip */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {departments.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.query ? `/products?category=${encodeURIComponent(cat.query)}` : "/products"}
              className="flex flex-col items-center gap-2 group text-center select-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-surface-container shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 border border-surface-container-high flex items-center justify-center">
                {cat.isIcon ? (
                  <div className="w-full h-full bg-primary-container text-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">
                      {cat.icon}
                    </span>
                  </div>
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              <span className="font-sans text-xs font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Featured Independent Stores
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-widest block">
              Featured Stores
            </span>
            <h2 className="font-serif-caslon font-bold text-2xl text-primary-container">
              Featured Stores
            </h2>
          </div>
          <Link
            to="/stores"
            className="text-xs font-sans font-semibold text-secondary hover:text-primary flex items-center gap-0.5 transition-colors"
          >
            <span>Explore All Stores</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stores.slice(0, 4).map((store) => (
            <div
              key={store._id}
              className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-outline-variant/60 transition-all duration-200"
            >
              <div className="relative h-32 w-full bg-surface-container overflow-hidden">
                <img
                  src={
                    store.banner ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvH8tidELOi_6G8KyPnQ8x_UFUzYj3-XhXuflDNFkIuLB1vKq87pXi4cBcOuuHZqmqs4GIsjTiMzBj17qFYPyxom_drNZP-uEzvGAPzMcl_WuFo_L3KKERtHnoG3lAqNOFWdvh7TAQnBYo0wRNR9wBgI_YQ4guqkE6VtqIRGhAkWXF0UvY--ycgu6M9ciS07JUcbJEYQX4VpUHs2kpRnLYwqj8MS-Z5i1T-74PU7d0L0ycTGU8ysnztQ"
                  }
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs font-sans text-[11px] text-primary-container font-semibold border border-surface-container-high/60 shadow-xs">
                  {store.location || "Verified Store"}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-serif-caslon font-bold text-sm shadow-xs shrink-0">
                    {store.avatar || store.name?.[0] || "A"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-serif-caslon font-semibold text-base text-on-surface truncate group-hover:text-primary transition-colors">
                        {store.name}
                      </h3>
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0" title="Verified Store">
                        verified
                      </span>
                    </div>
                    <span className="font-sans text-xs text-outline truncate">
                      {store.tagline || `${store.productsCount || 24} products`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
                  <div className="flex items-center gap-1 text-secondary">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-on-surface font-semibold">{store.rating || "4.9"}</span>
                    <span className="text-outline text-[11px]">({store.reviews || "500+"})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-primary-container bg-surface-container px-2 py-0.5 rounded-md">
                    {store.badge || "Verified Store"}
                  </span>
                </div>

                <Link
                  to={`/products?store=${store._id}`}
                  className="w-full h-9 rounded-xl bg-surface-container hover:bg-primary-container hover:text-white text-primary-container font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Visit Store</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Limited-Time Store Showcase Banner
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="rounded-2xl bg-surface-container-low p-6 sm:p-8 shadow-xs border border-surface-container-high relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-1.5 text-secondary font-sans text-xs uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              <span>Weekend Store Showcase</span>
            </div>
            <h3 className="font-serif-caslon font-bold text-xl sm:text-2xl text-primary-container">
              Up to 25% off tableware &amp; home essentials
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
              Direct discounts from independent stores. Ends Sunday midnight.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-sans text-xs font-semibold text-primary-container bg-surface-container px-3 py-2 rounded-xl border border-surface-container-high select-all">
              Code: SALE25 applied
            </span>
            <Link
              to="/products"
              className="px-5 py-2 bg-primary-container text-white font-sans text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:bg-primary transition-all"
            >
              Shop Event
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Trending Now (Top Picks Product Grid)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-widest block">
              Top Picks
            </span>
            <h2 className="font-serif-caslon font-bold text-2xl text-primary-container">
              Trending Now
            </h2>
          </div>
          <span className="text-xs font-sans text-outline">Updated hourly</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-0 overflow-hidden animate-pulse">
                <div className="aspect-square bg-surface-container" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                  <div className="h-5 bg-surface-container rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((p) => {
              const isWishlisted = !!wishlist[p._id];
              const isAdded = !!addedIds[p._id];
              const storeTitle = p.storeId?.name || p.storeName || "Store";
              const discountText = p.discount || "21% OFF";
              const originalPrice = p.originalPrice || Math.round(p.price * 1.25);

              return (
                <div
                  key={p._id}
                  className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high overflow-hidden flex flex-col group relative hover:shadow-md hover:border-outline-variant/60 transition-all duration-200"
                >
                  <div className="relative w-full aspect-square bg-surface-container-low overflow-hidden">
                    <img
                      src={p.image || "https://placehold.co/400x400/eaefed/173b35?text=VEYRA"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(p._id, e)}
                      aria-label="Save to Wishlist"
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        isWishlisted ? "text-error scale-110" : "text-outline hover:text-error"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Discount Pill */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-sans text-[10px] font-bold shadow-2xs">
                      {discountText}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
                    <div>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-secondary truncate block">
                        {storeTitle}
                      </span>
                      <Link to={`/product/${p._id}`}>
                        <h3 className="font-serif-caslon font-semibold text-sm sm:text-base text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors mt-0.5">
                          {p.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-secondary">
                          <span
                            className="material-symbols-outlined text-[13px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="font-semibold text-on-surface">{p.rating || "4.9"}</span>
                          <span className="text-outline">({p.reviews || "210"})</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span className="font-sans font-bold text-base sm:text-lg text-primary-container">
                            ₹{Number(p.price).toLocaleString("en-IN")}
                          </span>
                          <span className="font-sans text-xs text-outline line-through">
                            ₹{Number(originalPrice).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(p, e)}
                        aria-label={`Add ${p.name} to cart`}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-surface-container text-primary-container hover:bg-primary-container hover:text-white active:scale-95"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isAdded ? "check" : "add_shopping_cart"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 7: Curated Collections
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <div className="flex flex-col mb-4">
          <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-widest block">
            Curated Collections
          </span>
          <h2 className="font-serif-caslon font-bold text-2xl text-primary-container">
            Popular Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Volume 01 */}
          <Link
            to="/products?category=Home"
            className="relative overflow-hidden rounded-2xl bg-surface-container-low p-5 sm:p-6 shadow-xs border border-surface-container-high flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-outline-variant/60 transition-all"
          >
            <div className="flex flex-col gap-1 z-10 max-w-[210px]">
              <span className="font-sans text-[11px] text-secondary uppercase font-semibold tracking-wider">
                Collection 01
              </span>
              <h3 className="font-serif-caslon font-bold text-lg text-primary-container">
                Home Essentials
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Tableware, textiles, and home accents from verified sellers.
              </p>
              <span className="font-sans text-xs text-primary-container font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition-transform">
                Explore Collection →
              </span>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-container shadow-xs shrink-0 z-10 group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2NRr9ShiZ0euMGKG1OE6qYpCUvqUxuJHegOBHAvi75RxZrxWSnMKroapuiGBB5SdBGM57IntTQQX5PFi73sabqqoQwSZX6WYdMUSdS4iDlFJne_kfurLLIBW1gU9vWBdE4ctgygS4shAEvcoyjcWTFabaXkpTQRDzalUwWVks705Jo7NFWrgFDKHKCD2NrAd83bIVk97f4NOfoiABqfJ5ufGY9tKBxkQRFQty60L1gSkEQCJhTHBIsg"
                alt="Home Essentials"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Volume 02 */}
          <Link
            to="/products?category=Desk"
            className="relative overflow-hidden rounded-2xl bg-surface-container-low p-5 sm:p-6 shadow-xs border border-surface-container-high flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-outline-variant/60 transition-all"
          >
            <div className="flex flex-col gap-1 z-10 max-w-[210px]">
              <span className="font-sans text-[11px] text-secondary uppercase font-semibold tracking-wider">
                Collection 02
              </span>
              <h3 className="font-serif-caslon font-bold text-lg text-primary-container">
                Desk &amp; Tech
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Ergonomic accessories, cable organizers, and leather sleeves.
              </p>
              <span className="font-sans text-xs text-primary-container font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition-transform">
                Explore Collection →
              </span>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-container shadow-xs shrink-0 z-10 group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC66EfW820FLlUJnZbh5RIjzCI67gpHL6nKfwHTbOHi5MO-YzuXTm54Dnfg0N4AaQWFRZ2JiChUfp-d6JZCCyKOpfdtneUMPk_3J9aeF5IspcSnqrFOK1pP2zyXh-Nq3pA7RFGslR-R-QhtU9EY49fdS4HIp1BPxmeio_Glb1A2g5WnTSSnJ4M_EBPHuLB6r_9uCOENKoIpFp1v_F-L94vy4sTDiQUBCrF7S4T1NlCrVF5xRA3nIEvq0A"
                alt="Desk and Modern Craft"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Volume 03 */}
          <Link
            to="/products?category=Handloom"
            className="relative overflow-hidden rounded-2xl bg-surface-container-low p-5 sm:p-6 shadow-xs border border-surface-container-high flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-outline-variant/60 transition-all"
          >
            <div className="flex flex-col gap-1 z-10 max-w-[210px]">
              <span className="font-sans text-[11px] text-secondary uppercase font-semibold tracking-wider">
                Collection 03
              </span>
              <h3 className="font-serif-caslon font-bold text-lg text-primary-container">
                Handloom &amp; Apparel
              </h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Pure handloom fabrics, silk apparel, and everyday accessories.
              </p>
              <span className="font-sans text-xs text-primary-container font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition-transform">
                Explore Collection →
              </span>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-container shadow-xs shrink-0 z-10 group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1LbEo2GJUAqJJLXXjUEQypM3he4z59PtTb0zDp-zZ5HhahU_PoRfCjhPla8rQKvwVcVraCimrv9dIzaZ4LCNAyeFzXYGc8IlGGKKDCsX3PD05bdhrY9tadA8S9Izygy6mof2kLAA2dyTai4OIkC79ASg1dw41NJwQFzGoSKC-Y3ItEVgCljDnfzRp7pa0BU6gd-wQumNxUZpROfPTcl0MwGfQGIbIlTx_Grxopspy_7cSgybHdDkr9g"
                alt="Personal Heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: Seller Spotlight
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-2xl bg-primary-container text-white overflow-hidden shadow-md flex flex-col lg:flex-row lg:items-center">
          <div className="relative h-60 lg:h-80 w-full lg:w-1/2 shrink-0 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOavYDKBW0ZVF1r5s_KKXyisge8Zvob6QxkUYPuMDfC7Tq8386fKIGuLRFWcYGJbN2mqbS34zOxrtjfJDhZx9nCi7xV0DYnQJRkyIUFNTvS5gCjer3KHYikr23KruSEG5N3HMiFEnRFCf5-3zgBQVzIqo3qj7NkSGE1al4RLLLcT5JF7D_VI6UQbz1WII_9k72C2NO0aJ5IhiuePjcXGAD51FKAmpr6OZaTmV9_VeEHp0sBphm-btXQg"
              alt="Ananya and Vikram from Kaveri Living"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent lg:hidden" />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-sans text-xs font-semibold shadow-xs">
              Seller Story
            </span>
          </div>

          <div className="p-6 sm:p-10 flex flex-col gap-3 justify-center">
            <h3 className="font-serif-caslon font-bold text-2xl sm:text-3xl text-white leading-tight">
              Meet Ananya &amp; Vikram from Kaveri Living
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-primary-container leading-relaxed">
              Preserving four generations of natural river-washed block printing in Bagru, ensuring fair sustainable livelihood for 32 printer families.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/stores"
                className="h-10 px-5 bg-secondary-container text-on-secondary-container rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-secondary-fixed transition-colors shadow-xs"
              >
                <span>Read Story</span>
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </Link>
              <Link
                to="/products?search=Kaveri"
                className="h-10 px-4 text-white font-sans text-xs sm:text-sm font-medium hover:underline flex items-center"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: VEYRA Trust & Platform Guarantees Strip
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[26px]">storefront</span>
            <span className="font-serif-caslon font-bold text-base text-primary-container">
              Direct Sellers
            </span>
            <span className="font-sans text-xs text-outline leading-relaxed">
              Every purchase supports independent sellers and stores directly.
            </span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[26px]">local_shipping</span>
            <span className="font-serif-caslon font-bold text-base text-primary-container">
              Express Delivery
            </span>
            <span className="font-sans text-xs text-outline leading-relaxed">
              Fast door-to-door delivery tracking across all Indian pin codes.
            </span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[26px]">assignment_return</span>
            <span className="font-serif-caslon font-bold text-base text-primary-container">
              7-Day Returns
            </span>
            <span className="font-sans text-xs text-outline leading-relaxed">
              Simple reverse pickups if the product does not fit your space.
            </span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high flex flex-col gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[26px]">encrypted</span>
            <span className="font-serif-caslon font-bold text-base text-primary-container">
              UPI &amp; Cards
            </span>
            <span className="font-sans text-xs text-outline leading-relaxed">
              Bank-grade encrypted checkout with buyer payment protection.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
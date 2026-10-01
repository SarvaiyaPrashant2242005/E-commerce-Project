import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productsApi } from "../../api";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Delivery Pincode state
  const [pincode, setPincode] = useState("400001");
  const [pincodeEditing, setPincodeEditing] = useState(false);
  const [tempPincode, setTempPincode] = useState("400001");

  // Fetch single product from API
  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getProductById(id);
      setProduct(data);
      setActiveImage(data.image || (data.images && data.images[0]) || "");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Product not found or unavailable."
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Handle Add to Bag (100% preserves existing Redux cart contract)
  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        storeId: product.storeId?._id || product.storeId || "",
        storeName: product.storeId?.name || product.storeName || "",
        quantity: qty,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Handle 1-Click Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // Delivery date estimate (3 business days ahead)
  const deliveryEstimateDate = new Date();
  deliveryEstimateDate.setDate(deliveryEstimateDate.getDate() + 3);
  const formattedDeliveryDate = deliveryEstimateDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // =========================================================================
  // Loading State
  // =========================================================================
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 bg-surface-container rounded w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-[4/5] bg-surface-container rounded-2xl" />
          <div className="space-y-4">
            <div className="h-3 bg-surface-container rounded w-1/4" />
            <div className="h-8 bg-surface-container rounded w-3/4" />
            <div className="h-6 bg-surface-container rounded w-1/3" />
            <div className="h-24 bg-surface-container rounded" />
            <div className="h-12 bg-surface-container rounded" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Error State (Real Error Display with Retry)
  // =========================================================================
  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-error/30 shadow-xs flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-5xl text-error">error</span>
          <h2 className="font-serif-caslon font-bold text-2xl text-primary-container">
            Product Unavailable
          </h2>
          <p className="font-sans text-xs sm:text-sm text-outline max-w-sm">
            {error || "We could not find the requested product in our marketplace."}
          </p>
          <div className="flex gap-3 pt-3">
            <Link
              to="/products"
              className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              Back to Products
            </Link>
            <button
              onClick={fetchProduct}
              className="px-5 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-all cursor-pointer shadow-xs"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const storeName = product.storeId?.name || product.storeName || "Store";
  const storeId = product.storeId?._id || product.storeId;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const galleryImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* =========================================================================
          SECTION 1: Micro-Breadcrumbs
          ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <nav
          className="flex items-center gap-1.5 text-xs text-outline overflow-x-auto whitespace-nowrap select-none"
          aria-label="Breadcrumb navigation"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          {product.category && (
            <>
              <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-primary transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
          <span className="text-on-surface font-semibold truncate max-w-[240px]">
            {product.name}
          </span>
        </nav>
      </section>

      {/* =========================================================================
          SECTION 2: Main Desktop 2-Column Product Layout
          ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* -------------------------------------------------------------
              LEFT COLUMN: Visual Gallery & Imagery (lg:col-span-6)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container-high shadow-xs group">
              <img
                src={activeImage || product.image || "https://placehold.co/600x750/eaefed/173b35?text=VEYRA"}
                alt={product.name}
                className={`w-full h-full object-cover object-center transition-transform duration-500 ${
                  isZoomed ? "scale-125 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Overlaid Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                {product.category && (
                  <span className="px-2.5 py-1 rounded-md bg-primary-container text-white font-sans text-[11px] font-semibold tracking-wider uppercase shadow-xs">
                    {product.category}
                  </span>
                )}
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded-md bg-secondary text-white font-sans text-[10px] font-semibold tracking-wider uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                aria-label="Save to Wishlist"
                className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  wishlisted ? "text-error scale-110" : "text-outline hover:text-error"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Toggle Image Zoom"
                className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-xl bg-surface-container-lowest/80 backdrop-blur-xs text-primary flex items-center justify-center hover:bg-surface-container-lowest transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isZoomed ? "zoom_out" : "zoom_in"}
                </span>
              </button>
            </div>

            {/* Gallery Thumbnails (if multiple images exist) */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden bg-surface-container border transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-primary ring-2 ring-primary/20 shadow-xs"
                        : "border-surface-container-high opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: Product Details, Pricing, & Cart (lg:col-span-6)
              ------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Store Attribution & Rating */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px]">storefront</span>
                {storeId ? (
                  <Link
                    to={`/products?store=${storeId}`}
                    className="hover:underline transition-all"
                  >
                    {storeName}
                  </Link>
                ) : (
                  <span>{storeName}</span>
                )}
                {product.storeId?.isVerified && (
                  <span className="material-symbols-outlined text-[15px] text-secondary" title="Verified Store">
                    verified
                  </span>
                )}
              </div>

              <h1 className="font-serif-caslon font-bold text-2xl sm:text-3xl lg:text-4xl text-primary-container leading-tight">
                {product.name}
              </h1>

              {/* Rating (Rendered conditionally only if product data contains rating) */}
              {product.rating && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 bg-secondary-fixed/50 px-2 py-0.5 rounded-md text-secondary text-xs font-semibold">
                    <span>{product.rating}</span>
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  {product.reviews && (
                    <span className="text-xs text-outline font-sans">
                      ({product.reviews} customer reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Pricing Card */}
            <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-surface-container-high shadow-xs flex flex-col gap-2">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-sans font-bold text-2xl sm:text-3xl text-primary-container">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                {/* Original Price & Discount rendered ONLY if data provides originalPrice */}
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <>
                    <span className="font-sans text-sm text-outline line-through">
                      ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-sans text-xs font-bold">
                      {Math.round(
                        ((Number(product.originalPrice) - Number(product.price)) /
                          Number(product.originalPrice)) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-outline font-sans flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">
                  check_circle
                </span>
                <span>Inclusive of all GST. Verified store dispatch.</span>
              </p>
            </div>

            {/* Description Paragraph */}
            {product.description && (
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants (Rendered conditionally ONLY if supported by data) */}
            {hasVariants && (
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Select Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      className="px-3 py-1.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-xs font-medium hover:border-primary transition-colors cursor-pointer"
                    >
                      {v.name || v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Notice & Quantity Stepper */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container border border-surface-container-high">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">
                  {isOutOfStock ? (
                    <span className="text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">cancel</span>
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-amber-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">warning</span>
                      Only {product.stock} items left in stock
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      In Stock ({product.stock} available)
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-outline">
                  {isOutOfStock
                    ? "Currently out of stock"
                    : "Direct delivery from store"}
                </span>
              </div>

              {/* Quantity Stepper */}
              {!isOutOfStock && (
                <div className="flex items-center rounded-lg bg-surface-container-lowest border border-surface-container-high shadow-2xs">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="w-8 h-8 flex items-center justify-center text-primary disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-sans">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    disabled={qty >= product.stock}
                    className="w-8 h-8 flex items-center justify-center text-primary disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Purchase Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-12 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                  isOutOfStock
                    ? "bg-surface-container text-outline cursor-not-allowed"
                    : added
                    ? "bg-emerald-600 text-white"
                    : "bg-primary-container hover:bg-primary text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {added ? "check" : "shopping_bag"}
                </span>
                <span>
                  {added
                    ? "Added to Cart!"
                    : `Add to Cart • ₹${(Number(product.price) * qty).toLocaleString("en-IN")}`}
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`h-12 px-6 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                  isOutOfStock
                    ? "bg-surface-container text-outline/50 cursor-not-allowed"
                    : "bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Buy Now</span>
              </button>
            </div>

            {/* Pincode & Express Delivery Estimates */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    local_shipping
                  </span>
                  <span>Estimated Delivery</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Free Express
                </span>
              </div>

              <div className="flex items-center gap-2">
                {pincodeEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setPincode(tempPincode);
                      setPincodeEditing(false);
                    }}
                    className="flex gap-2 w-full"
                  >
                    <input
                      type="text"
                      maxLength={6}
                      value={tempPincode}
                      onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 h-9 px-3 text-xs bg-surface border border-outline-variant rounded-lg outline-none"
                      placeholder="Enter 6-digit Pincode"
                    />
                    <button
                      type="submit"
                      className="px-3 h-9 bg-primary-container text-white text-xs font-semibold rounded-lg"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between w-full text-xs">
                    <span className="text-on-surface">
                      Deliver to: <strong>{pincode}</strong>
                    </span>
                    <button
                      onClick={() => setPincodeEditing(true)}
                      className="text-secondary font-semibold hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-on-surface pt-1 border-t border-surface-container">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  event_available
                </span>
                <span>
                  Expected delivery by <strong>{formattedDeliveryDate}</strong>
                </span>
              </div>
            </div>

            {/* Product Details & Specifications Accordions */}
            <div className="flex flex-col gap-2 pt-2">
              <details className="group bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden" open>
                <summary className="p-4 flex items-center justify-between cursor-pointer list-none select-none font-sans text-xs font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      auto_stories
                    </span>
                    <span>Product Details &amp; Care</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="px-4 pb-4 text-xs text-on-surface-variant leading-relaxed">
                  <p>{product.description || "Crafted by verified Indian sellers using quality materials."}</p>
                  <p className="mt-2 text-outline">
                    Care Guidelines: Wipe gently with a dry or slightly damp cotton cloth. Avoid harsh chemical cleaners.
                  </p>
                </div>
              </details>

              <details className="group bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden">
                <summary className="p-4 flex items-center justify-between cursor-pointer list-none select-none font-sans text-xs font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      format_list_bulleted
                    </span>
                    <span>Product Specifications</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="px-4 pb-4 text-xs text-on-surface-variant space-y-2">
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-outline">Category</span>
                    <span className="font-semibold text-primary">{product.category || "General"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-outline">Available Stock</span>
                    <span className="font-semibold text-primary">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-outline">Store</span>
                    <span className="font-semibold text-primary">{storeName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-outline">Listing Reference</span>
                    <span className="font-mono text-[11px] text-outline">{product._id}</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;

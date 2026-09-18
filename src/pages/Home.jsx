
import "./Home.css";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: "₹1,999",
    oldPrice: "₹2,999",
    emoji: "🎧",
    tag: "BESTSELLER",
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Fashion",
    price: "₹2,499",
    oldPrice: "₹3,499",
    emoji: "👟",
    tag: "TRENDING",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Accessories",
    price: "₹3,499",
    oldPrice: "₹4,999",
    emoji: "⌚",
    tag: "NEW",
  },
  {
    id: 4,
    name: "Everyday Backpack",
    category: "Lifestyle",
    price: "₹1,299",
    oldPrice: "₹1,799",
    emoji: "🎒",
    tag: "POPULAR",
  },
];

const categories = [
  { name: "Electronics", emoji: "📱" },
  { name: "Fashion", emoji: "👕" },
  { name: "Footwear", emoji: "👟" },
  { name: "Accessories", emoji: "⌚" },
  { name: "Lifestyle", emoji: "🎒" },
];

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">✨ YOUR EVERYDAY SHOPPING DESTINATION</span>
          <h1>
            Discover products
            <br />
            <span>you’ll love.</span>
          </h1>
          <p>
            Explore the latest trends, everyday essentials, and exciting
            deals—all in one place.
          </p>

          <div className="hero-actions">
            <a href="/products" className="btn-primary">
              Shop Now <span>→</span>
            </a>
            <a href="#categories" className="btn-secondary">
              Explore Categories
            </a>
          </div>

          <div className="hero-trust">
            <span>✓ Quality Products</span>
            <span>✓ Secure Shopping</span>
            <span>✓ Great Deals</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <span className="hero-emoji">🛍️</span>
          </div>
          <div className="floating-card floating-card-top">
            <span>🔥</span>
            <div>
              <strong>Hot Deals</strong>
              <small>Up to 50% off</small>
            </div>
          </div>
          <div className="floating-card floating-card-bottom">
            <span>🚚</span>
            <div>
              <strong>Easy Shopping</strong>
              <small>Shop from anywhere</small>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div><span>🚚</span><div><strong>Fast Delivery</strong><small>Convenient delivery</small></div></div>
        <div><span>🔒</span><div><strong>Secure Payments</strong><small>Shop with confidence</small></div></div>
        <div><span>↩️</span><div><strong>Easy Returns</strong><small>Hassle-free process</small></div></div>
        <div><span>💬</span><div><strong>Customer Support</strong><small>We're here to help</small></div></div>
      </section>

      <section className="home-section" id="categories">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SHOP BY CATEGORY</span>
            <h2>Find your favorites</h2>
            <p>Explore our collection by category.</p>
          </div>
          <a href="/products" className="text-link">View all products →</a>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <a href="/products" className="category-card" key={category.name}>
              <span className="category-emoji">{category.emoji}</span>
              <strong>{category.name}</strong>
              <span className="category-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="home-section featured-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">HANDPICKED FOR YOU</span>
            <h2>Featured products</h2>
            <p>Popular picks you might love.</p>
          </div>
          <a href="/products" className="text-link">Explore all →</a>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <span className="product-tag">{product.tag}</span>
                <span className="product-emoji">{product.emoji}</span>
                <button
                  className="wishlist-button"
                  aria-label={`Add ${product.name} to wishlist`}
                  type="button"
                >
                  ♡
                </button>
              </div>

              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <div className="product-rating">★★★★★ <span>(4.8)</span></div>
                <div className="product-price">
                  <strong>{product.price}</strong>
                  <del>{product.oldPrice}</del>
                </div>
                <a href="/products" className="product-button">View Product</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="offer-banner">
        <div>
          <span className="section-kicker">A LITTLE SOMETHING FOR YOU</span>
          <h2>Good finds. Great prices.</h2>
          <p>Explore the collection and discover something new today.</p>
          <a href="/products" className="offer-button">Explore Deals →</a>
        </div>
        <div className="offer-art">🎁</div>
      </section>

      <section className="home-section why-section">
        <div className="section-heading centered-heading">
          <div>
            <span className="section-kicker">WHY SHOP WITH US?</span>
            <h2>Shopping made simple</h2>
            <p>A smooth and convenient shopping experience, from start to finish.</p>
          </div>
        </div>
        <div className="why-grid">
          <div className="why-card"><span>🧡</span><h3>Carefully Selected</h3><p>Discover products chosen with your everyday needs in mind.</p></div>
          <div className="why-card"><span>💳</span><h3>Easy Checkout</h3><p>Enjoy a simple shopping journey with a clear checkout experience.</p></div>
          <div className="why-card"><span>✨</span><h3>Fresh Finds</h3><p>Explore new styles, useful essentials, and exciting discoveries.</p></div>
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <a href="/" className="footer-brand"> Mutli<br></br>Ecommerce-<span className="text-[#91d3a9]">Platform</span></a>
          <p>Your everyday destination for things you love.</p>
        </div>
        <div className="footer-links">
          <a href="/products">Shop</a>
          <a href="/login">My Account</a>
          <a href="/cart">Shopping Cart</a>
        </div>
        <small>
           <span>© 2026 Multi<br></br>Ecommerce-Platform .Demo storefront.</span>
        </small>
        
      </footer>
    </div>
  );
}

export default Home;
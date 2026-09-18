
import "./Home.css";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Electronics",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Stylish Backpack",
    category: "Accessories",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Accessories",
];

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            YOUR EVERYDAY SHOPPING DESTINATION
          </span>

          <h1>
            Discover Products
            <br />
            You'll <span>Love.</span>
          </h1>

          <p>
            Explore our collection of quality products
            at prices you'll love.
          </p>

          <a href="/products" className="shop-button">
            Shop Now →
          </a>
        </div>

        <div className="hero-image">
          <img
            src={products[0].image}
            alt="Wireless headphones"
          />
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE</span>
            <h2>Shop by Category</h2>
          </div>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div className="category-item" key={category}>
              {category}
            </div>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <span className="section-label">OUR COLLECTION</span>
            <h2>Featured Products</h2>
          </div>

          <a href="/products" className="view-all">
            View all →
          </a>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <div className="product-bottom">
                  <span className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  <a
                    href={`/product/${product.id}`}
                    className="view-product"
                  >
                    View →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

              
{/* Shopping Benefits */}
<section className="benefits-section">
  <div className="benefit">
    <span className="benefit-icon">🚚</span>
    <div>
      <h3>Free Shipping</h3>
      <p>On orders above ₹999</p>
    </div>
  </div>

  <div className="benefit">
    <span className="benefit-icon">🔒</span>
    <div>
      <h3>Secure Payments</h3>
      <p>Safe and secure checkout</p>
    </div>
  </div>

  <div className="benefit">
    <span className="benefit-icon">↩️</span>
    <div>
      <h3>Easy Returns</h3>
      <p>Hassle-free return process</p>
    </div>
  </div>

  <div className="benefit">
    <span className="benefit-icon">💬</span>
    <div>
      <h3>Customer Support</h3>
      <p>We're here to help</p>
    </div>
  </div>
</section>

{/* Special Offer Banner */}
<section className="offer-banner">
  <div className="offer-content">
    <span className="section-label">LIMITED TIME OFFER</span>
    <h2>Upgrade Your Everyday.</h2>
    <p>
      Explore exciting finds across our collection.
      Your next favorite product is waiting.
    </p>
    <a href="/products" className="shop-button">
      Explore Collection →
    </a>
  </div>

  <div className="offer-emoji">🛍️</div>
</section>

{/* Customer Reviews */}
<section className="reviews-section">
  <div className="section-heading">
    <div>
      <span className="section-label">CUSTOMER LOVE</span>
      <h2>What Shoppers Say</h2>
    </div>
  </div>

  <div className="reviews-grid">
    <article className="review-card">
      <div className="review-stars">★★★★★</div>
      <p>
        "The website is easy to use and the product
        collection looks amazing!"
      </p>
      <h4>Rahul S.</h4>
      <span>Sample customer review</span>
    </article>

    <article className="review-card">
      <div className="review-stars">★★★★★</div>
      <p>
        "Loved the clean design and how easy it is
        to explore different products."
      </p>
      <h4>Priya K.</h4>
      <span>Sample customer review</span>
    </article>

    <article className="review-card">
      <div className="review-stars">★★★★★</div>
      <p>
        "A smooth shopping experience with
        everything organized in one place."
      </p>
      <h4>Arjun M.</h4>
      <span>Sample customer review</span>
    </article>
  </div>
</section>

{/* Newsletter */}
<section className="newsletter-section">
  <span className="section-label">STAY IN THE LOOP</span>
  <h2>Get the latest updates</h2>
  <p>
    Discover new arrivals, shopping inspiration
    and exclusive offers.
  </p>
  <div className="newsletter-note">
    Subscribe feature coming soon.
  </div>
</section>

{/* Footer */}
<footer className="home-footer">
  <div className="footer-brand">
    <h2>E-Shop</h2>
    <p>Your everyday shopping destination.</p>
  </div>

  <div className="footer-links">
    <a href="/">Home</a>
    <a href="/products">Shop</a>
    <a href="/login">Login</a>
    <a href="/register">Create Account</a>
    <a href="/cart">Cart</a>
  </div>

  <div className="footer-bottom">
    © 2026 E-Shop. All rights reserved.
  </div>
</footer>






    </main>
  );
}

export default Home;
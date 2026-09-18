import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          Multi-Tenant Ecommerce <br></br>Platform
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        {/* Cart */}
        <Link to="/cart" className="cart">
          🛒 Cart
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;
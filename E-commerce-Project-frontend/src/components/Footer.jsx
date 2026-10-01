import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./common/BrandLogo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container-high mt-16 pt-12 pb-16 md:pb-12 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* ===== Member Privilege Newsletter Card ===== */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xs border border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-widest block mb-1">
              Exclusive Member Privileges
            </span>
            <h3 className="font-serif-caslon font-bold text-xl sm:text-2xl text-primary-container mb-1">
              Get ₹250 off your first store order
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
              Receive product updates, private preview sales, and direct stories from independent sellers.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[340px]">
            {subscribed ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Subscribed! Use code <strong>WELCOME250</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 h-11 px-3.5 bg-surface rounded-xl font-sans text-xs sm:text-sm text-on-surface border border-outline-variant outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="h-11 px-5 bg-primary-container text-white font-sans text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ===== Trust Assurances Strip ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high/80">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
            <span className="text-xs font-sans font-medium text-on-surface">Verified Sellers</span>
          </div>
          <div className="flex items-center gap-2.5 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high/80">
            <span className="material-symbols-outlined text-secondary text-[22px]">local_shipping</span>
            <span className="text-xs font-sans font-medium text-on-surface">Express Delivery</span>
          </div>
          <div className="flex items-center gap-2.5 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high/80">
            <span className="material-symbols-outlined text-secondary text-[22px]">shield</span>
            <span className="text-xs font-sans font-medium text-on-surface">Payment Protection</span>
          </div>
          <div className="flex items-center gap-2.5 bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high/80">
            <span className="material-symbols-outlined text-secondary text-[22px]">sync</span>
            <span className="text-xs font-sans font-medium text-on-surface">Easy 7-Day Return</span>
          </div>
        </div>

        {/* ===== Navigation Columns ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-surface-container">
          {/* Brand Info */}
          <div className="flex flex-col gap-3">
            <BrandLogo variant="full" size="md" />
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mt-1">
              A curated multi-vendor marketplace connecting customers with verified independent stores, quality products, and authentic heritage sellers.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-sans font-semibold text-xs text-primary uppercase tracking-wider">
              Categories
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Handloom" className="hover:text-primary transition-colors">Handloom & Textiles</Link></li>
              <li><Link to="/products?category=Home" className="hover:text-primary transition-colors">Home & Living</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Sellers */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-sans font-semibold text-xs text-primary uppercase tracking-wider">
              Sellers
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <li><Link to="/stores" className="hover:text-primary transition-colors">Browse Stores</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Become a Seller</Link></li>
              <li><Link to="/vendor" className="hover:text-primary transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-sans font-semibold text-xs text-primary uppercase tracking-wider">
              Customer Service
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
              <li><span className="text-on-surface-variant">Payment Protection</span></li>
              <li><span className="text-on-surface-variant">Customer Support</span></li>
              <li><span className="text-on-surface-variant">GI Certification Standards</span></li>
            </ul>
          </div>
        </div>

        {/* ===== Bottom Row: Payment Icons & Copyright ===== */}
        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline">
          <div className="flex items-center gap-4 text-outline">
            <span className="material-symbols-outlined text-[20px]" title="Cards Accepted">credit_card</span>
            <span className="material-symbols-outlined text-[20px]" title="UPI & Payments">account_balance_wallet</span>
            <span className="material-symbols-outlined text-[20px]" title="Secure Payment">payments</span>
            <span className="material-symbols-outlined text-[20px]" title="Bank Grade Encryption">lock</span>
          </div>

          <p>© 2026 VEYRA Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

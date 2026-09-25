// VEYRA Seller Workspace — Revenue & Sales Analytics
// Aligned with Google Stitch: veyra_seller_analytics_revenue_performance
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { vendorApi } from "../../api/vendor.api";

const VendorAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    vendorApi
      .getAnalytics()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || "Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-28 bg-surface-container rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-container rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-error bg-surface-container-lowest rounded-2xl border border-surface-container">
        <p className="font-semibold text-sm">{error || "Unable to display analytics report."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Simulation Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-caslon font-bold text-2xl text-primary tracking-tight">
              Revenue &amp; Sales Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
              H2 Overview
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Monitor customer acquisition, gross sales volume, category performance, and payments.
          </p>
        </div>

        {/* Development Mode Notice */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-xs text-outline">
          <span className="material-symbols-outlined text-[15px] text-secondary">info</span>
          <span>Development Simulation Data</span>
        </div>
      </div>

      {/* 4 Metric Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
            Gross Sales Volume
          </span>
          <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
            ₹1,84,500
          </span>
          <span className="text-tertiary text-xs font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+27.2% vs last cycle</span>
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
            Average Order Value (AOV)
          </span>
          <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
            ₹{data.averageOrderValue?.toLocaleString("en-IN") || "18,420"}
          </span>
          <span className="text-outline text-xs mt-2 block">
            High-value customer orders
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
            Customer Repeat Rate
          </span>
          <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
            {data.patronRetentionRate || 41.8}%
          </span>
          <span className="text-tertiary text-xs font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">favorite</span>
            <span>Strong repeat customer loyalty</span>
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
            On-Time Delivery Rate
          </span>
          <span className="font-serif-caslon font-bold text-2xl text-primary tracking-tight mt-1 block">
            {data.dispatchesOnTime || "98.4%"}
          </span>
          <span className="text-outline text-xs mt-2 block">
            Orders delivered on schedule
          </span>
        </div>
      </div>

      {/* Main Charts: Revenue Trend & Monthly Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 6-Month Revenue Gradient Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div>
              <h2 className="font-serif-caslon font-bold text-lg text-primary">
                Gross Revenue Trajectory (Last 6 Months)
              </h2>
              <p className="text-xs text-outline">Simulated monthly sales growth in Indian Rupees (INR)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container text-primary text-xs font-bold font-mono">
              ₹1.84L Peak
            </span>
          </div>

          <div style={{ height: 280 }} className="pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#173b35" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#173b35" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaefed" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#717976" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#717976" }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString("en-IN")}`, "Gross Revenue"]}
                  contentStyle={{
                    backgroundColor: "#002520",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#173b35"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Orders Volume Bar Chart */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="border-b border-surface-container pb-3">
            <h2 className="font-serif-caslon font-bold text-lg text-primary">
              Order Volume
            </h2>
            <p className="text-xs text-outline">Total customer orders completed per month</p>
          </div>

          <div style={{ height: 280 }} className="pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaefed" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#717976" }} />
                <YAxis tick={{ fontSize: 11, fill: "#717976" }} />
                <Tooltip
                  formatter={(val) => [`${val} Orders`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "#002520",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#7d5718" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Top Performing Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Share */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="border-b border-surface-container pb-3">
            <h2 className="font-serif-caslon font-bold text-lg text-primary">
              Sales by Category
            </h2>
            <p className="text-xs text-outline">Revenue share by product category</p>
          </div>

          <div className="space-y-3.5">
            {data.categoryBreakdown?.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-on-surface">{cat.name}</span>
                  <span className="text-secondary font-mono">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-container transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Collections */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs space-y-4">
          <div className="border-b border-surface-container pb-3">
            <h2 className="font-serif-caslon font-bold text-lg text-primary">
              Top Selling Products
            </h2>
            <p className="text-xs text-outline">Top revenue-driving products this period</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-outline uppercase text-[10px] tracking-wider border-b border-surface-container">
                <tr>
                  <th className="pb-2.5">Product</th>
                  <th className="pb-2.5">Units Sold</th>
                  <th className="pb-2.5">Gross Revenue</th>
                  <th className="pb-2.5 text-right">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {data.topProducts?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/50">
                    <td className="py-3 font-semibold text-on-surface">{p.title}</td>
                    <td className="py-3 text-outline">{p.unitsSold} units</td>
                    <td className="py-3 font-bold text-primary">
                      ₹{p.revenue?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-tertiary">
                      {p.conversion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;

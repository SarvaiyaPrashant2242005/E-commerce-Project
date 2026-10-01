import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-surface font-sans text-on-surface">
    <Navbar />
    <main className="flex-1 pb-16 md:pb-0">
      <Outlet />
    </main>
    <Footer />
    <MobileTabBar />
  </div>
);

export default PublicLayout;
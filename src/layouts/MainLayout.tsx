import { Outlet } from "react-router-dom";
import { Navbar } from "../components/shop/Navbar";
import { Footer } from "../components/shop/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import { ThemeProvider } from "./components/theme-provider";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";

// Lazy-loaded routes for performance optimization
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Listings = lazy(() => import("./pages/Listings"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="continuity-theme">
        <AuthProvider>
          <CartProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/components" element={<Listings />} />
                    <Route path="/components/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                  </Route>
                  
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

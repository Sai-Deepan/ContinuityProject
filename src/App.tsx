import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Listings from "./pages/Listings";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";

import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="continuity-theme">
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/components" element={<Listings />} />
            <Route path="/components/:id" element={<ProductDetails />} />
          </Route>
          
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

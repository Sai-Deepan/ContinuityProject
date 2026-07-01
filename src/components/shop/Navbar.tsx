import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ThemeToggle } from "../theme-toggle";
import { useCart } from "../../context/CartContext";
import { CartSidebar } from "./CartSidebar";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/components?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/components');
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Catalog", path: "/components" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4 sm:px-6">
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <img src="/logo.png" alt="Amaze Services Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">Amaze Services</span>
        </Link>
        
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors hover:text-primary ${
                  location.pathname === link.path ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
              />
            </form>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
            <Button asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-end md:hidden gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-lg transition-colors hover:text-primary ${
                      location.pathname === link.path ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to="/admin" className="text-lg text-muted-foreground hover:text-primary">Admin</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartSidebar />
    </header>
  );
}

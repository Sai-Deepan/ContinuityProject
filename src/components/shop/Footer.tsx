import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/50 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Amaze Services Logo" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-lg tracking-tight">Amaze Services</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The premier electronics component marketplace. Professional-grade parts for engineers, makers, and innovators.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Store</h3>
            <ul className="space-y-3">
              <li><Link to="/components" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Components</Link></li>
              <li><Link to="/components?category=Microcontrollers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Microcontrollers</Link></li>
              <li><Link to="/components?category=Sensors" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sensors</Link></li>
              <li><Link to="/components?category=Power" className="text-sm text-muted-foreground hover:text-primary transition-colors">Power Modules</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">PCB Manufacturing</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Assembly</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Component Sourcing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Amaze Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

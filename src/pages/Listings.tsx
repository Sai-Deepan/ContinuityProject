import { useState, useEffect } from "react";
import type { Component } from "../types";
import { ProductCard } from "../components/shop/ProductCard";
import { FilterSidebar } from "../components/shop/FilterSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "framer-motion";

export default function Listings() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/components')
      .then(res => res.json())
      .then(data => {
        setComponents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching components:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Electronic Components</h1>
          <p className="text-slate-600 mt-2">Browse {components.length} components for your next project.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">Sort by:</span>
          <Select defaultValue="popular">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading catalog...</div>
            ) : components.length > 0 ? (
              components.map((component, i) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCard product={component} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">No components found.</div>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            {/* Simple Pagination Placeholder */}
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Previous</button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">1</button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">2</button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">3</button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Next</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
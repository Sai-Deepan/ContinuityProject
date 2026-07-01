import { useEffect } from "react";
import { ProductCard } from "../components/shop/ProductCard";
import { FilterSidebar } from "../components/shop/FilterSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { motion } from "framer-motion";
import { useCatalog } from "../hooks/useCatalog";
import { Button } from "../components/ui/button";

export default function Listings() {
  const {
    components,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    searchQuery,
    selectedCategories,
    selectedManufacturers,
    minPrice,
    maxPrice,
    sort,
    setFilter,
    clearFilters,
    setPage
  } = useCatalog();

  useEffect(() => {
    document.title = "Amaze Services | Components Catalog";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Electronic Components"}
          </h1>
          <p className="text-slate-600 mt-2">
            {loading ? "Loading..." : `Showing ${components.length} of ${totalItems} components.`}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">Sort by:</span>
          <Select value={sort} onValueChange={(val) => setFilter('sort', val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Most Popular</SelectItem>
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
            <FilterSidebar 
              selectedCategories={selectedCategories}
              selectedManufacturers={selectedManufacturers}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setFilter={setFilter}
              clearFilters={clearFilters}
            />
          </div>
        </aside>

        <main className="flex-1">
          {error && (
            <div className="text-center py-12 text-rose-500 bg-rose-50 rounded-lg border border-rose-200">
              <p className="font-semibold">Error fetching components</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 animate-pulse rounded-xl h-80 border border-slate-200"></div>
              ))}
            </div>
          ) : components.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xl font-medium text-slate-700 mb-2">No components found</p>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {components.map((component, i) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCard product={component} />
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <Button 
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                    className={currentPage === i + 1 ? "pointer-events-none" : ""}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button 
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
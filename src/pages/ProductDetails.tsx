import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Component } from "../types";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Download, ShoppingCart, Plus, Minus } from "lucide-react";
import { ProductCard } from "../components/shop/ProductCard";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Component | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/components/${id}`).then(res => res.json()),
      fetch('/api/components').then(res => res.json())
    ])
      .then(([productData, allComponents]) => {
        if (!productData.error) {
          setProduct(productData);
          document.title = `${productData.name} | Amaze Services`;
          setRelatedProducts(allComponents.filter((c: Component) => c.category === productData.category && c.id !== productData.id).slice(0, 3));
        } else {
          document.title = "Product Not Found | Amaze Services";
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-8">
        <Link to="/components" className="hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Catalog
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/components?category=${product.category}`} className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-muted rounded-2xl overflow-hidden aspect-square border border-border group cursor-zoom-in"
        >
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-in-out"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/800?text=No+Image';
            }}
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-lg text-primary font-medium">{product.manufacturer}</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-foreground">₹{product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="flex items-center space-x-2 bg-muted rounded-md p-1 h-14 w-full sm:w-32 justify-between px-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || product.stock === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || product.stock === 0}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              size="lg" 
              className="flex-1 h-14 text-lg"
              onClick={() => {
                addItem(product, quantity);
                setQuantity(1); // Reset after adding
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button size="lg" variant="outline" className="h-14">
              <Download className="w-5 h-5 mr-2" />
              Datasheet
            </Button>
          </div>

          {/* Specifications Table */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Technical Specifications</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left bg-card">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? "bg-muted/30" : "bg-card"}>
                      <th className="px-6 py-4 font-medium text-foreground border-r border-border w-1/3">
                        {key}
                      </th>
                      <td className="px-6 py-4 text-muted-foreground">
                        {value}
                      </td>
                    </tr>
                  ))}
                  <tr className={Object.keys(product.specifications).length % 2 === 0 ? "bg-muted/30" : "bg-card"}>
                    <th className="px-6 py-4 font-medium text-foreground border-r border-t border-border w-1/3">
                      Manufacturer Part #
                    </th>
                    <td className="px-6 py-4 text-muted-foreground border-t border-border font-mono">
                      {product.id}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-8">Frequently bought together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
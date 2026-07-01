import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Component } from "../../types";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Component;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-border bg-card h-full flex flex-col group">
      <Link to={`/components/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={`Image of ${product.name}`}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
          }}
        />
        <div className="absolute top-2 right-2">
          {product.stock > 0 ? (
            <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground shadow-sm">
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="shadow-sm">
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/components/${product.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4">{product.manufacturer}</p>
        
        {/* Short Specs preview */}
        <div className="space-y-1 mb-4 hidden sm:block">
          {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{key}:</span>
              <span className="font-medium text-foreground truncate ml-2 max-w-[120px]">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
          <span className="font-bold text-xl">₹{product.price.toFixed(2)}</span>
          <Button 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1);
            }}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

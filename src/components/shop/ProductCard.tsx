import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Component } from "../../types";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Component;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-border bg-card h-full flex flex-col group">
      <Link to={`/components/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
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
          <Button size="sm" asChild>
            <Link to={`/components/${product.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

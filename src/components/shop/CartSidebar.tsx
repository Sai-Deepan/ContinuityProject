import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";

export function CartSidebar() {
  const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg pr-0">
        <SheetHeader className="px-6">
          <SheetTitle className="flex items-center text-2xl font-bold">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-6">
            <div className="bg-muted p-6 rounded-full">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium text-foreground">Your cart is empty</p>
            <p className="text-muted-foreground text-center">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => setIsCartOpen(false)} className="mt-4" asChild>
              <Link to="/components">Browse Catalog</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6 pl-6 my-4">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-border pb-6 last:border-0">
                    <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400?text=No+Image';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.product.manufacturer}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-muted rounded-md p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-sm"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-sm"
                            onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-lg">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-rose-500 hover:text-rose-600 hover:bg-transparent mt-1"
                            onClick={() => removeItem(item.product.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 border-t border-border pt-6 pb-2 space-y-4">
              <div className="flex items-center justify-between font-bold text-xl">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <Button className="w-full h-12 text-lg" size="lg" onClick={() => {
                setIsCartOpen(false);
                toast.success("Checkout feature coming soon!");
              }}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

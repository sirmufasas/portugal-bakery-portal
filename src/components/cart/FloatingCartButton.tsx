// src/components/cart/FloatingCartButton.tsx
import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";

export const FloatingCartButton = () => {
  const [showCart, setShowCart] = useState(false);
  const { cart, updateQuantity, removeItem, total, totalItems } = useCart();
  const { products: allProducts } = useProducts();

  // Don't render if cart is empty
  if (cart.length === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="font-bold">{totalItems}</span>
        <span className="hidden sm:inline ml-2">R{total.toFixed(2)}</span>
      </button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-card shadow-2xl p-6 overflow-y-auto transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground dark:text-foreground">Your Cart</h2>
              <Button variant="ghost" onClick={() => setShowCart(false)}>Close</Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-muted-foreground dark:text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-neutral-50 dark:bg-card rounded-lg p-3 transition-colors duration-300">
                      <img src={allProducts.find(p => p.id === item.id)?.image ?? ""} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground dark:text-foreground text-sm">{item.name}</h3>
                        <p className="text-primary font-bold text-sm">R{item.price.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="flex items-center justify-center w-8 text-sm font-medium">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 ml-auto" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground dark:text-foreground">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total</span>
                    <span className="text-primary">R{total.toFixed(2)}</span>
                  </div>
                  <Link to="/order" onClick={() => setShowCart(false)}>
                    <Button variant="default" size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
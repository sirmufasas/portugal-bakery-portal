import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  resetCart: () => void;
  total: number;
  totalItems: number;
  syncCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const failedSync = useRef(false); // <--- Track failed sync

  const lastSyncedCart = useRef<string>("");

  // --- Load cart from backend ---
  const loadCartFromBackend = useCallback(async () => {
    if (!user || !token) {
      setCart([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to load cart:", res.status);
        setCart([]);
        return;
      }

      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    loadCartFromBackend();
  }, [loadCartFromBackend]);

  // --- Reset cart on logout ---
  const resetCart = useCallback(() => {
    setCart([]);
    lastSyncedCart.current = "";
    setIsLoading(false);
    failedSync.current = false;
  }, []);

  useEffect(() => {
    const handleLogout = () => resetCart();
    window.addEventListener("user-logout", handleLogout);
    return () => window.removeEventListener("user-logout", handleLogout);
  }, [resetCart]);

  // --- Sync cart to backend ---
  const syncCart = useCallback(async () => {
    if (!user || !token || isSyncing || failedSync.current) return;

    const cartString = JSON.stringify(cart);

    if (cartString === lastSyncedCart.current) return; // no changes

    try {
      setIsSyncing(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: cartString,
      });

      if (res.status === 429) {
        console.warn("Rate limited while syncing cart.");
        return;
      }

      if (!res.ok) throw new Error("Cart sync failed");

      lastSyncedCart.current = cartString;
      failedSync.current = false; // success, reset fail flag
    } catch (error) {
      console.error("Cart sync failed:", error);
      toast({
        title: "Cart sync failed",
        description: "Your cart will retry saving soon.",
        variant: "destructive",
      });
      failedSync.current = true; // <--- stop spam retries
    } finally {
      setIsSyncing(false);
    }
  }, [cart, user, token, isSyncing, toast]);

  // --- Debounced sync ---
  useEffect(() => {
    if (!user || !token || isLoading) return;

    // Retry only after 1s normally, 10s if previous failed
    const delay = failedSync.current ? 10000 : 1000;

    const timer = setTimeout(syncCart, delay);
    return () => clearTimeout(timer);
  }, [cart, user, token, isLoading, syncCart]);

  // --- Cart actions ---
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    if (!user) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing)
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...item, quantity: 1 }];
    });
    failedSync.current = false; // trigger retry
  };

  const updateQuantity = (id: number, delta: number) => {
    if (!user) return;
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
    failedSync.current = false; // trigger retry
  };

  const removeItem = (id: number) => {
    if (!user) return;
    setCart(prev => prev.filter(i => i.id !== id));
    failedSync.current = false; // trigger retry
  };

  const clearCart = async () => {
    if (!user || !token) return resetCart();

    setCart([]);
    lastSyncedCart.current = "";
    failedSync.current = false;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error("Failed to clear cart:", e);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        resetCart,
        total,
        totalItems,
        syncCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};

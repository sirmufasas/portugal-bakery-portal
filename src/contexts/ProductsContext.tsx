// src/contexts/ProductsContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, allProducts } from "@/data/products";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  isLoading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from backend or fallback to frontend
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            console.log("📦 Products loaded from backend:", data.length);
          } else {
            console.log("📦 Backend empty, seeding frontend products...");
            await seedBackend();
          }
        } else {
          console.log("📦 Backend unavailable, using frontend products");
          setProducts(allProducts);
        }
      } catch {
        console.log("📦 Using frontend data (backend not connected)");
        setProducts(allProducts);
      } finally {
        setIsLoading(false);
      }
    }

    async function seedBackend() {
      try {
        const res = await fetch("/api/products/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(allProducts),
        });
        if (res.ok) {
          const fetchRes = await fetch("/api/products");
          const backendProducts = await fetchRes.json();
          setProducts(backendProducts);
          console.log("✅ Backend seeded and synced");
        }
      } catch {
        console.log("⚠️ Could not seed backend, using frontend only");
        setProducts(allProducts);
      }
    }

    loadProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    const originalProducts = [...products];
    const tempId = Math.max(...products.map(p => p.id || 0), 0) + 1;
    const tempProduct = { ...productData, id: tempId } as Product;

    setProducts(prev => [...prev, tempProduct]);
    console.log("⚡ Optimistically added product ID:", tempId);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newProduct: Product = await res.json();
      setProducts(prev => prev.map(p => (p.id === tempId ? newProduct : p)));
      console.log("✅ Product added to backend:", newProduct.name);
    } catch (err) {
      console.error("❌ Failed to add product:", err);
      setProducts(originalProducts);
      throw err;
    }
  };

 const updateProduct = async (id: number, productData: Partial<Product>) => {
    const originalProducts = [...products];
    const existingProduct = products.find(p => p.id === id);
    if (!existingProduct) throw new Error("Product not found in local state");

    // Optimistic update
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...productData } : p)));
    console.log("🔄 Optimistically updating product:", id);

    try {
      // Try numeric ID first
      let res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      // If 404 and we have _id, try that instead
      if (res.status === 404 && existingProduct._id) {
        console.log("🔄 Retrying with MongoDB _id:", existingProduct._id);
        res = await fetch(`/api/products/${existingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Backend returned ${res.status}:`, errorText);
        
        // Check if update actually worked despite error
        const checkRes = await fetch(`/api/products/${id}`);
        if (checkRes.ok) {
          const updated = await checkRes.json();
          setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
          console.log("✅ Product was updated successfully despite error response");
          return;
        }
        
        throw new Error(`Update failed: ${res.status}`);
      }

      const updatedProduct: Product = await res.json();
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
      console.log("✅ Product updated:", updatedProduct.name);
      console.log("📸 Image URL:", updatedProduct.image);
    } catch (err) {
      console.error("❌ Update error:", err);
      
      // Last resort: verify if it actually updated
      try {
        const verifyRes = await fetch(`/api/products/${id}`);
        if (verifyRes.ok) {
          const verified = await verifyRes.json();
          setProducts(prev => prev.map(p => (p.id === id ? verified : p)));
          console.log("✅ Verified update succeeded");
          return;
        }
      } catch (verifyErr) {
        console.error("❌ Verification also failed");
      }
      
      setProducts(originalProducts); // rollback
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    const originalProducts = [...products];
    const existingProduct = products.find(p => p.id === id);
    if (!existingProduct) throw new Error("Product not found in local state");

    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const urlId = existingProduct._id || id;
      const res = await fetch(`/api/products/${urlId}`, { method: "DELETE" });
      if (res.status === 404) {
        console.warn("⚠️ Product already deleted on backend, keeping UI removal:", id);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("✅ Product deleted from backend, ID:", id);
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
      setProducts(originalProducts); // rollback for network/server errors
      throw err;
    }
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, isLoading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
}

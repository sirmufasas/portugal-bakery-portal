// src/contexts/ProductsContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { allProducts as initialProducts, Product } from "@/data/products";

interface ProductsContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, product: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : initialProducts;
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...productData,
            id: Math.max(...products.map(p => p.id), 0) + 1,
        };
        setProducts([...products, newProduct]);
    };

    const updateProduct = (id: number, productData: Partial<Product>) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, ...productData } : p
        ));
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
}
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tables } from "@/types/supabase";
import Link from "next/link";

type Category = Tables<"categories">;
type Product = Tables<"products">;

export default function ProductCatalog({
    categories,
    products
}: {
    categories: Category[],
    products: Product[]
}) {
    const searchParams = useSearchParams();
    const initialSlug = searchParams.get("category");

    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        if (initialSlug) {
            const category = categories.find(c => c.slug === initialSlug);
            if (category) {
                setActiveCategory(category.id);
            }
        } else {
            setActiveCategory("all");
        }
    }, [initialSlug, categories]);

    useEffect(() => {
        if (activeCategory === "all") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category_id === activeCategory));
        }
    }, [activeCategory, products]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
            {/* Sidebar / Filter (Desktop) */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-8">
                    <div>
                        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Categories</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={`text-left px-4 py-2 rounded-lg transition-all ${activeCategory === "all" ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                            >
                                All Products
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`text-left px-4 py-2 rounded-lg transition-all ${activeCategory === category.id ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Filter (Horizontal Scroll) */}
            {/* Can add if needed, for now desktop sidebar collapses to top on mobile via flex-col */}

            {/* Grid */}
            <div className="flex-1">
                <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            {activeCategory === "all" ? "All Products" : categories.find(c => c.id === activeCategory)?.name}
                        </h1>
                        <p className="text-white/50">
                            Showing {filteredProducts.length} result{filteredProducts.length !== 1 && 's'}
                        </p>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-xl text-white/40">No products found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={product.id}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setActiveImage(product.image_url || "");
                                    }}
                                    className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col cursor-pointer"
                                >
                                    <div className="aspect-[4/3] bg-[#0a0a0a] relative overflow-hidden">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                <span className="text-white/20">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {/* Removed Button as requested, just hover effect */}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                                            {product.subtitle && (
                                                <p className="text-sm text-white/50 mb-4">{product.subtitle}</p>
                                            )}
                                        </div>

                                        {product.tags && (
                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 w-full">
                                                {product.tags.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-white/40">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                        >
                            <div className="bg-[#111] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto relative flex flex-col md:flex-row">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    ✕
                                </button>

                                {/* Image Section */}
                                <div className="w-full md:w-1/2 bg-black flex flex-col">
                                    {/* Main Image */}
                                    <div className="flex-1 relative bg-black/50 overflow-hidden group/main-img">
                                        {activeImage ? (
                                            <img
                                                src={activeImage}
                                                alt={selectedProduct.name}
                                                className="w-full h-full object-contain p-4"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-white/20">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnails */}
                                    {selectedProduct.gallery_images && selectedProduct.gallery_images.length > 1 && (
                                        <div className="h-20 border-t border-white/10 p-2 flex gap-2 overflow-x-auto custom-scrollbar bg-[#0a0a0a]">
                                            {selectedProduct.gallery_images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImage(img)}
                                                    className={`relative aspect-square h-full rounded overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                >
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                                    <div className="mb-6">
                                        {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {selectedProduct.tags.map((tag, i) => (
                                                    <span key={i} className="text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                                        {selectedProduct.subtitle && (
                                            <p className="text-xl text-white/50">{selectedProduct.subtitle}</p>
                                        )}
                                    </div>

                                    <div className="prose prose-invert max-w-none flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedProduct.details && (
                                            <div className="mb-6 whitespace-pre-wrap text-white/80 leading-relaxed">
                                                {selectedProduct.details}
                                            </div>
                                        )}

                                        {selectedProduct.features && selectedProduct.features.length > 0 && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Key Features</h3>
                                                <ul className="space-y-3">
                                                    {selectedProduct.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                                            <span className="text-white/80 leading-relaxed">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10">
                                        <button
                                            onClick={() => window.location.href = `mailto:support@daeyeoncorp.com?subject=Inquiry about ${selectedProduct.name}`}
                                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                            Inquiry about this product
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

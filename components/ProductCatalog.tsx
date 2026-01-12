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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
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
                                    className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col"
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                                            {product.subtitle && (
                                                <p className="text-sm text-white/50 mb-4">{product.subtitle}</p>
                                            )}

                                            {product.features && product.features.length > 0 && (
                                                <ul className="space-y-1 mb-4">
                                                    {product.features.slice(0, 3).map((feature, i) => (
                                                        <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                                                            <span className="text-blue-500 mt-0.5">•</span>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
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
        </div>
    );
}

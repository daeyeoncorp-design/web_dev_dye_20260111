"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";

type Product = Tables<"products">;
type Category = Tables<"categories">;

// Components
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
    />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors min-h-[100px]"
    />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
    />
);

const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 ${className}`}
    >
        {children}
    </button>
);

export default function ProductManager({
    initialProducts,
    categories
}: {
    initialProducts: Product[],
    categories: Category[]
}) {
    const supabase = createClient();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isEditing, setIsEditing] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [features, setFeatures] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    // Helpers for array inputs
    const [featureInput, setFeatureInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setName("");
        setSubtitle("");
        setCategoryId(categories[0]?.id || "");
        setImageUrl("");
        setFeatures([]);
        setTags([]);
        setIsEditing(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (product: Product) => {
        setIsEditing(product);
        setName(product.name);
        setSubtitle(product.subtitle || "");
        setCategoryId(product.category_id || "");
        setImageUrl(product.image_url || "");
        setFeatures(product.features || []);
        setTags(product.tags || []);
    };

    const fetchProducts = async () => {
        const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (data) setProducts(data);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsLoading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
        } catch (error) {
            console.error(error);
            alert("Error uploading image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const productData = {
            name,
            subtitle,
            category_id: categoryId || null,
            image_url: imageUrl,
            features,
            tags
        };

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from("products")
                    .update(productData)
                    .eq("id", isEditing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("products")
                    .insert([productData]);
                if (error) throw error;
            }

            await fetchProducts();
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save product");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
            await fetchProducts();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product");
        } finally {
            setIsLoading(false);
        }
    };

    // Array manipulation helpers
    const addFeature = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput("");
        }
    };
    const removeFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));

    const addTag = () => {
        if (tagInput.trim()) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };
    const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));

    // Initialize category on mount if adding new
    useState(() => {
        if (!isEditing && categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id);
        }
    });

    return (
        <div className="flex flex-col xl:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full xl:w-2/5 order-first xl:order-last">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-6">{isEditing ? "Edit Product" : "Add New Product"}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs uppercase text-white/40 font-bold mb-2">Category</label>
                                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs uppercase text-white/40 font-bold mb-2">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                />
                                {imageUrl && (
                                    <div className="mt-2 text-xs text-green-400 truncate">Uploaded ✓</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Product Name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Precision Drill DB-9" />
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Subtitle</label>
                            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. High torque for industrial use" />
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Features</label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    placeholder="Add a feature..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                />
                                <Button type="button" onClick={addFeature} className="bg-white/10 text-white hover:bg-white/20">+</Button>
                            </div>
                            <ul className="flex flex-col gap-1">
                                {features.map((f, i) => (
                                    <li key={i} className="text-sm flex justify-between bg-white/5 px-3 py-1.5 rounded items-center">
                                        <span className="truncate mr-2">{f}</span>
                                        <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300">×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add a tag..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} className="bg-white/10 text-white hover:bg-white/20">+</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((t, i) => (
                                    <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded flex items-center gap-1">
                                        {t}
                                        <button type="button" onClick={() => removeTag(i)} className="hover:text-white">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>


                        <div className="flex gap-2 pt-4 border-t border-white/5 mt-2">
                            {isEditing && (
                                <Button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-white/5 text-white/60 hover:bg-white/10"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 text-white hover:bg-blue-500 flex-1 disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="flex-1">
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-xs text-white/50 uppercase">
                                <th className="p-4 font-medium w-16">Img</th>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => {
                                const catName = categories.find(c => c.id === product.category_id)?.name || "Uncategorized";
                                return (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded bg-white/5 overflow-hidden border border-white/10">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : <div className="w-full h-full flex items-center justify-center text-xs text-white/20">img</div>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-xs text-white/40">{product.subtitle}</div>
                                        </td>
                                        <td className="p-4 text-sm text-white/60">
                                            <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-xs">
                                                {catName}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 hover:bg-white/10 rounded text-blue-400"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-white/10 rounded text-red-500"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";

type Category = Tables<"categories">;

// Simple UI Components for consistency
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
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

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const supabase = createClient();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isEditing, setIsEditing] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [order, setOrder] = useState<number>(0);

    const resetForm = () => {
        setName("");
        setSlug("");
        setOrder(0);
        setIsEditing(null);
    };

    const handleEdit = (category: Category) => {
        setIsEditing(category);
        setName(category.name);
        setSlug(category.slug);
        setOrder(category.order || 0);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("*").order("order", { ascending: true });
        if (data) setCategories(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from("categories")
                    .update({ name, slug, order })
                    .eq("id", isEditing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("categories")
                    .insert([{ name, slug, order }]);
                if (error) throw error;
            }

            await fetchCategories();
            resetForm();
            router.refresh(); // Refresh server components if needed
        } catch (error) {
            console.error(error);
            alert("Failed to save category");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect products linked to this category.")) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;
            await fetchCategories();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full lg:w-1/3 order-first lg:order-last">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 sticky top-24">
                    <h2 className="text-xl font-bold mb-6">{isEditing ? "Edit Category" : "Add New Category"}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Display Name</label>
                            <Input
                                placeholder="e.g. Automation"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!isEditing) {
                                        setSlug(e.target.value.toLowerCase().replace(/ /g, "-"));
                                    }
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Slug (URL)</label>
                            <Input
                                placeholder="e.g. automation"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Order</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={order}
                                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
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
                                {isLoading ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
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
                                <th className="p-4 font-medium">Order</th>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Slug</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-white/50 w-20">{category.order}</td>
                                    <td className="p-4 font-medium">{category.name}</td>
                                    <td className="p-4 text-white/50">{category.slug}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2 hover:bg-white/10 rounded text-blue-400"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 hover:bg-white/10 rounded text-red-500"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">
                                        No categories found. Create one to get started.
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

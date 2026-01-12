import { createClient } from "@/utils/supabase/server";
import ProductManager from "@/components/admin/ProductManager";

export default async function AdminProductsPage() {
    const supabase = await createClient();

    // Fetch products and categories to pass to the client component
    const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: categories } = await supabase.from("categories").select("*").order("order", { ascending: true });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <p className="text-white/50 mt-2">Manage your product catalog.</p>
            </div>

            <ProductManager
                initialProducts={products || []}
                categories={categories || []}
            />
        </div>
    );
}

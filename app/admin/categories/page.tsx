import { createClient } from "@/utils/supabase/server";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from("categories").select("*").order("order", { ascending: true });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Category Management</h1>
                <p className="text-white/50 mt-2">Manage submenus and product groupings.</p>
            </div>

            <CategoryManager initialCategories={categories || []} />
        </div>
    );
}

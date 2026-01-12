import { createClient } from "@/utils/supabase/server";
import ProductCatalog from "@/components/ProductCatalog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 60; // Revalidate every minute

export default async function ProductsPage() {
    const supabase = await createClient();

    // Fetch all data
    const { data: categories } = await supabase.from("categories").select("*").order("order", { ascending: true });
    const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    return (
        <main className="bg-black min-h-screen text-white">
            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-20">
                <ProductCatalog
                    categories={categories || []}
                    products={products || []}
                />
            </div>

            <Footer />
        </main>
    );
}

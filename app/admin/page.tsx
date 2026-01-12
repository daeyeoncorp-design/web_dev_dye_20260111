import { createClient } from "@/utils/supabase/server";

export default async function AdminOverview() {
    const supabase = await createClient();

    // Fetch stats
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                    <h3 className="text-sm font-medium text-white/50 mb-2">Total Products</h3>
                    <p className="text-4xl font-bold text-white">{productsCount || 0}</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
                    <h3 className="text-sm font-medium text-white/50 mb-2">Current Stats</h3>
                    <p className="text-4xl font-bold text-white">{categoriesCount || 0}</p>
                    <p className="text-sm text-white/30 mt-1">Active Categories</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5 flex flex-col justify-center">
                    <div className="text-sm text-white/50">System Status</div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-white font-medium">Operational</span>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Placeholder for Quick Actions */}
                    <a href="/admin/products" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center group">
                        <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                        <span className="text-sm font-medium text-white">Add Product</span>
                    </a>
                    <a href="/admin/categories" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center group">
                        <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🗂️</span>
                        <span className="text-sm font-medium text-white">Manage Categories</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

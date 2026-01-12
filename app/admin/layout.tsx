import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Double check role on server component for safety (middleware does the main check)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
        redirect("/");
    }

    const NAV_ITEMS = [
        { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
        { label: "Products", href: "/admin/products", icon: "Package" },
        { label: "Resources", href: "/admin/resources", icon: "FolderOpen" },
        { label: "Categories", href: "/admin/categories", icon: "ListTree" },
        { label: "Settings", href: "/admin/settings", icon: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0e0e0e] flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <span className="text-xl font-bold tracking-tight">DYC Admin</span>
                    <span className="ml-2 text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
                        {profile.role === 'super_admin' ? 'Master' : 'Admin'}
                    </span>
                </div>

                <div className="flex-1 py-6 px-3 flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {/* Simple Icon Replacement */}
                            <span className="opacity-70">
                                {item.label === 'Overview' && '📊'}
                                {item.label === 'Categories' && '🗂️'}
                                {item.label === 'Products' && '📦'}
                                {item.label === 'Resources' && '📂'}
                                {item.label === 'Settings' && '⚙️'}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.email}</p>
                            <p className="text-xs text-white/40 truncate capitalize">{profile.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                <div className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl sticky top-0 z-10 px-8 flex items-center justify-between">
                    <h1 className="text-sm font-medium text-white/50">Dashboard</h1>
                    <Link href="/" target="_blank" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        View Live Site →
                    </Link>
                </div>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

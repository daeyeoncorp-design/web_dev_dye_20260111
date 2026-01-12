import { createClient } from "@/utils/supabase/server";
import ResourceManager from "@/components/admin/ResourceManager";

export default async function AdminResourcesPage() {
    const supabase = await createClient();
    const { data: resources } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Resource Management</h1>
                <p className="text-white/60">Upload and manage support documents (PDFs, brochures, etc).</p>
            </div>
            <ResourceManager initialResources={resources || []} />
        </div>
    );
}

import { createClient } from "@/utils/supabase/server";
import SupportPageClient from "@/components/SupportPageClient";

export default async function SupportPage() {
    const supabase = await createClient();
    const { data: resources } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

    return <SupportPageClient resources={resources || []} />;
}

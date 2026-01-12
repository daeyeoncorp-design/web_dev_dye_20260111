import { createClient } from "@/utils/supabase/server";
import SupportPageClient from "@/components/SupportPageClient";
import { Suspense } from "react";

export default async function SupportPage() {
    const supabase = await createClient();
    const { data: resources } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <SupportPageClient resources={resources || []} />
        </Suspense>
    );
}

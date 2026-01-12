"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";

type Resource = Tables<"resources">;

// Simple UI Components (Reused)
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
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

export default function ResourceManager({
    initialResources
}: {
    initialResources: Resource[]
}) {
    const supabase = createClient();
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>(initialResources);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"manual" | "brochure" | "certification">("manual");
    const [fileUrl, setFileUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setTitle("");
        setType("manual");
        setFileUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const fetchResources = async () => {
        const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
        if (data) setResources(data);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsLoading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('resource-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('resource-files')
                .getPublicUrl(filePath);

            setFileUrl(publicUrl);
        } catch (error) {
            console.error(error);
            alert("Error uploading file");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileUrl) {
            alert("Please upload a file");
            return;
        }
        setIsLoading(true);

        const resourceData = {
            title,
            type,
            file_url: fileUrl,
        };

        try {
            const { error } = await supabase
                .from("resources")
                .insert([resourceData]);

            if (error) throw error;

            await fetchResources();
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save resource");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        setIsLoading(true);
        try {
            // Try to delete file from storage if possible (optional, but good practice)
            // Extract filename from URL... for now we just delete the record to be safe

            const { error } = await supabase.from("resources").delete().eq("id", id);
            if (error) throw error;
            await fetchResources();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete resource");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full xl:w-1/3 order-first xl:order-last">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 sticky top-24">
                    <h2 className="text-xl font-bold mb-6">Add New Resource</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Title</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. User Manual v2.0" />
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">Type</label>
                            <Select value={type} onChange={(e) => setType(e.target.value as any)} required>
                                <option value="manual">User Manual</option>
                                <option value="brochure">Brochure</option>
                                <option value="certification">Certification</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-white/40 font-bold mb-2">File (PDF/Image)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 w-full"
                            />
                            {fileUrl && (
                                <div className="mt-2 text-xs text-green-400 truncate">Uploaded ✓</div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white hover:bg-blue-500 w-full mt-4 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Add Resource"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="flex-1">
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-xs text-white/50 uppercase">
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium">File</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {resources.map((res) => (
                                <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${res.type === 'manual' ? 'bg-blue-500/20 text-blue-300' :
                                                res.type === 'brochure' ? 'bg-purple-500/20 text-purple-300' :
                                                    'bg-green-500/20 text-green-300'
                                            }`}>
                                            {res.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium">{res.title}</td>
                                    <td className="p-4 text-sm text-white/40">
                                        <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                                            View File ↗
                                        </a>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(res.id, res.file_url)}
                                            className="p-2 hover:bg-white/10 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {resources.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">
                                        No resources found.
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

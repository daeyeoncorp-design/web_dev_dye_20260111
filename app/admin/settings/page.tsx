export default function SettingsPage() {
    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-8">
                {/* Site Info Card */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-4">Site Configuration</h2>
                    <p className="text-white/60 mb-6 leading-relaxed">
                        This section is a placeholder for future global site settings.
                        In a full-scale application, you would manage:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-blue-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
                            </div>
                            <h3 className="font-medium text-white mb-1">Company Info</h3>
                            <p className="text-xs text-white/40">Manage address, contact email, and social links displayed in the footer.</p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-purple-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21H3"></path><path d="M21 3v18"></path><path d="M3 21V3"></path><path d="M3 3h18"></path><path d="M10 14.5 6 3"></path><path d="M10 21l4-14.5"></path><path d="m14 21 4-18"></path></svg>
                            </div>
                            <h3 className="font-medium text-white mb-1">SEO Defaults</h3>
                            <p className="text-xs text-white/40">Set default meta titles, descriptions, and Open Graph images for shared links.</p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-green-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            </div>
                            <h3 className="font-medium text-white mb-1">Localization</h3>
                            <p className="text-xs text-white/40">Manage default language and supported regions.</p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-orange-400 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <h3 className="font-medium text-white mb-1">Access Control</h3>
                            <p className="text-xs text-white/40">Invite new admins or reset passwords (currently handled via Supabase Auth).</p>
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-4">Your Account</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xl">
                            A
                        </div>
                        <div>
                            <p className="font-medium text-white">Current Session</p>
                            <p className="text-sm text-white/40">Logged in via Google Secure Auth</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

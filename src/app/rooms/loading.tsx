export default function RoomsLoading() {
    return (
        <div className="min-h-screen bg-[var(--background)] pt-[100px] px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="h-10 w-64 bg-[var(--foreground)]/5 rounded-xl animate-pulse" />
                        <div className="h-4 w-96 bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                    </div>
                    <div className="h-12 w-48 bg-[var(--foreground)]/5 rounded-xl animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-3xl border border-[var(--border-color)] overflow-hidden bg-[var(--card-bg)]">
                            <div className="aspect-[16/10] bg-[#B88F54]/5 animate-pulse" />
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-6 w-32 bg-[var(--foreground)]/5 rounded animate-pulse" />
                                    <div className="h-6 w-20 bg-[var(--foreground)]/5 rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-[var(--foreground)]/5 rounded animate-pulse" />
                                    <div className="h-3 w-2/3 bg-[var(--foreground)]/5 rounded animate-pulse" />
                                </div>
                                <div className="h-12 w-full bg-[var(--foreground)]/5 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

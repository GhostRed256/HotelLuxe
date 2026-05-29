export default function BookingsLoading() {
    return (
        <div className="min-h-screen bg-[var(--background)] pt-[100px] px-8">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-4 mb-12">
                    <div className="h-10 w-48 bg-[var(--foreground)]/5 rounded-xl animate-pulse" />
                    <div className="h-4 w-64 bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                </div>

                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-32 aspect-square rounded-2xl bg-[#B88F54]/5 animate-pulse" />
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex justify-between">
                                    <div className="h-6 w-40 bg-[var(--foreground)]/5 rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-[var(--foreground)]/5 rounded animate-pulse" />
                                    <div className="h-3 w-3/4 bg-[var(--foreground)]/5 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

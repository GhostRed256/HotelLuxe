export default function AboutLoading() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-8">
            <div className="rounded-[2rem] border border-[var(--border-color)] p-12 bg-[var(--card-bg)] space-y-12">
                <div className="space-y-6 text-center">
                    <div className="h-12 w-80 bg-[var(--foreground)]/5 rounded-xl mx-auto animate-pulse" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                        <div className="h-4 w-full bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                        <div className="h-4 w-2/3 bg-[var(--foreground)]/5 rounded-full mx-auto animate-pulse" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-6 border border-[var(--accent-primary)]/20 rounded-lg space-y-3">
                            <div className="h-6 w-32 bg-[var(--foreground)]/5 rounded animate-pulse" />
                            <div className="h-3 w-full bg-[var(--foreground)]/5 rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                <div className="h-32 w-full bg-[var(--foreground)]/5 rounded-2xl animate-pulse" />
            </div>
        </div>
    )
}

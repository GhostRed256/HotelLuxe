"use client"

export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Hero Skeleton */}
            <div className="h-[90vh] flex flex-col items-center justify-center relative overflow-hidden px-4">
                <div className="w-full max-w-4xl space-y-8 text-center">
                    <div className="h-4 w-48 bg-[var(--accent-primary)]/5 rounded-full mx-auto animate-pulse" />
                    <div className="h-20 md:h-32 w-full max-w-2xl bg-[var(--foreground)]/5 rounded-2xl mx-auto animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-10 md:h-16 w-full max-w-3xl bg-[var(--foreground)]/5 rounded-xl mx-auto animate-pulse" />
                        <div className="h-4 w-64 bg-[var(--foreground)]/5 rounded-full mx-auto animate-pulse" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                        <div className="h-14 w-60 bg-[var(--accent-primary)]/10 rounded-full animate-pulse" />
                        <div className="h-14 w-60 bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                        <div className="h-14 w-60 bg-[var(--foreground)]/5 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Category Grid Skeleton */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="aspect-[4/5] rounded-3xl bg-[var(--foreground)]/5 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}

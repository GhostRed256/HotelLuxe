export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top Bar Skeleton */}
      <div className="border-b border-white/5 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
          <div>
            <div className="h-5 w-48 bg-white/5 rounded-lg animate-pulse mb-2" />
            <div className="h-3 w-32 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-28 bg-white/5 rounded-xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="h-3 w-20 bg-white/5 rounded animate-pulse mb-4" />
              <div className="h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex gap-4">
            <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 border-b border-white/5 flex items-center gap-8">
              <div className="flex-1">
                <div className="h-4 w-36 bg-white/5 rounded animate-pulse mb-2" />
                <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
              <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useTransition, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { updateBookingStatus, deleteBooking, deleteMultipleBookings, approveMultipleBookings } from "./actions"
import { Trash2, RotateCcw, CheckSquare, Square, Check, X, Loader2, ShieldCheck, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BookingRow {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  checkIn: string
  checkOut: string
  status: string
  paymentStatus?: "PAID" | "PENDING" | "MANUAL"
  upiTxnId?: string
  paymentScreenshot?: string
  room: { name: string }
}

function AdminBookingsTableInner({ bookings, setGlobalLoading }: { bookings: BookingRow[], setGlobalLoading?: (loading: boolean) => void }) {
  const searchParams = useSearchParams()
  const defaultSearch = searchParams.get('bookingId') || ""

  const [searchTerm, setSearchTerm] = useState(defaultSearch)
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filteredBookings = bookings.filter(b => {
    // We check substring of customer name, email OR ID (for the email link routing)
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Simple date filter: matches if Check In or Check Out is on the selected date
    const matchesDate = dateFilter ? (
      new Date(b.checkIn).toISOString().split('T')[0] === dateFilter ||
      new Date(b.checkOut).toISOString().split('T')[0] === dateFilter
    ) : true

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter

    return matchesSearch && matchesDate && matchesStatus
  })

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBulkPending, setIsBulkPending] = useState(false)

  const isAllSelected = filteredBookings.length > 0 && selectedIds.length === filteredBookings.length

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredBookings.map(b => b.id))
    }
  }

  const toggleSelected = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkAction = async (action: "APPROVE" | "DELETE") => {
    if (selectedIds.length === 0) return
    if (!confirm(`Are you sure you want to ${action === 'APPROVE' ? 'Approve' : 'Delete'} ${selectedIds.length} selected bookings?`)) return

    setIsBulkPending(true)
    setGlobalLoading?.(true)
    startTransition(async () => {
      try {
        if (action === "APPROVE") {
          await approveMultipleBookings(selectedIds)
        } else {
          await deleteMultipleBookings(selectedIds)
        }
        setSelectedIds([])
        router.refresh()
      } finally {
        setIsBulkPending(false)
        setGlobalLoading?.(false)
      }
    })
  }

  const handleAction = async (id: string, status: string) => {
    setGlobalLoading?.(true)
    startTransition(async () => {
      try {
        await updateBookingStatus(id, status as "APPROVED" | "REJECTED")
        router.refresh()
      } finally {
        setGlobalLoading?.(false)
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    setGlobalLoading?.(true)
    startTransition(async () => {
      try {
        await deleteBooking(id)
        router.refresh()
      } finally {
        setGlobalLoading?.(false)
      }
    })
  }

  // Effect to clean up unused effect warning if it existed
  useEffect(() => {
    // console.log("Admin table mounted with", bookings.length, "bookings")
  }, [bookings.length])

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col gap-6 mb-10">
        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search Registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !py-4 !px-6 !text-base md:!text-sm w-full md:!w-64"
          />

          {/* Date Filter - Large tappable container */}
          <div className="relative w-full md:w-auto">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1.5 block md:hidden">Filter by Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-input !py-4 !px-6 !text-base md:!text-sm md:!py-3 w-full md:!w-auto cursor-pointer"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input !py-4 !px-6 !text-base md:!text-sm md:!py-3 w-full md:!w-48 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Bulk Actions (Desktop Only or visible when selected) */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-4 p-2 pl-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-xl"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] whitespace-nowrap">
                  {selectedIds.length} Selected
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction("APPROVE")}
                    disabled={isBulkPending}
                    className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                    title="Approve Selected"
                  >
                    {isBulkPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button
                    onClick={() => handleBulkAction("DELETE")}
                    disabled={isBulkPending}
                    className="p-2 bg-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                    title="Delete Selected"
                  >
                    {isBulkPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <table className="w-full text-left border-collapse min-w-[1000px] md:min-w-0">
        <thead className="hidden md:table-header-group">
          <tr className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 border-b border-white/5">
            <th className="p-6">
              <button onClick={toggleAll} className="p-1 hover:bg-white/10 rounded transition-colors">
                {isAllSelected ? <CheckSquare size={16} className="text-[var(--accent-primary)]" /> : <Square size={16} />}
              </button>
            </th>
            <th className="p-6">Guest Profile</th>
            <th className="p-6">Suite Selection</th>
            <th className="p-6">Duration</th>
            <th className="p-6 md:text-center">Protocol Status</th>
            <th className="p-6 text-right font-black">Actions</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-20 text-center opacity-20 italic tracking-widest text-sm">
                No matching entries found in the registry.
              </td>
            </tr>
          ) : (
            filteredBookings.map((b) => (
              <tr key={b.id} className={`border border-white/10 md:border-0 md:border-b md:border-white/5 group transition-colors block md:table-row mb-6 md:mb-0 rounded-2xl md:rounded-none overflow-hidden ${selectedIds.includes(b.id) ? 'bg-white/10' : 'bg-black/20 md:bg-transparent'} hover:bg-white/5`}>
                <td className="p-5 md:p-6 block md:table-cell border-b border-white/5 md:border-0">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1 text-[var(--accent-primary)]">Select</div>
                  <button onClick={() => toggleSelected(b.id)} className="p-1 hover:bg-white/10 rounded transition-colors">
                    {selectedIds.includes(b.id) ? <CheckSquare size={16} className="text-[var(--accent-primary)]" /> : <Square size={16} />}
                  </button>
                </td>
                <td className="p-5 md:p-6 block md:table-cell border-b border-white/5 md:border-0">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1 text-[var(--accent-primary)]">Guest Profile</div>
                  <div className="font-bold text-xl md:text-lg">{b.customerName}</div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="text-[10px] opacity-40 tracking-widest">{b.customerEmail || 'No Email'}</div>
                    {b.customerPhone && (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] font-medium opacity-80 tracking-wider">{b.customerPhone}</span>
                        <a
                          href={`tel:${b.customerPhone}`}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-1"
                        >
                          Call Now
                        </a>
                      </div>
                    )}

                    {/* Admin evidence link (Server-side handled) */}
                    {(b.upiTxnId || b.paymentScreenshot) && (
                      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">
                          <ShieldCheck size={12} />
                          Payment Details
                        </div>
                        {b.upiTxnId && <div className="text-[11px] font-bold opacity-80 mb-2">TXN: {b.upiTxnId}</div>}
                        {b.paymentScreenshot && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                const newWindow = window.open("", "_blank");
                                if (newWindow) {
                                  newWindow.document.write(`<html><head><title>Payment Proof - ${b.customerName}</title></head><body style="margin:0;background:#000;display:flex;align-items:center;justify-center:center"><img src="${b.paymentScreenshot}" style="max-width:100%;max-height:100vh;object-fit:contain" /></body></html>`);
                                  const img = newWindow.document.createElement("img");
                                  img.src = b.paymentScreenshot || "";
                                  img.style.maxWidth = "100%";
                                  img.style.maxHeight = "90vh";
                                  img.style.margin = "20px";
                                  img.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
                                  img.style.borderRadius = "12px";
                                  img.style.border = "1px solid rgba(255,255,255,0.1)";

                                  newWindow.document.body.appendChild(img);
                                }
                              }}
                              className="w-full text-center px-3 py-2 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)] hover:text-white rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-lg"
                            >
                              View Evidence Screenshot
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {b.paymentStatus === 'MANUAL' && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[9px] font-bold uppercase tracking-widest text-amber-500/60 flex items-center gap-2">
                        <AlertCircle size={12} />
                        Requested Manual Review
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-5 md:p-6 font-medium block md:table-cell border-b border-white/5 md:border-0">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1 text-[var(--accent-primary)]">Suite Selection</div>
                  <div className="text-lg md:text-sm">{b.room.name}</div>
                </td>
                <td className="p-5 md:p-6 opacity-60 block md:table-cell border-b border-white/5 md:border-0">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1 text-[var(--accent-primary)]">Duration</div>
                  {new Date(b.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })} — {new Date(b.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
                <td className="p-5 md:p-6 md:text-center block md:table-cell border-b border-white/5 md:border-0">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2 text-[var(--accent-primary)]">Protocol Status</div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase inline-block ${(b.status || 'PENDING') === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    (b.status || '') === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                    {b.status || 'PENDING'}
                    <span className="opacity-40 text-[9px] font-black block mt-2 tracking-widest">
                      {b.paymentStatus === 'PAID' ? '✓ VERIFIED PAID' :
                        b.paymentStatus === 'MANUAL' ? '⚠️ MANUAL REVIEW' :
                          '❌ UNPAID / PENDING'}
                    </span>
                  </span>
                </td>
                <td className="p-5 md:p-6 md:text-right block md:table-cell bg-white/5 md:bg-transparent">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3 text-[var(--accent-primary)]">Actions</div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {b.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleAction(b.id, 'APPROVED')}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'REJECTED')}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20 active:scale-95"
                        >
                          <X size={12} /> Decline
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAction(b.id, b.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest active:scale-95"
                          title="Change Decision"
                        >
                          <RotateCcw size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          disabled={isPending}
                          className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                        >
                          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminBookingsTable({ bookings, setGlobalLoading }: { bookings: BookingRow[], setGlobalLoading?: (loading: boolean) => void }) {
  return (
    <Suspense fallback={<div className="p-20 text-center opacity-20 italic">Loading Registry...</div>}>
      <AdminBookingsTableInner bookings={bookings} setGlobalLoading={setGlobalLoading} />
    </Suspense>
  )
}

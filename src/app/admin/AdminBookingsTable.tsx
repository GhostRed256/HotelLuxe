"use client"

import { useState, useTransition, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { updateBookingStatus, deleteBooking } from "./actions"
import { Trash2, Phone, ExternalLink, RotateCcw } from "lucide-react"

function AdminBookingsTableInner({ bookings }: { bookings: any[] }) {
  const searchParams = useSearchParams()
  const defaultSearch = searchParams.get('bookingId') || ""

  const [searchTerm, setSearchTerm] = useState(defaultSearch)
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (!confirm(`Are you sure you want to ${status === 'APPROVED' ? 'Authorize' : 'Decline'} this booking?`)) return
    startTransition(async () => {
      await updateBookingStatus(id, status)
      router.refresh()
    })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`PERMANENT ACTION: Are you sure you want to remove ${name} from the registry? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteBooking(id)
      router.refresh()
    })
  }

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
              style={{ minHeight: '52px' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select !py-4 !px-6 !text-base md:!text-sm md:!py-3 w-full md:!w-auto"
            style={{ minHeight: '52px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse block md:table">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-white/5 text-left text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 md:table-row">
            <th className="p-6">Guest Profile</th>
            <th className="p-6">Suite Selection</th>
            <th className="p-6">Duration</th>
            <th className="p-6 text-center">Protocol Status</th>
            <th className="p-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light block md:table-row-group">
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-20 text-center opacity-40 italic">No records found in the registry.</td>
            </tr>
          ) : (
            filteredBookings.map((b) => (
              <tr key={b.id} className="border border-white/10 md:border-0 md:border-b md:border-white/5 group hover:bg-white/5 transition-colors block md:table-row mb-6 md:mb-0 rounded-2xl md:rounded-none overflow-hidden bg-black/20 md:bg-transparent">
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
                  </div>

                  {/* Payment Verification Proof */}
                  {(b.upiTxnId || b.paymentScreenshot) && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs max-w-xs">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2">
                        UPI Verification Proof (Demo)
                      </div>
                      {b.upiTxnId && (
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="opacity-40 text-[10px] uppercase font-semibold">UTR / Txn ID:</span>
                          <code className="bg-black/60 px-2 py-0.5 rounded text-[11px] font-mono text-white select-all">{b.upiTxnId}</code>
                        </div>
                      )}
                      {b.paymentScreenshot && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newWindow = window.open();
                              if (newWindow) {
                                newWindow.document.title = `Payment Screenshot - ${b.customerName}`;
                                newWindow.document.body.style.margin = "0";
                                newWindow.document.body.style.background = "#0e080c";
                                newWindow.document.body.style.display = "flex";
                                newWindow.document.body.style.alignItems = "center";
                                newWindow.document.body.style.justifyContent = "center";
                                newWindow.document.body.style.height = "100vh";

                                const img = newWindow.document.createElement("img");
                                img.src = b.paymentScreenshot;
                                img.style.maxWidth = "90%";
                                img.style.maxHeight = "95vh";
                                img.style.objectFit = "contain";
                                img.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
                                img.style.borderRadius = "12px";
                                img.style.border = "1px solid rgba(255,255,255,0.1)";

                                newWindow.document.body.appendChild(img);
                              }
                            }}
                            className="w-full text-center px-3 py-1.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)] hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            View Payment Screenshot Proof
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase inline-block ${b.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    b.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-5 md:p-6 md:text-right block md:table-cell bg-white/5 md:bg-transparent">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3 text-[var(--accent-primary)]">Actions</div>
                  <div className="flex flex-wrap gap-3 md:justify-end">
                    {b.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleAction(b.id, 'APPROVED')}
                          disabled={isPending}
                          className="flex-1 md:flex-none px-6 py-4 md:py-2 border border-emerald-500/20 md:border-0 rounded-xl md:rounded-none bg-emerald-500/10 md:bg-transparent text-emerald-500 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 text-center active:scale-95"
                        >
                          Authorize
                        </button>
                        <button
                          onClick={() => handleAction(b.id, 'REJECTED')}
                          disabled={isPending}
                          className="flex-1 md:flex-none px-6 py-4 md:py-2 border border-rose-500/20 md:border-0 rounded-xl md:rounded-none bg-rose-500/10 md:bg-transparent text-rose-500 hover:text-rose-400 font-bold text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 text-center active:scale-95"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleAction(b.id, b.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
                          disabled={isPending}
                          className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity text-[9px] font-bold uppercase tracking-widest text-white active:scale-95"
                          title="Change Decision"
                        >
                          <RotateCcw size={12} />
                          <span className="hidden sm:inline">Change Decision</span>
                        </button>
                        <span className="opacity-20 text-[10px] font-bold uppercase tracking-widest hidden md:inline">Closed Case</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(b.id, b.customerName)}
                      disabled={isPending}
                      className="p-4 md:p-2 rounded-xl md:rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-500/20"
                      title="Remove from Registry"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default function AdminBookingsTable(props: { bookings: any[] }) {
  return (
    <Suspense fallback={<div className="p-10 text-center opacity-50">Loading Registry...</div>}>
      <AdminBookingsTableInner {...props} />
    </Suspense>
  )
}

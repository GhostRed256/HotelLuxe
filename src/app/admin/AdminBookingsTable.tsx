"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateBookingStatus } from "./actions"

export default function AdminBookingsTable({ bookings }: { bookings: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [csvStartDate, setCsvStartDate] = useState("")
  const [csvEndDate, setCsvEndDate] = useState("")

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const min = new Date(Math.min(...bookings.map(b => new Date(b.checkIn).getTime()))).toISOString().split('T')[0]
      
      const approvedBookings = bookings.filter(b => b.status === 'APPROVED')
      const max = approvedBookings.length > 0 
        ? new Date(Math.max(...approvedBookings.map(b => new Date(b.checkOut).getTime()))).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
        
      setCsvStartDate(min)
      setCsvEndDate(max)
    }
  }, [bookings])

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      await updateBookingStatus(id, status)
      router.refresh()
    })
  }

  const handleExportCSV = () => {
    const csvBookings = bookings.filter(b => {
      const bIn = new Date(b.checkIn).toISOString().split('T')[0]
      if (csvStartDate && bIn < csvStartDate) return false
      if (csvEndDate && bIn > csvEndDate) return false
      return true
    })

    const headers = ["ID", "Customer Name", "Customer Email", "Room", "Check In", "Check Out", "Status"]
    const csvContent = [
      headers.join(","),
      ...csvBookings.map(b => [
        b.id,
        `"${b.customerName}"`,
        `"${b.customerEmail}"`,
        `"${b.room.name}"`,
        new Date(b.checkIn).toLocaleDateString(),
        new Date(b.checkOut).toLocaleDateString(),
        b.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
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
      <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
        <div className="flex flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search Registry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !py-3 !px-6 !w-64"
          />
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="form-input !py-3 !px-6 !w-auto"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select !py-3 !px-6 !w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 border border-white/10 p-2 rounded-xl bg-black/20">
            <span className="text-[9px] font-bold uppercase opacity-50 whitespace-nowrap pl-2">CSV Range:</span>
            <input 
              type="date" 
              value={csvStartDate} 
              onChange={e => setCsvStartDate(e.target.value)} 
              className="form-input !py-1 !px-2 !text-xs !bg-transparent !border-none !shadow-none" 
            />
            <span className="opacity-50 text-xs">to</span>
            <input 
              type="date" 
              value={csvEndDate} 
              onChange={e => setCsvEndDate(e.target.value)} 
              className="form-input !py-1 !px-2 !text-xs !bg-transparent !border-none !shadow-none" 
            />
          </div>
          <button onClick={handleExportCSV} className="btn-outline !py-2 !px-8 text-[10px] uppercase tracking-widest font-bold w-full">
            Download CSV
          </button>
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
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase inline-block ${
                    b.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    b.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-5 md:p-6 md:text-right block md:table-cell bg-white/5 md:bg-transparent">
                  <div className="md:hidden text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3 text-[var(--accent-primary)]">Actions</div>
                  {b.status === 'PENDING' ? (
                    <div className="flex gap-4 md:justify-end">
                      <button 
                        onClick={() => handleAction(b.id, 'APPROVED')}
                        disabled={isPending}
                        className="flex-1 md:flex-none py-3 md:py-0 border border-emerald-500/20 md:border-0 rounded-xl md:rounded-none bg-emerald-500/10 md:bg-transparent text-emerald-500 hover:text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 text-center"
                      >
                        Authorize
                      </button>
                      <button 
                        onClick={() => handleAction(b.id, 'REJECTED')}
                        disabled={isPending}
                        className="flex-1 md:flex-none py-3 md:py-0 border border-rose-500/20 md:border-0 rounded-xl md:rounded-none bg-rose-500/10 md:bg-transparent text-rose-500 hover:text-rose-400 font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 text-center"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="opacity-20 text-[10px] font-bold uppercase tracking-widest">Closed Case</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

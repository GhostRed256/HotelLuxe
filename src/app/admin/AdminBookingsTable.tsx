"use client"

import { useState } from "react"
import { updateBookingStatus } from "./actions"

export default function AdminBookingsTable({ bookings }: { bookings: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const handleExportCSV = () => {
    const headers = ["ID", "Customer Name", "Customer Email", "Room", "Check In", "Check Out", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map(b => [
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
    <div className="glass-panel overflow-x-auto p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex gap-4 flex-wrap">
          <input 
            type="text" 
            placeholder="Search customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded border border-black/10 dark:border-white/10 bg-transparent"
          />
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 rounded border border-black/10 dark:border-white/10 bg-transparent"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded border border-black/10 dark:border-white/10 bg-transparent"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <button onClick={handleExportCSV} className="btn-outline whitespace-nowrap">
          Export to CSV
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-black/10 dark:border-white/10 text-left">
            <th className="p-4">Customer</th>
            <th className="p-4">Room</th>
            <th className="p-4">Dates</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center opacity-50">No bookings found.</td>
            </tr>
          ) : (
            filteredBookings.map((b) => (
              <tr key={b.id} className="border-b border-black/5 dark:border-white/5">
                <td className="p-4">
                  <div className="font-semibold">{b.customerName}</div>
                  <div className="text-sm opacity-70">{b.customerEmail}</div>
                </td>
                <td className="p-4">{b.room.name}</td>
                <td className="p-4 text-sm">
                  {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    b.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                    b.status === 'APPROVED' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                    'bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {b.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => updateBookingStatus(b.id, 'APPROVED')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:opacity-80"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateBookingStatus(b.id, 'REJECTED')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:opacity-80"
                      >
                        Reject
                      </button>
                    </>
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

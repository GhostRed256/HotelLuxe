"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { compressImage } from "@/lib/image-utils"
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Home,
  MapPin,
  Phone,
  DollarSign,
  FileText,
  Camera,
  Trash2,
  ExternalLink,
  Settings,
  Sheet,
  Plus,
  Lock,
} from "lucide-react"

interface AdminSheetSyncFormProps {
  rooms?: any[]
}

const LOCATIONS = [
  { id: "Chaliha Nagar", label: "Chaliha Nagar", sheetTab: "Chaliha Nagar" },
  { id: "Bordoloi Nagar (Near Lake)", label: "Lake Bordoloi Nagar", sheetTab: "Lake Bordoloi Nagar" },
  { id: "Bordoloi Nagar (Near Income Tax Office)", label: "IT office Bordoloi Nagar", sheetTab: "IT office Bordoloi Nagar" },
]

export default function AdminSheetSyncForm({ rooms = [] }: AdminSheetSyncFormProps) {
  const router = useRouter()
  // Today's and tomorrow's date strings in YYYY-MM-DD
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  const [location, setLocation] = useState<string>("Chaliha Nagar")
  const [checkIn, setCheckIn] = useState(todayStr)
  const [checkOut, setCheckOut] = useState(tomorrowStr)

  const [roomId, setRoomId] = useState("")
  const [roomNo, setRoomNo] = useState("")

  const [guestName, setGuestName] = useState("")
  const [address, setAddress] = useState("")
  const [parentName, setParentName] = useState("")
  const [phone, setPhone] = useState("")
  const [cash, setCash] = useState("")
  const [online, setOnline] = useState("")
  const [notes, setNotes] = useState("")

  // Multi-photo URLs
  const [preBookingUrls, setPreBookingUrls] = useState<string[]>([])
  const [postBookingUrls, setPostBookingUrls] = useState<string[]>([])

  const [isUploadingPre, setIsUploadingPre] = useState(false)
  const [isUploadingPost, setIsUploadingPost] = useState(false)

  const [webhookUrl, setWebhookUrl] = useState("")
  const [showConfig, setShowConfig] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null
    text: string
  }>({ type: null, text: "" })

  const preInputRef = useRef<HTMLInputElement>(null)
  const postInputRef = useRef<HTMLInputElement>(null)

  // Load saved webhook URL from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("staynjoy_sheets_webhook_url")
      if (saved) setWebhookUrl(saved)
    } catch {}
  }, [])

  // Filter rooms by selected location
  const filteredRooms = rooms.filter((r) => {
    if (!r.location) return true
    if (location === "Chaliha Nagar") return r.location.includes("Chaliha")
    if (location.includes("Lake")) return r.location.includes("Lake")
    if (location.includes("Income") || location.includes("IT")) return r.location.includes("Income") || r.location.includes("IT")
    return true
  })

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc)
    setRoomId("")
    setRoomNo("")
  }

  const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    setRoomId(selectedId)
    const found = rooms.find((r) => r.id === selectedId)
    if (found) {
      setRoomNo(found.name || found.roomNumber || "")
    } else {
      setRoomNo("")
    }
  }

  const handleWebhookChange = (val: string) => {
    setWebhookUrl(val)
    try {
      localStorage.setItem("staynjoy_sheets_webhook_url", val.trim())
    } catch {}
  }

  // Upload multiple images to Cloudinary via Next.js API route
  const handleFilesUpload = async (
    files: FileList | File[],
    type: "pre" | "post"
  ) => {
    if (!files || files.length === 0) return

    if (type === "pre") setIsUploadingPre(true)
    else setIsUploadingPost(true)

    setStatusMessage({ type: null, text: "" })

    const uploadedUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
        // CLIENT-SIDE COMPRESSION BEFORE UPLOAD
        // Extremely important for mobile cameras (can be 5MB-15MB each)
        const compressedFile = await compressImage(file, 1200, 1200, 0.7)
        
        const formData = new FormData()
        formData.append("file", compressedFile)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (res.ok && data.url) {
          uploadedUrls.push(data.url)
        } else {
          throw new Error(data.error || `Upload failed for ${file.name}`)
        }
      }

      if (type === "pre") {
        setPreBookingUrls((prev) => [...prev, ...uploadedUrls])
      } else {
        setPostBookingUrls((prev) => [...prev, ...uploadedUrls])
      }
    } catch (err: any) {
      console.error(err)
      setStatusMessage({
        type: "error",
        text: `Photo upload failed: ${err.message || "Unknown error"}`,
      })
    } finally {
      if (type === "pre") setIsUploadingPre(false)
      else setIsUploadingPost(false)
    }
  }

  const removePrePhoto = (idx: number) => {
    setPreBookingUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  const removePostPhoto = (idx: number) => {
    setPostBookingUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!guestName.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter Guest Name.",
      })
      return
    }

    setIsSubmitting(true)
    setStatusMessage({ type: null, text: "" })

    try {
      // Format date to DD-MM-YYYY for the sheet
      let formattedDate = checkIn
      if (checkIn) {
        const parts = checkIn.split("-")
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
        }
      }

      // Map to exact Google Sheet tab name
      let sheetTabName = "Chaliha Nagar"
      if (location.includes("Lake")) sheetTabName = "Lake Bordoloi Nagar"
      else if (location.includes("Income") || location.includes("IT")) sheetTabName = "IT office Bordoloi Nagar"

      const preCombined = preBookingUrls.join("\n")
      const postCombined = postBookingUrls.join("\n")

      const payload = {
        date: formattedDate,
        checkIn,
        checkOut,
        roomId: roomId || undefined,
        location: sheetTabName,
        guestName: guestName.trim(),
        roomNo: roomNo.trim(),
        address: address.trim(),
        parentName: parentName.trim(),
        phone: phone.trim(),
        cash: cash.trim(),
        online: online.trim(),
        notes: notes.trim(),
        preBookingScreenshot: preCombined,
        postBookingScreenshot: postCombined,
        webhookUrl: webhookUrl.trim() || undefined,
      }

      const res = await fetch("/api/admin/sheet-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        setStatusMessage({
          type: "success",
          text: `Synced to [${sheetTabName}] tab & Room booked on website until ${checkOut}!`,
        })

        // Reset form
        setGuestName("")
        setRoomId("")
        setRoomNo("")
        setAddress("")
        setParentName("")
        setPhone("")
        setCash("")
        setOnline("")
        setNotes("")
        setPreBookingUrls([])
        setPostBookingUrls([])
        
        // Refresh server components to show new booking immediately
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to append to Google Sheet")
      }
    } catch (err: any) {
      console.error("Sync error:", err)
      setStatusMessage({
        type: "error",
        text: `Sync Error: ${err.message || "Failed to update Google Sheet"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl animate-in fade-in duration-500 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              <Sheet size={20} />
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-white">
              Google Sheet <span className="text-[var(--accent-primary)]">& Website Sync</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
            <Lock size={12} className="text-emerald-400" />
            Auto-books on website & Appends to location sheet tab
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-white/70 transition-all self-start sm:self-auto"
        >
          <Settings size={14} />
          {showConfig ? "Hide Webhook Settings" : "Webhook Settings"}
        </button>
      </div>

      {/* Webhook Configuration Panel (Collapsible) */}
      {showConfig && (
        <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--gold-primary)] mb-2">
            Google Apps Script Webhook URL
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => handleWebhookChange(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="form-input w-full text-sm font-mono text-white/90 bg-black/50"
          />
          <p className="text-[10px] text-white/40 mt-2">
            Paste your Google Apps Script Web App URL once. It is automatically saved on this device.
          </p>
        </div>
      )}

      {/* Status Message Alert */}
      {statusMessage.text && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
          )}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Selector (3 Tabs corresponding to the 3 Sheet Tabs) */}
        <div>
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2.5 flex items-center gap-1.5 text-white">
            <MapPin size={12} className="text-[var(--accent-primary)]" />
            1. Select Branch / Sheet Tab
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleLocationChange(loc.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  location === loc.id
                    ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{loc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 1: Check-in, Check-out, Room Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Calendar size={12} className="text-[var(--accent-primary)]" />
              Check-In Date (Sheet Date)
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Calendar size={12} className="text-cyan-400" />
              Check-Out Date (Auto-frees room)
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Home size={12} className="text-[var(--accent-primary)]" />
              Select Room / Suite
            </label>
            <select
              value={roomId}
              onChange={handleRoomSelect}
              className="form-select w-full"
            >
              <option value="">-- Choose Room (or type custom below) --</option>
              {filteredRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.type || "Suite"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Room Name if not in list */}
        {!roomId && (
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 block text-white">
              Or Custom Room No. / Name
            </label>
            <input
              type="text"
              placeholder="e.g. Deluxe Room 102"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="form-input w-full"
            />
          </div>
        )}

        {/* Row 2: Guest Name, Phone, Parent's Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <User size={12} className="text-[var(--accent-primary)]" />
              Guest Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Saurajyoti Gogoi, Dibashikha Baroh"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Phone size={12} className="text-[var(--accent-primary)]" />
              Phone No.
            </label>
            <input
              type="tel"
              placeholder="e.g. 9107452684"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <User size={12} className="text-[var(--accent-primary)]" />
              Parent&apos;s Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sunil Gogoi, Dharmeshwar"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Row 3: Address, Cash, Online */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <MapPin size={12} className="text-[var(--accent-primary)]" />
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. TSK, Dhemaji"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <DollarSign size={12} className="text-emerald-400" />
              Cash Amount (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <DollarSign size={12} className="text-cyan-400" />
              Online Amount (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={online}
              onChange={(e) => setOnline(e.target.value)}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
            <FileText size={12} className="text-[var(--accent-primary)]" />
            Notes (e.g. Check-in time / Special requests)
          </label>
          <input
            type="text"
            placeholder="e.g. Check-in 9:30"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-input w-full"
          />
        </div>

        {/* Row 4: Screenshots (Multi-Photo Support: Pre-booking / Aadhaar & Post-booking) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Pre-Booking Screenshot Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                <Camera size={14} className="text-[var(--accent-primary)]" />
                Pre-Booking / Aadhaar ({preBookingUrls.length} photos)
              </span>
              {preBookingUrls.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={10} /> {preBookingUrls.length} Ready
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={preInputRef}
              onChange={(e) => {
                if (e.target.files) handleFilesUpload(e.target.files, "pre")
                e.target.value = ""
              }}
              className="hidden"
            />

            {/* Thumbnail Grid */}
            {preBookingUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {preBookingUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Pre-booking ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                      >
                        <ExternalLink size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => removePrePhoto(idx)}
                        className="p-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => preInputRef.current?.click()}
              disabled={isUploadingPre}
              className={`w-full border-2 border-dashed border-white/15 hover:border-[var(--accent-primary)]/50 rounded-xl flex items-center justify-center gap-2 bg-black/20 hover:bg-white/5 transition-all text-white/60 hover:text-white ${
                preBookingUrls.length > 0 ? "py-3 text-xs" : "py-8"
              }`}
            >
              {isUploadingPre ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[var(--accent-primary)]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  {preBookingUrls.length > 0 ? <Plus size={16} /> : <Upload size={22} className="text-[var(--accent-primary)]" />}
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {preBookingUrls.length > 0 ? "+ Add Another Photo" : "Tap to Snap or Select Multiple Photos"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Post-Booking Screenshot Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                <Camera size={14} className="text-cyan-400" />
                Post-Booking / Payment ({postBookingUrls.length} photos)
              </span>
              {postBookingUrls.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={10} /> {postBookingUrls.length} Ready
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={postInputRef}
              onChange={(e) => {
                if (e.target.files) handleFilesUpload(e.target.files, "post")
                e.target.value = ""
              }}
              className="hidden"
            />

            {/* Thumbnail Grid */}
            {postBookingUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {postBookingUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Post-booking ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                      >
                        <ExternalLink size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => removePostPhoto(idx)}
                        className="p-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => postInputRef.current?.click()}
              disabled={isUploadingPost}
              className={`w-full border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-xl flex items-center justify-center gap-2 bg-black/20 hover:bg-white/5 transition-all text-white/60 hover:text-white ${
                postBookingUrls.length > 0 ? "py-3 text-xs" : "py-8"
              }`}
            >
              {isUploadingPost ? (
                <>
                  <Loader2 size={18} className="animate-spin text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  {postBookingUrls.length > 0 ? <Plus size={16} /> : <Upload size={22} className="text-cyan-400" />}
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {postBookingUrls.length > 0 ? "+ Add Another Photo" : "Tap to Snap or Select Multiple Photos"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full !py-5 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Syncing to Google Sheet & Booking on Website...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Save, Sync to Google Sheet & Book Suite</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

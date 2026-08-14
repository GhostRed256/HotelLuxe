"use client"

import React, { useState, useEffect, useRef } from "react"
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
} from "lucide-react"

interface AdminSheetSyncFormProps {
  rooms?: any[]
}

export default function AdminSheetSyncForm({ rooms = [] }: AdminSheetSyncFormProps) {
  // Today's date in YYYY-MM-DD for input
  const todayStr = new Date().toISOString().split("T")[0]

  const [date, setDate] = useState(todayStr)
  const [guestName, setGuestName] = useState("")
  const [roomNo, setRoomNo] = useState("")
  const [address, setAddress] = useState("")
  const [parentName, setParentName] = useState("")
  const [phone, setPhone] = useState("")
  const [cash, setCash] = useState("")
  const [online, setOnline] = useState("")
  const [notes, setNotes] = useState("")

  const [preBookingUrl, setPreBookingUrl] = useState("")
  const [postBookingUrl, setPostBookingUrl] = useState("")

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

  const handleWebhookChange = (val: string) => {
    setWebhookUrl(val)
    try {
      localStorage.setItem("staynjoy_sheets_webhook_url", val.trim())
    } catch {}
  }

  // Upload image to Cloudinary via Next.js API route
  const handleFileUpload = async (
    file: File,
    type: "pre" | "post"
  ) => {
    if (!file) return

    if (type === "pre") setIsUploadingPre(true)
    else setIsUploadingPost(true)

    setStatusMessage({ type: null, text: "" })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        if (type === "pre") {
          setPreBookingUrl(data.url)
        } else {
          setPostBookingUrl(data.url)
        }
      } else {
        throw new Error(data.error || "Upload failed")
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
      // Format date to DD/MM/YYYY
      let formattedDate = date
      if (date) {
        const parts = date.split("-")
        if (parts.length === 3) {
          formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
        }
      }

      const payload = {
        date: formattedDate,
        guestName: guestName.trim(),
        roomNo: roomNo.trim(),
        address: address.trim(),
        parentName: parentName.trim(),
        phone: phone.trim(),
        cash: cash.trim(),
        online: online.trim(),
        notes: notes.trim(),
        preBookingScreenshot: preBookingUrl,
        postBookingScreenshot: postBookingUrl,
        webhookUrl: webhookUrl.trim() || undefined,
      }

      const res = await fetch("/api/admin/sheet-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.ok && (result.success || result.status === "success")) {
        setStatusMessage({
          type: "success",
          text: "Synced to Google Sheet successfully!",
        })

        // Reset form fields
        setGuestName("")
        setRoomNo("")
        setAddress("")
        setParentName("")
        setPhone("")
        setCash("")
        setOnline("")
        setNotes("")
        setPreBookingUrl("")
        setPostBookingUrl("")
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
              Google Sheet <span className="text-[var(--accent-primary)]">Sync</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-semibold">
            One-tap Guest Record & Photo Intake
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
        {/* Row 1: Date, Guest Name, Room No */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Calendar size={12} className="text-[var(--accent-primary)]" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <User size={12} className="text-[var(--accent-primary)]" />
              Guest Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Panaypal Borah"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Home size={12} className="text-[var(--accent-primary)]" />
              Room No.
            </label>
            <div className="relative">
              <input
                type="text"
                list="rooms-list"
                placeholder="e.g. 101 / Cozy Pink"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                className="form-input w-full"
              />
              {rooms.length > 0 && (
                <datalist id="rooms-list">
                  {rooms.map((r, i) => (
                    <option key={i} value={r.name || r.id}>
                      {r.location ? `${r.name} (${r.location})` : r.name}
                    </option>
                  ))}
                </datalist>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Phone, Parent's Name, Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <Phone size={12} className="text-[var(--accent-primary)]" />
              Phone No.
            </label>
            <input
              type="tel"
              placeholder="e.g. 7638071519"
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
              placeholder="e.g. Nirod Borah"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <MapPin size={12} className="text-[var(--accent-primary)]" />
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. Paritali, Tinsukia"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Row 3: Cash, Online, Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 flex items-center gap-1.5 text-white">
              <FileText size={12} className="text-[var(--accent-primary)]" />
              Notes / Remarks
            </label>
            <input
              type="text"
              placeholder="Any special remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Row 4: Screenshots (Pre-booking / Aadhaar & Post-booking) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Pre-Booking Screenshot Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                <Camera size={14} className="text-[var(--accent-primary)]" />
                Pre-Booking / Aadhaar Screenshot
              </span>
              {preBookingUrl && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={10} /> Uploaded
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={preInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFileUpload(f, "pre")
              }}
              className="hidden"
            />

            {preBookingUrl ? (
              <div className="relative group rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preBookingUrl}
                  alt="Pre-booking preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a
                    href={preBookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreBookingUrl("")}
                    className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => preInputRef.current?.click()}
                disabled={isUploadingPre}
                className="w-full py-8 border-2 border-dashed border-white/15 hover:border-[var(--accent-primary)]/50 rounded-xl flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-white/5 transition-all text-white/60 hover:text-white"
              >
                {isUploadingPre ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-[var(--accent-primary)]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload size={22} className="text-[var(--accent-primary)]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tap to Snap Photo or Upload</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Post-Booking Screenshot Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 flex items-center gap-2">
                <Camera size={14} className="text-cyan-400" />
                Post-Booking / Payment Screenshot
              </span>
              {postBookingUrl && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={10} /> Uploaded
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={postInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFileUpload(f, "post")
              }}
              className="hidden"
            />

            {postBookingUrl ? (
              <div className="relative group rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={postBookingUrl}
                  alt="Post-booking preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a
                    href={postBookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPostBookingUrl("")}
                    className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/40 text-rose-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => postInputRef.current?.click()}
                disabled={isUploadingPost}
                className="w-full py-8 border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-xl flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-white/5 transition-all text-white/60 hover:text-white"
              >
                {isUploadingPost ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload size={22} className="text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tap to Snap Photo or Upload</span>
                  </>
                )}
              </button>
            )}
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
                <span>Appending row to Google Sheet...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Save & Sync to Google Sheet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

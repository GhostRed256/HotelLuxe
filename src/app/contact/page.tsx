"use client"

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass-panel p-10">
          <h1 className="text-4xl font-bold mb-6">
            Get in <span className="text-[var(--accent-primary)]">Touch</span>
          </h1>
          <p className="opacity-80 mb-8 leading-relaxed">
            We are here to assist you with any inquiries or booking requests. 
            Reach out to us and we&apos;ll ensure your stay is nothing short of perfect.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[var(--accent-primary)]">📍 Address</h3>
              <p className="opacity-80">Chaliha Nagar, Bordoloi Nagar Near Lake,</p>
              <p className="opacity-80">Bordoloi Nagar Near Income Tax Office,</p>
              <p className="opacity-80">Tinsukia, Assam, India</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--accent-primary)]">📞 Phone</h3>
              <p className="opacity-80">7002475079</p>
              <p className="opacity-80">8133819414</p>
              <p className="opacity-80">9181042005</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-10">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" required className="w-full p-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" required className="w-full p-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent" placeholder="Your Phone Number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea required className="w-full p-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent min-h-[120px]" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn-primary mt-2">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

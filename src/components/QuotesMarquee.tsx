export default function QuotesMarquee() {
  const quotes = [
    "Cozy Pink Room from ₹1399/night",
    "Free WiFi & Projector in every room",
    "Deluxe Room with bathroom from ₹1799/night",
    "Premium 1BHK Suite from ₹2200/night",
    "2BHK House for parties from ₹2700/night",
    "24×7 Water • Clean Linen • Parking"
  ];

  return (
    <div className="w-full bg-[var(--background)] py-4 overflow-hidden border-y border-white/5 relative">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...quotes, ...quotes, ...quotes].map((quote, idx) => (
          <span key={idx} className="mx-12 font-body text-[var(--foreground)] font-medium tracking-[0.1em] text-xs flex items-center group opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-sm mr-4 text-[var(--accent-primary)]">✧</span>
            {quote}
          </span>
        ))}
      </div>
    </div>
  )
}

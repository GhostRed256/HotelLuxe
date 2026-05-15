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
    <div className="w-full bg-[var(--surface)] py-3 overflow-hidden border-y border-[var(--gold-primary)]/30 relative">
      {/* Gradients to fade edges */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[var(--surface)] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[var(--surface)] to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee flex whitespace-nowrap">
        {[...quotes, ...quotes, ...quotes].map((quote, idx) => (
          <span key={idx} className="mx-8 font-cinzel text-[var(--foreground)] font-bold tracking-[0.2em] text-xs md:text-sm flex items-center group">
            <span className="text-xl mr-8 text-[var(--accent-primary)] opacity-50 group-hover:opacity-100 transition-opacity">✦</span>
            <span className="hover:text-[var(--accent-primary)] transition-colors cursor-default">{quote}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

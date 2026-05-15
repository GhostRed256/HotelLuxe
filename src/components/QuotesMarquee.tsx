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
    <div className="w-full bg-[var(--accent-primary)] py-3 overflow-hidden border-y-2 border-[var(--gold-primary)] relative">
      {/* Gradients to fade edges */}
      <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--accent-primary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--accent-primary)] to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee flex whitespace-nowrap">
        {[...quotes, ...quotes, ...quotes].map((quote, idx) => (
          <span key={idx} className="mx-8 font-cinzel text-white font-bold tracking-widest text-sm flex items-center">
            <span className="text-xl mr-8 opacity-50">✦</span>
            {quote}
          </span>
        ))}
      </div>
    </div>
  )
}

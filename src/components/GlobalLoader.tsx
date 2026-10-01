"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // When the component mounts (hydration complete), hide the loader
    setLoading(false);
  }, []);

  useEffect(() => {
    // Show loader briefly on route change
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!loading) return null;

  return (
    <>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: \
          #global-loader-container { display: none !important; }
          * { opacity: 1 !important; transform: none !important; filter: none !important; }
        \ }} />
      </noscript>
      <div id="global-loader-container" className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#E5B8AD] dark:bg-[#0A0307] transition-opacity duration-500">
        <div className="animate-pulse flex flex-col items-center">
          <svg viewBox="0 0 400 400" className="h-24 w-24 mb-4" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="190" fill="transparent" stroke="#B88F54" strokeWidth="4" strokeDasharray="10 10" className="animate-[spin_4s_linear_infinite]" />
            <g transform="translate(160, 160) scale(0.2)">
              <path d="M10 50 L50 10 L90 50 L90 90 L10 90 Z" fill="none" stroke="#B88F54" strokeWidth="8" />
            </g>
          </svg>
          <h2 className="font-heading text-2xl tracking-[0.2em] uppercase text-[#B88F54]">Loading</h2>
        </div>
      </div>
    </>
  );
}

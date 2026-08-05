"use client"
import { useState } from "react"

export default function ProgressiveImage({ src, alt, className, priority = false }: { src: string, alt: string, className?: string, priority?: boolean }) {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className={`relative overflow-hidden ${className || ''}`}>
            {/* Blurry placeholder effect - super low res placeholder feel using a highly blurred background pulse */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-[#B88F54]/20 dark:bg-[#B88F54]/10 backdrop-blur-[40px] animate-pulse z-0" />
            )}

            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "low"}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out z-10 relative ${isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-2xl scale-110"
                    }`}
            />
        </div>
    )
}

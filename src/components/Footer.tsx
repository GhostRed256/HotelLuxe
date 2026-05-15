import { Camera, Phone, MapPin, Mail, Globe, ArrowUpRight } from "lucide-react"
import Logo from "./Logo"
 
 export default function Footer() {
   return (
     <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] pt-32 pb-12 border-t border-[var(--border-color)] relative overflow-hidden jaapi-motif">
       {/* Decorative top gradient */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent" />
       
       <div className="max-w-7xl mx-auto px-8 relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
           
           {/* Brand Column */}
           <div className="lg:col-span-2">
             <div className="flex items-center gap-6 mb-8">
               <Logo className="h-20" />
               <h2 className="text-6xl md:text-7xl font-script text-[var(--accent-primary)] leading-none">
                 StayNjoy
               </h2>
             </div>
             <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--gold-primary)] mb-8">
               H O S P I T A L I T Y • T H A T • F E E L S • L I K E • H O M E
             </p>
             <p className="opacity-60 font-light text-lg max-w-md leading-relaxed mb-10 italic">
               "Blending Upper Assam's warm heritage with palatial modern luxury. A sanctuary for the soul in Tinsukia."
             </p>
             <div className="flex gap-6">
               <a 
                 href="https://www.instagram.com/stayn_joy_tinsukia" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-500"
               >
                 <Camera size={20} />
               </a>
               <a 
                 href="mailto:contact@staynjoy.com" 
                 className="w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-500"
               >
                 <Mail size={20} />
               </a>
             </div>
           </div>
 
           {/* Locations Column */}
           <div>
             <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-8">Our Sanctuaries</h4>
             <ul className="flex flex-col gap-6">
               {[
                 { name: "Chaliha Nagar", desc: "Main Branch" },
                 { name: "Bordoloi Nagar", desc: "Lake View" },
                 { name: "Bordoloi Nagar", desc: "Income Tax" }
               ].map((loc, i) => (
                 <li key={i} className="group cursor-default">
                   <div className="flex items-start gap-4">
                     <MapPin size={18} className="mt-1 text-[var(--accent-primary)] opacity-40 group-hover:opacity-100 transition-opacity" />
                     <div>
                       <span className="block font-bold text-sm tracking-tight">{loc.name}</span>
                       <span className="block text-[10px] font-light opacity-40 uppercase tracking-widest">{loc.desc}</span>
                     </div>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
 
           {/* Quick Contact Column */}
           <div>
             <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-8">Reservations</h4>
             <div className="flex flex-col gap-10">
               <div className="group">
                 <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] mb-2">Speak With Us</span>
                 <a href="tel:7002475079" className="text-2xl font-black tracking-tighter hover:text-[var(--accent-primary)] transition-colors">
                   +91 70024 75079
                 </a>
               </div>
               
               <div className="p-6 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-colors group">
                 <p className="text-[10px] font-light opacity-60 leading-relaxed mb-4">
                   Need a custom arrangement? Our concierge is ready to assist.
                 </p>
                 <a href="tel:7002475079" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] group-hover:gap-4 transition-all">
                   Request Concierge <ArrowUpRight size={14} />
                 </a>
               </div>
             </div>
           </div>
 
         </div>
 
         {/* Bottom Bar */}
         <div className="pt-12 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
             <span>© 2026 StayNjoy Palace</span>
             <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]/20" />
             <span>Tinsukia, Assam</span>
             <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]/20" />
             <span className="text-[var(--accent-primary)]">আপোনালৈ স্বাগতম</span>
           </div>
           
           <div className="flex gap-10 text-[10px] font-bold tracking-[0.2em] uppercase">
             <a href="#" className="opacity-40 hover:text-[var(--accent-primary)] transition-colors">Privacy</a>
             <a href="#" className="opacity-40 hover:text-[var(--accent-primary)] transition-colors">Terms</a>
             <a href="/login" className="opacity-40 hover:text-[var(--accent-primary)] transition-colors">Staff Login</a>
           </div>
         </div>
       </div>
     </footer>
   )
 }

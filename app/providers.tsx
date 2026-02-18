"use client"

import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"
import {
  Plus_Jakarta_Sans,
  Inter,
  Poppins,
  Outfit,
  DM_Sans,
  Urbanist,
  Manrope,
  Work_Sans,
  Space_Grotesk,
  Nunito
} from "next/font/google"
import { useEffect, useState } from "react"

// --- FONT OPTIONS (Uncomment the one you want to use) ---

// 1. Plus Jakarta Sans (Current: Modern, Geometric, Tech-focused)

// const font = Plus_Jakarta_Sans({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })


// 2. Outfit (Clean, Stylish, Premium feel - Highly Recommended)
const font = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

// 3. Inter (The industry standard: Neutral, Professional, very readable)

// const font = Inter({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })


// 4. Poppins (Friendly, Rounded, Characterful - Good for headers)

// const font = Poppins({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })


// 5. DM Sans (Humanist, Approachable, Simple)

// const font = DM_Sans({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
//   display: "swap",
// })

// 6. Urbanist (Modern, Geometric, High-contrast)
// const font = Urbanist({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })

// 7. Manrope (Modern, Clean, Great for data/numbers)
// const font = Manrope({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })

// 8. Work Sans (Grotesque, optimized for screens, very clear)
// const font = Work_Sans({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })

// 9. Space Grotesk (Tech-heavy, quirky, distinctive)
// const font = Space_Grotesk({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })

// 10. Nunito (Rounded, very friendly and soft)
// const font = Nunito({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// })

// --- BODY FONT ---
// const bodyFont = Inter({
//   subsets: ["latin"],
//   display: "swap",
// })

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}
function getCookie(name: string) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1]
}

function CookieBanner() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && !getCookie('cookie_consent')) {
      setShow(true)
    }
  }, [])
  if (!show) return null
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-700">
        We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. See our{' '}
        <button
          className="underline text-primary bg-transparent border-none p-0 m-0 cursor-pointer"
          onClick={() => { setShow(false); window.location.href = "/privacy-policy"; }}
        >Privacy Policy</button> and{' '}
        <button
          className="underline text-primary bg-transparent border-none p-0 m-0 cursor-pointer"
          onClick={() => { setShow(false); window.location.href = "/cookie-policy"; }}
        >Cookie Policy</button>.
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 text-sm"
          onClick={() => { setCookie('cookie_consent', 'accepted'); setShow(false); }}
        >Accept All</button>
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
          onClick={() => { setCookie('cookie_consent', 'rejected'); setShow(false); }}
        >Reject All
        </button>
        {/* <button
          className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm border border-gray-300"
          onClick={() => { setCookie('cookie_consent', 'settings'); setShow(false); }}
        >Cookie Settings</button> */}
      </div>
    </div>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className={font.className}>
      {children}
      <Toaster />
      <CookieBanner />
    </div>
  )
}

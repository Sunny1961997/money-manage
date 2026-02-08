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
const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
})


export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className={font.className}>
      <style jsx global>{`
        p, ul, ol, blockquote, input, textarea, select, td {
          font-family: ${bodyFont.style.fontFamily}, sans-serif;
        }
      `}</style>
      {children}
      <Toaster />
    </div>
  )
}
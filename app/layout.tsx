import { Providers } from './providers'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: 'AML Meter Screening Tool',
  description: 'AML Meter Screening Tool',
  icons: {
    icon: '/aml_meter.png',
    shortcut: '/aml_meter.png',
    apple: '/aml_meter.png',
  },
}

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

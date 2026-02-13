"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function BookCallPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const hasOpenedRef = useRef(false)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Open popup after scroll progress or dwell time
  useEffect(() => {
    const minDelayMs = 15000
    const maxDelayMs = 30000
    const delayMs = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs
    const minScroll = 0.4
    const maxScroll = 0.6
    const scrollTrigger = minScroll + Math.random() * (maxScroll - minScroll)

    const clearOpenTimer = () => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current)
        openTimerRef.current = null
      }
    }

    const openPopup = () => {
      if (hasOpenedRef.current) return
      hasOpenedRef.current = true
      setIsOpen(true)
      clearOpenTimer()
      window.removeEventListener("scroll", handleScroll)
    }

    const handleScroll = () => {
      if (hasOpenedRef.current) return
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const progress = window.scrollY / scrollHeight
      if (progress >= scrollTrigger) {
        openPopup()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    openTimerRef.current = setTimeout(openPopup, delayMs)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearOpenTimer()
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        company_name: null, // Optional field
        contact_type: 'Book a Strategic Call',
        is_seen: false
      }

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit request')
      }

      toast({
        title: "Request Received",
        description: "We will contact you shortly to schedule your strategic call.",
        variant: "default",
        className: "bg-green-600 text-white border-none"
      })
      
      // Close popup on success with a small delay to ensure toast renders
      setTimeout(() => {
        setIsOpen(false)
      }, 1000)
      
    } catch (error: any) {
      console.error("Popup Error:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.6)] backdrop-blur-xl animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-5 top-5 z-10 rounded-full border border-slate-200/60 bg-white/80 p-2 text-slate-500 shadow-sm transition-all hover:text-slate-900 hover:shadow-md"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.05fr,1.4fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-indigo-900 px-8 py-10 text-white md:block">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,transparent)]" />
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
            <div className="relative space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold leading-tight">Book a Strategic Call</h2>
                <p className="mt-2 text-sm text-white/80">
                  Schedule a free consultation with our compliance experts.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-7 sm:py-7">
            <div className="mb-4 space-y-1.5 text-center md:hidden">
              <h2 className="text-2xl font-extrabold text-slate-900">Book a Strategic Call</h2>
              <p className="text-sm text-slate-500 text-center">
                Schedule a free consultation with our compliance experts.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-[0.12em]">First Name *</label>
                  <input
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-[0.12em]">Last Name *</label>
                  <input
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-[0.12em]">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="example@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-[0.12em]">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-[0.12em]">Message</label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none"
                  placeholder="I'm interested in..."
                />
              </div>

              <div className="pt-0.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Submitting...' : 'Request Call Now'}
                </button>
              </div>
              
              <p className="text-center text-xs text-slate-500">
                We respect your privacy. No spam.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

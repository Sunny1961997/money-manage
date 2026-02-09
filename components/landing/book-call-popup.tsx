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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-primary/5 flex flex-col items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Book a Strategic Call</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Schedule a free consultation with our compliance experts.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">First Name *</label>
                <input
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Last Name *</label>
                <input
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="example@company.com"
                />
              </div>
              <div>
                 <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  // placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Message</label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="I'm interested in..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {loading ? 'Submitting...' : 'Request Call Now'}
              </button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground mt-2">
              We respect your privacy. No spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

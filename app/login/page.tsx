"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store"
import { login } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { motion, type Variants } from "framer-motion"

// Background images array - supports WebP, JPG, PNG, etc.
const BACKGROUND_IMAGES = [
  // "/login-bg.png",
  "/login-bg-2.webp",
  "/login-bg-3.webp",
  // "/login-bg-4.jpg",
  // "/login-bg-5.jpg",
]

// Fallback JPG versions if WebP fails
const FALLBACK_IMAGES = [
  "/login-bg.jpg"
]

// Fallback gradient colors
const FALLBACK_GRADIENTS = [
  "from-indigo-900 via-indigo-800 to-indigo-900",
  "from-slate-900 via-slate-800 to-slate-900",
  "from-violet-900 via-violet-800 to-violet-900",
  "from-purple-900 via-purple-800 to-purple-900",
  "from-blue-900 via-blue-800 to-blue-900",
]

const PAGE_CLASS =
  "relative grid min-h-screen place-items-center overflow-hidden px-4 py-6 sm:px-6 lg:px-8"
const CARD_STYLE =
  "relative mx-auto w-full max-w-sm rounded-[2.5rem] border border-slate-200 bg-white/95 backdrop-blur-sm p-7 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.18)] sm:p-8"
const FIELD_LABEL_CLASS = "ml-1 text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-950/80"
const FIELD_CLASS =
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-indigo-950 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-indigo-300 focus-visible:border-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500/20"

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const formVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Background slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(BACKGROUND_IMAGES)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Preload and test images - try WebP first, fallback to JPG
  useEffect(() => {
    const testAndLoadImages = async () => {
      const results: boolean[] = []
      const finalUrls: string[] = []

      for (let i = 0; i < BACKGROUND_IMAGES.length; i++) {
        const webpUrl = BACKGROUND_IMAGES[i]
        const fallbackUrl = FALLBACK_IMAGES[i] || BACKGROUND_IMAGES[i]
        
        const isWebPAvailable = await testImageUrl(webpUrl)
        
        if (isWebPAvailable) {
          results.push(true)
          finalUrls.push(webpUrl)
        } else {
          // Try fallback JPG
          const isJpgAvailable = await testImageUrl(fallbackUrl)
          if (isJpgAvailable) {
            results.push(true)
            finalUrls.push(fallbackUrl)
          } else {
            results.push(false)
            finalUrls.push(webpUrl) // Keep original, will use gradient fallback
          }
        }
      }
      
      setImagesLoaded(results)
      setImageUrls(finalUrls)
    }

    testAndLoadImages()
  }, [])

  // Helper function to test if an image URL loads successfully
  const testImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false)
        return
      }
      
      const img = new window.Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
      
      // Timeout for slow loading images
      setTimeout(() => resolve(false), 5000)
    })
  }

  // Auto-slide background images every 5 seconds
  useEffect(() => {
    if (BACKGROUND_IMAGES.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100)
      }, 50)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currentImage = imageUrls[currentImageIndex]
  const imageLoaded = imagesLoaded[currentImageIndex]
  const fallbackGradient = FALLBACK_GRADIENTS[currentImageIndex % FALLBACK_GRADIENTS.length]

  const handleOpenForgot = () => {
    setShowForgot(true)
  }

  const handleCloseForgot = () => {
    setShowForgot(false)
    setForgotEmail("")
    setForgotLoading(false)
  }

  const handleBack = () => {
    const referrer = document.referrer
    const sameOrigin = referrer.startsWith(window.location.origin)
    if (sameOrigin && window.history.length > 1) {
      router.back()
      return
    }
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await login(email, password)

      if (data && data.user) {
        setUser(data.user)
        toast({
          title: "Success",
          description: "Login successful!",
        })

        const userRole = data.user.role?.toLowerCase().trim()
        if (userRole === "admin") {
          router.push("/dashboard/admin")
        } else if (userRole === "company admin") {
          router.push("/dashboard/profile")
        } else {
          router.push("/dashboard/profile")
        }
        router.refresh()
      } else {
        const errorMsg = data?.message || "Login failed: No user data returned"
        setError(errorMsg)
        toast({
          title: "Login Failed",
          description: errorMsg,
        })
      }
    } catch (error: any) {
      const errorMsg = error?.message || "An error occurred during login"
      setError(errorMsg)
      toast({
        title: "Login Failed",
        description: errorMsg,
      })
      console.error("An error occurred during login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (res.ok && data.status) {
        toast({
          title: "Success",
          description: data.message || "Password reset instructions sent to your email.",
        })
        handleCloseForgot()
      } else {
        toast({
          title: "Error",
          description: data.message || data.error || "Failed to send reset instructions.",
        })
      }
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        toast({
          title: "Connection Error",
          description: "Unable to send request. Please check your internet connection.",
        })
      } else {
        toast({
          title: "Error",
          description: "Unable to send request. Please try again later.",
        })
      }
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className={PAGE_CLASS}>
      {/* Background Image Slider */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {imageLoaded ? (
            <>
              {/* Try WebP with picture element for better browser support */}
              <picture className="absolute inset-0">
                <source srcSet={currentImage} type="image/webp" />
                <source srcSet={currentImage.replace('.webp', '.jpg')} type="image/jpeg" />
                <img
                  src={currentImage}
                  alt="Background"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    // If WebP fails, try JPG
                    const target = e.target as HTMLImageElement
                    const jpgUrl = currentImage.replace('.webp', '.jpg')
                    if (target.src !== jpgUrl) {
                      target.src = jpgUrl
                    }
                  }}
                />
              </picture>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(49,46,129,0.44)_0%,rgba(67,56,202,0.14)_48%,rgba(129,140,248,0.04)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.12)_58%,rgba(15,23,42,0.28)_100%)]" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`}>
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
        </div>

        {/* Image counter/dots indicator - only if multiple images */}
        {BACKGROUND_IMAGES.length > 1 && (
          <>
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {BACKGROUND_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true)
                    setTimeout(() => {
                      setCurrentImageIndex(index)
                      setTimeout(() => {
                        setIsTransitioning(false)
                      }, 100)
                    }, 50)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentImageIndex === index
                      ? "w-6 bg-white/80"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute bottom-6 right-6 z-10 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
              {currentImageIndex + 1} / {BACKGROUND_IMAGES.length}
            </div>
          </>
        )}
      </div>

      <motion.div 
        className="relative z-10 mx-auto w-full max-w-sm"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className={CARD_STYLE}>
          <div className="absolute left-5 top-5">
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 rounded-full border border-slate-200 bg-white p-0 text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-950 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              onClick={handleBack}
              title="Return to home"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="space-y-5 p-0">
            <motion.div variants={itemVariants} className="space-y-3 text-center">
              <div className="flex items-center justify-center">
                <div className="relative group p-1.5">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                  <img 
                    src="/aml_meter_2.png" 
                    alt="AML Meter" 
                    className="relative h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-indigo-950">
                  {showForgot ? "Reset Password" : "Client Login"}
                </h1>
                <p className="mx-auto max-w-[240px] text-[13px] font-medium leading-relaxed text-indigo-900/70 antialiased">
                  {showForgot ? "Enter your email to receive a password reset link." : "Access your secure UAE compliance screening workspace."}
                </p>
              </div>
            </motion.div>

            {!showForgot ? (
              <motion.form
                key="login-form"
                initial="hidden"
                animate="visible"
                variants={formVariants}
                onSubmit={handleSubmit}
                className="space-y-3.5"
              >
                <div className="space-y-2">
                  <RequiredLabel htmlFor="email" text="Email" className={FIELD_LABEL_CLASS} />
                  <Input
                    id="email"
                    type="text"
                    placeholder="name@firm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <RequiredLabel htmlFor="password" text="Password" className={FIELD_LABEL_CLASS} />
                    <button 
                      type="button" 
                      onClick={handleOpenForgot}
                      className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 underline decoration-indigo-300 underline-offset-4 transition-colors hover:text-indigo-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`${FIELD_CLASS} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="animate-in fade-in slide-in-from-top-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                    {error}
                  </div>
                ) : null}

                <div className="pt-1">
                  <Button type="submit" className="h-12 w-full rounded-full bg-gradient-to-r from-indigo-700 to-violet-700 font-bold text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.35)] transition-all hover:scale-[1.01] hover:from-indigo-800 hover:to-violet-800 hover:shadow-[0_25px_50px_-10px_rgba(79,70,229,0.45)] focus-visible:ring-2 focus-visible:ring-indigo-500/30 active:scale-[0.99]" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        Connecting...
                      </div>
                    ) : <span className="text-[15px] tracking-tight">Enter Compliance Portal</span>}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="forgot-form"
                initial="hidden"
                animate="visible"
                variants={formVariants}
                onSubmit={handleForgotSubmit}
                className="space-y-3.5"
              >
                <div className="space-y-2">
                  <RequiredLabel htmlFor="forgot-email" text="Email" className={FIELD_LABEL_CLASS} />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="name@firm.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 rounded-full border border-slate-200 bg-white font-bold text-indigo-800 transition-colors hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-950 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                    onClick={handleCloseForgot}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-[2] rounded-full bg-indigo-700 font-bold text-white shadow-lg transition-colors hover:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </motion.form>
            )}

            <motion.div variants={itemVariants} className="pt-1">
              <p className="mx-auto max-w-[200px] text-center text-[10px] font-bold uppercase tracking-[0.15em] leading-relaxed text-indigo-900/60 antialiased">
                Welcome back. Manage your AML, screening, and compliance risk in one platform
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
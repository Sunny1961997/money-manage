"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, Rocket, Timer, Construction, Sparkles } from "lucide-react"

interface ComingSoonProps {
    title: string
    description: string
    icon?: LucideIcon
    statusText?: string
}

const CARD_STYLE =
    "rounded-3xl border-border/50 bg-card/60 backdrop-blur-sm shadow-[0_22px_60px_-32px_oklch(0.28_0.06_260/0.45)] transition-all hover:shadow-[0_30px_70px_-32px_oklch(0.28_0.06_260/0.6)]"
const SECONDARY_LABEL_CLASS = "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"

export function ComingSoon({ title, description, icon: Icon = Sparkles, statusText = "System Integration in Progress..." }: ComingSoonProps) {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in-95 duration-500 font-heading">
            <Card className={`${CARD_STYLE} max-w-none w-full border-dashed border-2 relative overflow-hidden my-2`}>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

                <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-8 relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 relative z-10 transition-all group-hover:scale-110 duration-500 shadow-2xl">
                            <Icon size={32} strokeWidth={1} className="animate-float" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Service Coming Soon</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Niche Animated Visual: Intelligence Gathering */}
                    <div className="relative h-32 w-full flex items-center justify-center overflow-hidden py-4">
                        <svg width="200" height="80" viewBox="0 0 200 80" className="opacity-80">
                            {/* Connection Lines */}
                            <line x1="40" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-primary/30 dash-animate" strokeDasharray="4 4" />
                            <line x1="160" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-primary/30 dash-animate-rev" strokeDasharray="4 4" />
                            <line x1="100" y1="10" x2="100" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-primary/30 dash-animate" strokeDasharray="4 4" />

                            {/* Pulsing Nodes */}
                            <circle cx="40" cy="40" r="4" className="fill-primary animate-ping opacity-40" />
                            <circle cx="40" cy="40" r="4" className="fill-primary" />

                            <circle cx="160" cy="40" r="4" className="fill-primary animate-ping opacity-40" style={{ animationDelay: '1s' }} />
                            <circle cx="160" cy="40" r="4" className="fill-primary" />

                            <circle cx="100" cy="10" r="3" className="fill-primary/60" />
                            <circle cx="100" cy="70" r="3" className="fill-primary/60" />

                            {/* Central Hub */}
                            <g className="animate-float">
                                <rect x="85" y="25" width="30" height="30" rx="6" className="fill-card stroke-primary/30" strokeWidth="1" />
                                <circle cx="100" cy="40" r="6" className="fill-primary animate-pulse" />
                            </g>
                        </svg>
                    </div>

                    <div className="pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70 animate-pulse">
                            {statusText}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <style jsx global>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dash-animate {
          animation: dash 3s linear infinite;
        }
        .dash-animate-rev {
          animation: dash 3s linear infinite reverse;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    )
}

'use client';

import { Shield, Search, BarChart3, Brain, FileCheck, UserCheck, Workflow, Plug, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const specialties = [
  {
    icon: Shield,
    title: 'Real-Time Transaction Monitoring',
    description: 'Detect and respond to suspicious activities as they occur with advanced monitoring systems that reduce financial crime risks.'
  },
  {
    icon: Search,
    title: 'Customer & Entity Screening',
    description: 'Comprehensive checks against watchlists, sanctions lists, PEPs, and adverse media to identify high-risk individuals and organizations.'
  },
  {
    icon: BarChart3,
    title: 'Risk Assessment & Scoring',
    description: 'Dynamic customer and transaction risk profiling with comprehensive tools to prioritize compliance efforts in high-risk areas.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Detection',
    description: 'Machine learning algorithms that minimize false positives and adapt to new financial crime typologies for enhanced accuracy.'
  },
  {
    icon: Workflow,
    title: 'Case Management & Workflow',
    description: 'Automated alert triage, investigation workflows, and centralized reporting to streamline compliance operations.'
  },
  {
    icon: UserCheck,
    title: 'KYC & Customer Due Diligence',
    description: 'Identity verification and continuous customer monitoring throughout their lifecycle with perpetual KYC capabilities.'
  },
  {
    icon: FileCheck,
    title: 'Regulatory Reporting',
    description: 'Automated generation of Suspicious Activity Reports (SARs) and compliance documentation to ensure regulatory adherence.'
  },
  {
    icon: Plug,
    title: 'Seamless Integration',
    description: 'API-driven architecture for effortless integration with existing banking systems and compliance tools for a holistic approach.'
  },
];

export function Specialties() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="relative py-16 sm:py-20 bg-gradient-to-br from-primary via-primary/95 to-indigo-950 scroll-mt-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/8 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-400/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
        }} />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        />

        <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/5 to-indigo-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight text-balance mb-4 leading-tight"
          >
            Our Features
          </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.2 }}
              className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed text-justify"
            >
              Cutting-edge technology and intelligent automation to protect your organization from financial crime while ensuring regulatory compliance.
            </motion.p>
        </div>

        <div className="mt-10 sm:mt-14">
          <div className="rounded-[2.5rem] border border-white/10 bg-transparent overflow-hidden">
            <div className="grid md:grid-cols-2 gap-px bg-white/8">
              {specialties.map((specialty, index) => {
                const Icon = specialty.icon;
                const isHovered = hoveredIndex === index;
                return (
                  <motion.div
                    key={specialty.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative border border-white/10 p-6 sm:p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_40px_-32px_rgba(0,0,0,0.8)]"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          className="w-10 h-10 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center"
                          animate={{ scale: isHovered ? 1.05 : 1 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 260 }}
                        >
                          <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                        </motion.div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">{specialty.title}</h3>
                        <ChevronRight className="ml-auto w-4 h-4 text-white/50 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                      <p className="text-sm sm:text-base text-white/75 leading-relaxed text-justify">
                        {specialty.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

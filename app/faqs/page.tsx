"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { FAQAccordion } from "@/components/faq/faq-accordion"
import { FAQ_ITEMS } from "@/data/faqs"

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header mode="solid" />
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-[#f4efff] via-[#efe7ff] to-[#f8f5ff]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-32 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.05 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance mb-4 text-slate-900"
            >
              AML Meter <span className="text-[#5b2bd8]">FAQs</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-center"
            >
              Clear answers for UAE DNFBPs and regulated entities adopting a risk-based compliance approach.
            </motion.p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-transparent shadow-[0_20px_50px_-35px_rgba(76,29,149,0.4)] overflow-hidden">
            <section className="relative p-6 sm:p-10 bg-transparent">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 via-white/30 to-transparent" />
              <FAQAccordion
                items={FAQ_ITEMS}
                defaultOpenId={FAQ_ITEMS[0]?.id ?? null}
                autoCloseOnRowLeave
              />

              <div className="mt-8 flex items-center justify-center text-center text-sm text-slate-500">
                Need more details? Contact our compliance team for tailored guidance.
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

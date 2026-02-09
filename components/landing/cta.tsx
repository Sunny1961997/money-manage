"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export function CTA() {
  return (
    <section className="py-12 sm:py-20 px-4 bg-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        className="max-w-7xl mx-auto relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden group shadow-2xl shadow-primary/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary via-60% to-indigo-950" />

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"
        />

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

        <div className="relative z-10 py-12 px-6 sm:py-20 sm:px-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-sm font-medium text-purple-100 mb-6"
          >
            Regulatory Compliance Ready
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
            className="text-4xl sm:text-6xl font-black mb-6 text-white tracking-tight leading-[1.05] max-w-4xl"
          >
            Advanced AML <br className="hidden sm:block" />
            <span className="text-purple-200">Screening Tool</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-purple-50 text-base sm:text-xl mb-10 max-w-3xl leading-relaxed font-medium text-balance"
          >
            Our comprehensive AML compliance solution provides real-time screening against global sanctions databases,
            ensuring your business regulators for highest standards of compliance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Button
              asChild
              variant="secondary"
              className="bg-white text-primary px-10 py-7 rounded-full font-bold text-lg shadow-[0_10px_20px_-5px_rgba(255,255,255,0.4)] hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 h-auto"
            >
              <Link href="/login">
                Get Started Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-white/40 text-white px-10 py-7 rounded-full font-bold text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/60 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 h-auto"
            >
              <Link href="/contact-us">
                Talk to Sales
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

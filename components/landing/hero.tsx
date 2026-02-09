"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary via-primary/95 to-primary/80 text-white pt-32 pb-20 sm:pt-40 sm:pb-24"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary/80" />
        <div
          className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] opacity-40 animate-pulse transform-gpu"
          style={{
            background: "linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%)",
            filter: "blur(60px)",
            transform: "rotate(-15deg)"
          }}
        />

        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen translate-x-1/2 -translate-y-1/2 transform-gpu" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen -translate-x-1/3 translate-y-1/3 transform-gpu" />

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-6">
          {/* <span className="text-3xl font-bold">AML</span> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm"
          >
            <span className="font-medium">AML Compliance Made Easy for DNFBPs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.02] tracking-[-0.025em]"
          >
            AML Compliance,{" "}
            <span className="bg-gradient-to-r from-white via-slate-300 via-50% to-white bg-[length:200%_auto] animate-shine bg-clip-text text-transparent">
              Simplified
            </span>{" "}
            for UAE-Regulated Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            AML Meter is an all-in-one customer onboarding, screening, and adverse media monitoring platform built
            for UAE-regulated firms. Specially designed with <span className="text-white font-semibold">DNFBPs</span>
            in mind, which helps institutions adopt a risk-based approach, document every decision, and stay audit-ready,
            without overcomplicating compliance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4"
          >
            <Link
              href="/contact-us"
              className="bg-[#ffffff] text-primary px-8 py-3 rounded-full font-semibold shadow-lg shadow-black/20 hover:bg-[#f3f4f6] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition duration-300 backface-hidden transform-gpu"
            >
              Request a Demo
            </Link>

            <Link
              href="/products"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-[#ffffff] hover:text-primary hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition duration-300 backface-hidden transform-gpu"
            >
              Get Started Now
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            style={{ y, opacity, scale }}
            className="relative mt-12 w-full max-w-5xl mx-auto perspective-1000 will-change-transform transform-gpu"
          >
            <div
              className="absolute -inset-8 bg-gradient-to-r from-primary/40 to-indigo-600/40 rounded-xl blur-3xl opacity-100 -z-10 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px] z-20" />

            <div className="relative rounded-xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden aspect-[16/9] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="/AML Dashboard Screen 2.png"
                alt="AML Compliance Dashboard"
                // className="h-20 w-auto object-contain" 
                fill
                className="object-cover object-top hover:scale-[1.02] transition-transform duration-700"
                priority
              />
            </div>
          </motion.div>

          {/* <p className="text-sm text-white/70 mt-6">Currently on 3.2.1 patch 4</p> */}
        </div>
      </div>
    </section>
  );
}

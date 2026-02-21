"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const previewImages = ["/aml-meter-dashboard-stats.png", "/aml-meter-stats.png"];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [activePreview, setActivePreview] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setActivePreview((current) => (current + 1) % previewImages.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative z-10 min-h-[90vh] flex items-center justify-center overflow-hidden text-white pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-6">
          {/* <span className="text-3xl font-bold">AML</span> */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
            className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm"
          >
            <span className="font-medium">AML Compliance Made Easy for DNFBPs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.02] tracking-[-0.025em]"
          >
            AML Compliance,{" "}
            <span className="bg-gradient-to-r from-white via-slate-300 via-50% to-white bg-[length:200%_auto] animate-shine bg-clip-text text-transparent">
              Simplified
            </span>{" "}
            for UAE-Regulated Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const, delay: 0.2 }}
            className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed text-justify"
          >
            AML Meter is an all-in-one customer onboarding, screening, and adverse media monitoring platform built
            for UAE-regulated firms. Specially designed with <span className="text-white font-semibold">DNFBPs</span>{" "}
            in mind, helping institutions adopt a risk-based approach, document every decision, and stay audit-ready,
            without overcomplicating compliance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const, delay: 0.3 }}
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
            style={{ y, scale }}
            className="relative mt-12 w-full max-w-7xl mx-auto perspective-1000"
          >
            <div
              className="absolute -inset-8 bg-gradient-to-r from-primary/40 to-indigo-600/40 rounded-xl blur-3xl opacity-100 -z-10 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px] z-20" />

            <div className="relative rounded-xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden aspect-[16/9] group p-2 ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full rounded-lg overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePreview}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <Image
                      src={previewImages[activePreview]}
                      alt="AML Compliance Dashboard preview"
                      fill
                      sizes="(min-width: 1536px) 1280px, (min-width: 1280px) 1180px, (min-width: 1024px) 1024px, 100vw"
                      quality={95}
                      className="object-cover object-top"
                      priority={activePreview === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* <p className="text-sm text-white/70 mt-6">Currently on 3.2.1 patch 4</p> */}
        </div>
      </div>
    </section>
  );
}

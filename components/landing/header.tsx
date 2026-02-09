"use client";

import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User } from "lucide-react";

interface HeaderProps {
  showUnderline?: boolean;
}

export function Header({ showUnderline = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "services", "features", "news", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const label = id === "home" ? "Home" :
            id === "about" ? "About Us" :
              id === "services" ? "Services" :
                id === "features" ? "Features" :
                  id === "news" ? "Latest News" :
                    id === "contact" ? "Contact" : "Home";
          setActiveLink(label);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const isSolid = scrolled || mobileMenuOpen;
  const isTransparent = !isSolid;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
    { label: "Latest News", href: "#news" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 border-b py-4",
        isSolid
          ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/aml_meter_2.png"
              alt="AML Meter"
              className={cn(
                "h-10 md:h-12 w-auto object-contain transition-all duration-200",
                isTransparent ? "brightness-0 invert" : "brightness-100 invert-0"
              )}
            />
          </Link>
        </div>
        <nav className="hidden xl:flex gap-8 items-center h-full">
          {/* <a href="#themes" className="text-base font-semibold text-foreground hover:text-primary transition">Themes</a> */}
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-base font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap relative h-full flex items-center group",
                activeLink === item.label
                  ? (isSolid ? "text-primary" : "text-white")
                  : (isSolid ? "text-slate-600 hover:text-primary/80" : "text-white/60 hover:text-white")
              )}
            >
              {item.label}
              {showUnderline && activeLink === item.label && (
                <motion.div
                  layoutId="activeLinkUnderline"
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-[2px] rounded-full",
                    isSolid ? "bg-primary" : "bg-white"
                  )}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30
                  }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="flex-1 flex justify-end gap-3 md:gap-4 items-center">
          {/* <div className="w-10 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm"> */}
          <Link
            href="/login"
            className={cn(
              "hidden md:flex h-10 w-10 xl:w-auto xl:px-5 rounded-xl items-center justify-center font-bold text-sm transition-[color,background-color,border-color,transform] duration-150 active:scale-95 whitespace-nowrap border",
              mobileMenuOpen ? "md:hidden" : "",
              isSolid
                ? "border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 shadow-none"
                : "border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            )}
            title="Sign in"
          >
            <span className="hidden xl:inline text-inherit">Sign in</span>
            <User className="h-5 w-5 xl:hidden text-inherit" />
          </Link>
          <Link
            href="/contact-us"
            className={cn(
              "hidden sm:flex h-10 px-5 md:px-7 rounded-full items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg active:scale-95 whitespace-nowrap",
              mobileMenuOpen ? "sm:hidden" : "",
              isSolid
                ? "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20"
                : "bg-white text-primary hover:bg-slate-100 hover:shadow-white/20"
            )}
          >
            Request a Demo
          </Link>

          <button
            className={cn(
              "p-2 rounded-lg transition-[background-color,color] duration-150 cursor-pointer xl:hidden",
              isSolid ? "hover:bg-slate-100" : "hover:bg-white/10"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={cn("h-6 w-6 transition-colors duration-150", isSolid ? "text-purple-700" : "text-white")} />
            ) : (
              <Menu className={cn("h-6 w-6 transition-colors duration-150", isSolid ? "text-purple-700" : "text-white")} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="xl:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200/60 shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)]"
          >
            <div className="py-8 px-6 flex flex-col items-center gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="w-full max-w-[280px]"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-lg font-bold py-4 flex items-center justify-center group transition-colors relative",
                      activeLink === item.label ? "text-primary" : "text-slate-600 hover:text-primary/70"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                    {showUnderline && activeLink === item.label && (
                      <motion.div
                        layoutId="activeLinkUnderlineMobile"
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="flex flex-col items-center gap-4 mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/login"
                  className="w-full max-w-[280px] h-12 rounded-xl flex items-center justify-center font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98] border border-slate-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/contact-us"
                  className="w-full max-w-[280px] h-12 rounded-xl flex items-center justify-center font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Request a Demo
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  );
}

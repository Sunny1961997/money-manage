"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b py-4",
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-slate-200/60 shadow-sm supports-[backdrop-filter]:bg-white/60"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Link href="/">
            <img
              src="/aml_meter_2.png"
              alt="AML Meter"
              className={cn(
                "h-14 w-auto object-contain transition-all duration-300",
                scrolled ? "" : "brightness-0 invert"
              )}
            />
          </Link>
        </div>
        <nav className="hidden md:flex gap-5 items-center">
          {/* <a href="#themes" className="text-base font-semibold text-foreground hover:text-primary transition">Themes</a> */}
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "#about" },
            { label: "Solutions", href: "#products" },
            { label: "Features", href: "#features" },
            { label: "Specialties", href: "#specialties" },
            { label: "FAQ", href: "#" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-base font-semibold transition-all duration-200 hover:scale-105",
                scrolled ? "text-indigo-950 hover:text-purple-600" : "text-white/90 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 flex justify-end gap-4 items-center">
          {/* <div className="w-10 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm"> */}
          <Link
            href="/login"
            className={cn(
              "hidden sm:flex h-10 px-4 rounded-md items-center justify-center font-bold text-sm transition-all",
              scrolled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            )}
          >
            Sign in
          </Link>
          <Link
            href="/contact-us"
            className={cn(
              "hidden sm:flex h-10 px-6 rounded-full items-center justify-center font-semibold text-sm transition-all shadow-lg",
              scrolled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-purple-600 hover:bg-slate-100"
            )}
          >
            Request a Demo
          </Link>

          <button
            className="md:hidden p-2 text-current"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={cn("h-6 w-6", scrolled ? "text-foreground" : "text-white")} />
            ) : (
              <Menu className={cn("h-6 w-6", scrolled ? "text-foreground" : "text-white")} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-muted shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "#about" },
            { label: "Solutions", href: "#products" },
            { label: "Features", href: "#features" },
            { label: "Specialties", href: "#specialties" },
            { label: "FAQ", href: "#" },
            { label: "Latest News", href: "#contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-lg font-medium text-foreground py-2 border-b border-gray-100 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <Link
              href="/login"
              className="w-full h-10 rounded-md flex items-center justify-center font-bold text-sm bg-gray-100 text-foreground hover:bg-gray-200 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/contact-us"
              className="w-full h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Request a Demo
            </Link>
          </div>
        </div>
      )}
    </header >
  );
}

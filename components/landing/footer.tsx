'use client';

import { Facebook, Linkedin, Youtube, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-primary via-primary/95 to-indigo-950 text-white py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-400/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">

          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/aml_meter_2.png"
                alt="AML Meter"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>

            <h3 className="text-white font-extrabold mb-3 text-xl tracking-tight">Simplifying Risk & Compliance</h3>
            <p className="text-white/70 text-[15px] mb-8 leading-relaxed max-w-sm">
              Protecting your organization from financial fraud and misconduct with cutting-edge AML solutions.
            </p>

            <div className="flex items-center gap-3 text-white/80 text-sm group hover:text-white transition-colors">
              <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                <Mail className="w-4 h-4" />
              </div>
              <a href="mailto:info@amlmeter.com" className="font-medium">
                info@amlmeter.com
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="lg:col-span-2">
            <p className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Useful Links</p>
            <ul className="space-y-3.5 text-[15px] text-white/70">
              <li><Link href="/#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Quick Link</Link></li>
              <li><Link href="/#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Blog</Link></li>
              <li><Link href="/#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Resources</Link></li>
              <li><Link href="/#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Insights</Link></li>
              <li><Link href="#contact" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Contact</Link></li>
              <li><Link href="/#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="lg:col-span-2">
            <p className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Legal</p>
            <ul className="space-y-3.5 text-[15px] text-white/70">
              <li><Link href="/legal/copyright" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Copyright</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Privacy Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Legal Disclaimer</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: Socials */}
          <div className="lg:col-span-4">
            <p className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Connect With Us</p>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Stay connected for updates on financial crime research, regulatory trends, and compliance best practices.
            </p>

            <div className="flex gap-3">
              <a href="https://www.linkedin.com/company/amlmeter/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-all duration-300 group">
                <Linkedin className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-6" />
              </a>
              <a href="#" className="w-11 h-11 bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-all duration-300 group">
                <Facebook className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-6" />
              </a>
              <a href="#" className="w-11 h-11 bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-all duration-300 group">
                <Youtube className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-6" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm font-medium">
              © 2026 AML Meter Inc. All rights reserved
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

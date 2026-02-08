'use client';

import { Facebook, Linkedin, Youtube, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary via-primary to-primary/85 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-800">

          {/* Column 1: Brand Info */}
          <div className="lg:w-1/3 pr-8 pb-8 lg:pb-0">
            <div className="flex items-center gap-2 mb-6">
              <img
                src="/aml_meter_2.png"
                alt="AML Meter"
                className="h-20 w-auto object-contain rounded bg-white p-1"
              />
            </div>

            <h3 className="text-white font-semibold mb-2">Simplifying Risk & Compliance</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Protecting your organization from financial fraud and misconduct.
            </p>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@amlmeter.com" className="hover:text-white transition">
                info@amlmeter.com
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="lg:w-1/6 px-8 py-8 lg:py-0">
            <h4 className="font-semibold text-white mb-6">Useful Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/#" className="hover:text-white transition">Quick Link</Link></li>
              <li><Link href="/#" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/#" className="hover:text-white transition">Resources</Link></li>
              <li><Link href="/#" className="hover:text-white transition">Insights</Link></li>
              <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/#" className="hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="lg:w-1/6 px-8 py-8 lg:py-0">
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/legal/copyright" className="hover:text-white transition">Copyright</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition">Legal Disclaimer</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition">Terms and Conditions</Link></li>
            </ul>
          </div>



          {/* Column 5: Socials */}
          <div className="lg:w-1/6 pl-8 pt-8 lg:pt-0">
            <h4 className="font-semibold text-white mb-4">Our Socials</h4>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              Stay connected for updates on financial crime research, regulatory trends, and compliance best practices.
            </p>

            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/amlmeter/posts/?feedView=all" target="_blank" className="w-10 h-10 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 group">
                <Linkedin className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 group">
                <Facebook className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 group">
                <Youtube className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

        </div>

      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          © 2026 AML Meter Inc. All rights reserved
        </p>
      </div>
    </footer>
  );
}
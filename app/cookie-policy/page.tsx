'use client'
import { motion } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header mode="solid" />
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-[#f4efff] via-[#efe7ff] to-[#f8f5ff]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-32 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance mb-4 text-slate-900"
            >
              Cookie Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Last Updated: February 17, 2026
            </motion.p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-10 text-slate-700 leading-relaxed">
            
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p>
                AML Meter ("we", "our", "us") respects your privacy. This Cookie Policy explains how we use cookies and similar tracking technologies on our website <a href="https://www.amlmeter.com" className="text-indigo-600 hover:underline">www.amlmeter.com</a> (the "Website"). 
                This policy is part of our broader <Link href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link>. 
                If you are located in the EEA, UK, or Switzerland, we only use non-essential cookies with your consent.
              </p>
            </section>

            {/* 2. What Are Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. What Are Cookies?</h2>
              <p>
                Cookies are small text files placed on your device when you visit a website. They make websites work efficiently and provide information to owners. 
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Session cookies:</strong> Temporary and deleted when you close your browser.</li>
                <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until deleted.</li>
              </ul>
            </section>

            {/* 3. Types of Cookies We Use */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Types of Cookies We Use</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 mb-2">3.1 Essential Cookies</h3>
                  <p className="text-sm">Necessary for core features like security and accessibility. <strong>Consent: Not required.</strong></p>
                </div>
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 mb-2">3.2 Analytics Cookies</h3>
                  <p className="text-sm">Help us understand visitor interaction (Google Analytics, Microsoft Clarity). <strong>Consent: Required.</strong> </p>
                </div>
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 mb-2">3.3 Marketing Cookies</h3>
                  <p className="text-sm">Track browsing habits for relevant ads (Meta, LinkedIn, Google Ads). <strong>Consent: Required.</strong></p>
                </div>
                <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                  <h3 className="font-bold text-slate-900 mb-2">3.4 Functional Cookies</h3>
                  <p className="text-sm">Remember preferences like region or language. <strong>Consent: Required.</strong></p>
                </div>
              </div>
            </section>

            {/* 4. Detailed Cookie List */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Detailed Cookie List</h2>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 font-semibold">Cookie Name</th>
                      <th className="p-3 font-semibold">Provider</th>
                      <th className="p-3 font-semibold">Purpose</th>
                      <th className="p-3 font-semibold">Duration</th>
                      <th className="p-3 font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="p-3">PHPSESSID</td><td className="p-3">AML Meter</td><td className="p-3">Session management</td><td className="p-3">Session</td><td className="p-3">Essential</td></tr>
                    <tr><td className="p-3">cookie_consent</td><td className="p-3">AML Meter</td><td className="p-3">Stores preferences</td><td className="p-3">1 year</td><td className="p-3">Essential</td></tr>
                    <tr><td className="p-3">_ga</td><td className="p-3">Google Analytics</td><td className="p-3">Distinguishes unique users</td><td className="p-3">2 years</td><td className="p-3">Analytics</td></tr>
                    <tr><td className="p-3">_clck</td><td className="p-3">Microsoft Clarity</td><td className="p-3">Persists Clarity User ID</td><td className="p-3">1 year</td><td className="p-3">Analytics</td></tr>
                    <tr><td className="p-3">_fbp</td><td className="p-3">Meta (Facebook)</td><td className="p-3">Ad delivery</td><td className="p-3">3 months</td><td className="p-3">Marketing</td></tr>
                    <tr><td className="p-3">IDE</td><td className="p-3">Google Ads</td><td className="p-3">Ad targeting</td><td className="p-3">1 year</td><td className="p-3">Marketing</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2 italic"></p>
            </section>

            {/* 5. How We Obtain Consent */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. How We Obtain Your Consent</h2>
              <p>
                Upon your first visit, you can <strong>Accept All</strong>, <strong>Decline</strong> (essential only), or <strong>Customize</strong>. 
                Your consent is stored for <strong>6 months</strong>. You can change settings via the "Cookie Settings" link in the footer.
              </p>
            </section>

            {/* 6. Browser Settings */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Managing Cookies via Browser Settings</h2>
              <p className="mb-4">You can control cookies through browser settings, including blocking specific third-party cookies.</p>
              <div className="flex flex-wrap gap-3">
                {['Google Chrome', 'Mozilla Firefox', 'Safari', 'Microsoft Edge'].map((browser) => (
                  <span key={browser} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200">
                    {browser} 
                  </span>
                ))}
              </div>
            </section>

            {/* 9. International Users */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Users</h2>
              <p>For users in the EEA, UK, or Switzerland:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Non-essential cookies require explicit consent.</li>
                <li>You have the right to withdraw consent at any time.</li>
                <li>Data transfers outside the EEA/UK are governed by our Privacy Policy.</li>
              </ul>
            </section>

            {/* 11. Contact Us */}
            <section className="pt-8 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
              <p>For questions or data protection enquiries (Subject: "Cookie Policy"): </p>
              <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="font-medium text-slate-900">Email: <a href="mailto:trustandsafety@amlmeter.com" className="text-indigo-600">contact@amlmeter.com</a> </p>
                <p className="text-slate-700">Address: AML Meter, United Arab Emirates </p>
              </div>
            </section>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
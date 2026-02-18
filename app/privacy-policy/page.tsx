'use client'
import { motion } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header mode="solid" />
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-[#f4efff] via-[#efe7ff] to-[#f8f5ff]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-32 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.05 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance mb-4 text-slate-900"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-center"
            >
              This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services.
            </motion.p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow p-8">
            <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal information you provide (name, email, company, etc.)</li>
              <li>Usage data and analytics (pages visited, actions taken)</li>
              <li>Cookies and similar technologies (see our Cookie Policy)</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and improve our services</li>
              <li>To communicate with you about your account or support requests</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>For analytics and marketing purposes</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">How We Protect Your Data</h2>
            <p className="mb-4">
              We use industry-standard security measures to protect your information. Access is restricted to authorized personnel only.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>You can request access to, correction, or deletion of your personal data.</li>
              <li>You can opt out of marketing communications at any time.</li>
              <li>Contact us for any privacy-related concerns.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page.
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
            <p>If you have questions about our privacy practices, please contact us at <a href="mailto:trustandsafety@amlmeter.com" className="underline text-primary">trustandsafety@amlmeter.com</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

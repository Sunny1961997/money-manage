'use client'
import { motion } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export default function TermsAndConditionsPage() {
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
              Terms & Conditions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Please read these terms carefully before using the AML Meter platform.
            </motion.p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-10 text-slate-700 leading-relaxed">
            
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p>
                These Terms and Conditions govern access to and use of the AML Meter platform. 
                By subscribing to or using AML Meter, the Client agrees to be legally bound by these Terms. 
                AML Meter is a compliance technology provider incorporated in the United Arab Emirates and Bangladesh.
              </p>
            </section>

            {/* 2. Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Key Definitions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Platform</span>
                  The AML Meter compliance software and related services.
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Services</span>
                  Name, sanctions, and PEP screening, CDD workflows, risk scoring, and audit logging.
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Client Data</span>
                  All data submitted to the Platform by the Client.
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Usage-Based Fees</span>
                  Charges based on screening volume or processed records.
                </div>
              </div>
            </section>

            {/* 3. Disclaimer */}
            <section className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h2 className="text-xl font-bold text-amber-900 mb-3">3. Nature of Services and Disclaimer</h2>
              <p className="text-amber-800 mb-4">
                AML Meter provides compliance technology tools only. We are <strong>not</strong> a financial institution, <strong>not</strong> a reporting entity, and do <strong>not</strong> provide legal advice.
              </p>
              <p className="text-sm text-amber-900 font-semibold mb-2">The Client remains solely responsible for:</p>
              <ul className="list-disc pl-5 text-sm text-amber-800 space-y-1">
                <li>Compliance with AML and regulatory obligations.</li>
                <li>Filing suspicious transaction reports.</li>
                <li>Final risk classification decisions.</li>
              </ul>
            </section>

            {/* 5. Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Usage-Based Pricing</h2>
              <p>
                Fees are calculated based on usage volume metrics defined in your commercial agreement. 
                AML Meter reserves the right to monitor system usage logs and invoice for excess usage beyond agreed thresholds. 
                Fees are non-refundable unless agreed otherwise in writing.
              </p>
            </section>

            {/* 7A. Data Processing Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7A. Data Processing Agreement (DPA)</h2>
              <p className="mb-4">
                This section constitutes the DPA between the parties. AML Meter acts as the <strong>Data Processor</strong> and the Client as the <strong>Data Controller</strong>.
              </p>
              <div className="space-y-4 text-sm border-l-4 border-indigo-200 pl-6">
                <p><strong>Processor Obligations:</strong> AML Meter shall process data only on documented instructions, ensure personnel confidentiality, and implement technical safeguards.</p>
                <p><strong>International Transfers:</strong> Transfers from the EU/UK to the UAE are safeguarded by Standard Contractual Clauses (2021/914).</p>
                <p><strong>Subprocessors:</strong> A current list is maintained at <a href="https://www.amlmeter.com/subprocessors" className="text-indigo-600">www.amlmeter.com/subprocessors</a>.</p>
              </div>
            </section>

            {/* 10. Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Service Availability</h2>
              <p>
                AML Meter uses commercially reasonable efforts to ensure 24/7 availability, excluding planned maintenance (typically with 24 hours notice) and Force Majeure Events. 
                We do not guarantee that the Platform will be uninterrupted or error-free.
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted under UAE law, total liability shall not exceed the total fees paid by the Client in the preceding 12 months. 
                AML Meter is not liable for regulatory fines, compliance failures, or decisions made based on screening outputs.
              </p>
            </section>

            {/* 13. Data Handling upon Termination */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Data Handling upon Termination</h2>
              <p>
                Within 30 days of termination, the Client may request the return of Client Data in a machine-readable format. 
                If no request is received, AML Meter is entitled to delete all data unless continued retention is required by law.
              </p>
            </section>

            {/* 14. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Governing Law and Jurisdiction</h2>
              <p>
                These Terms are governed by the laws of the United Arab Emirates. 
                Exclusive jurisdiction is granted to the competent courts of the UAE. 
                However, data subjects retain the right to bring legal proceedings in their habitual residence under GDPR/UK GDPR.
              </p>
            </section>

            {/* 16. Contact */}
            <section className="pt-8 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Contact Information</h2>
              <div className="p-6 rounded-xl bg-slate-900 text-white">
                <p className="font-semibold text-lg">AML Meter</p>
                <p className="text-slate-400">United Arab Emirates</p>
                <p className="mt-2 text-indigo-400">
                  Email: <a href="mailto:legal@amlmeter.com">legal@amlmeter.com</a> 
                </p>
              </div>
            </section>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
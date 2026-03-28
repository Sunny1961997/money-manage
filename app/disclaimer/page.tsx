"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header mode="solid" />
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-[#f4efff] via-[#efe7ff] to-[#f8f5ff]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-32 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.05 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance mb-4 text-slate-900"
            >
              AML Meter <span className="text-[#5b2bd8]">Disclaimer</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 mb-4"
            >
              Important Legal Information
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-center"
            >
              Please read this disclaimer carefully before using AML Meter's compliance technology platform.
            </motion.p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/95 shadow-[0_20px_50px_-35px_rgba(76,29,149,0.4)] overflow-hidden backdrop-blur-[2px]">
            <section className="relative p-6 sm:p-8 md:p-10 bg-transparent">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 via-white/30 to-transparent" />
              
              <div className="space-y-8">
                {/* Section 1 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    1. Purpose of This Platform
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter is a compliance technology platform designed to support organizations in implementing risk-based Anti-Money Laundering (AML), Counter-Terrorist Financing (CFT), and sanctions compliance frameworks.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    All tools, outputs, and functionalities are intended to <strong className="text-slate-800">assist compliance processes</strong>, not replace them.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-2">
                    AML Meter does not provide legal, regulatory, or advisory services.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    2. Relationship With Terms and Privacy Policy
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    This Disclaimer should be read in conjunction with:
                  </p>
                  <ul className="list-none space-y-1 mt-3">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>AML Meter Terms and Conditions</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>AML Meter Privacy Policy</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    Together, these documents govern the use of the platform, including:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>User obligations</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Data processing practices</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>System limitations and responsibilities</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    In the event of any inconsistency, the Terms and Conditions shall prevail.
                  </p>
                </div>

                {/* Section 3 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    3. Regulatory and Legal Positioning
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter is not:
                  </p>
                  <ul className="list-none space-y-1 mt-3">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>A regulatory authority</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>A licensed compliance advisory firm</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>A substitute for internal AML/CFT programs</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-4">
                    Use of AML Meter does not guarantee compliance with:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>UAE AML/CFT regulations</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Bangladesh AML laws</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>European Union regulatory frameworks, including <strong>General Data Protection Regulation</strong></span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>UAE Federal Decree-Law No. 45 of 2021 (<strong>UAE Personal Data Protection Law</strong>)</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-4 font-medium">
                    Users remain solely responsible for meeting all applicable legal and regulatory obligations.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    4. Data Protection and Roles (GDPR & PDPL Alignment)
                  </h2>
                  
                  <h3 className="font-semibold text-slate-700 mt-4 mb-2">4.1 Role of AML Meter</h3>
                  <p className="text-slate-600 leading-relaxed">Depending on the context:</p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>AML Meter acts as a <strong>Data Controller</strong> for:</span>
                      <ul className="list-none space-y-1 mt-1 ml-6">
                        <li className="flex items-start gap-2 text-slate-600">- Account registration</li>
                        <li className="flex items-start gap-2 text-slate-600">- Billing and subscription management</li>
                        <li className="flex items-start gap-2 text-slate-600">- Platform usage analytics</li>
                      </ul>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600 mt-2">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>AML Meter acts as a <strong>Data Processor</strong> for:</span>
                      <ul className="list-none space-y-1 mt-1 ml-6">
                        <li className="flex items-start gap-2 text-slate-600">- Customer data uploaded by clients</li>
                        <li className="flex items-start gap-2 text-slate-600">- Screening, risk scoring, and monitoring activities</li>
                      </ul>
                    </li>
                  </ul>

                  <h3 className="font-semibold text-slate-700 mt-4 mb-2">4.2 User Responsibility</h3>
                  <p className="text-slate-600 leading-relaxed">Clients (users of AML Meter):</p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Act as <strong>Data Controllers</strong> for their customer data</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Must ensure lawful basis for processing under:</span>
                      <ul className="list-none space-y-1 mt-1 ml-6">
                        <li className="flex items-start gap-2 text-slate-600">- GDPR principles (lawfulness, fairness, transparency)</li>
                        <li className="flex items-start gap-2 text-slate-600">- UAE PDPL requirements</li>
                      </ul>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Are responsible for:</span>
                      <ul className="list-none space-y-1 mt-1 ml-6">
                        <li className="flex items-start gap-2 text-slate-600">- Obtaining necessary consents</li>
                        <li className="flex items-start gap-2 text-slate-600">- Ensuring data accuracy</li>
                        <li className="flex items-start gap-2 text-slate-600">- Responding to data subject rights requests</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* Section 5 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    5. Cross-Border Data Considerations
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter may process or store data across jurisdictions, including:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>United Arab Emirates</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Bangladesh</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Other cloud infrastructure locations</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    Users acknowledge and agree that:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Cross-border data transfers may occur</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Appropriate safeguards (contractual, technical, organizational) are implemented where required</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    However, users remain responsible for ensuring compliance with:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>GDPR cross-border transfer rules</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>UAE PDPL data transfer restrictions</span>
                    </li>
                  </ul>
                </div>

                {/* Section 6 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    6. Accuracy and Limitations of Outputs
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter generates outputs including:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Risk scores</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Sanctions/PEP screening results</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Alerts and advisory flags</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    These outputs are:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Based on configurable models and external data</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Subject to inherent limitations, including:</span>
                      <ul className="list-none space-y-1 mt-1 ml-6">
                        <li className="flex items-start gap-2 text-slate-600">- False positives</li>
                        <li className="flex items-start gap-2 text-slate-600">- False negatives</li>
                        <li className="flex items-start gap-2 text-slate-600">- Data latency or gaps</li>
                      </ul>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    AML Meter does not guarantee:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Completeness</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Real-time accuracy</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Regulatory acceptance of outputs</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    All outputs must be independently reviewed.
                  </p>
                </div>

                {/* Section 7 */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    7. Human Oversight Requirement
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter is strictly a <strong className="text-slate-800">decision-support system</strong>.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    Users must ensure:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Qualified compliance professionals review outputs</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Decisions are not made solely based on automated results</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Appropriate escalation and governance processes are followed</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    This aligns with:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Risk-based approach principles</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>GDPR expectations regarding automated decision-making</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Regulatory expectations on human oversight</span>
                    </li>
                  </ul>
                </div>

                {/* Section 8-14 continued... */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    8. Third-Party Data and Integrations
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter may rely on third-party data sources, including:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Sanctions lists</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>PEP databases</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Adverse media feeds</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    AML Meter:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Does not control these sources</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Does not guarantee their completeness or accuracy</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Users must validate results before reliance.
                  </p>
                </div>

                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    9. System Availability and Technical Limitations
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter aims for high availability but does not guarantee uninterrupted service.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    Potential limitations include:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Scheduled maintenance</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Technical disruptions</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Integration dependencies</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    AML Meter is not liable for losses arising from such interruptions.
                  </p>
                </div>

                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    10. Limitation of Liability
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    To the fullest extent permitted by applicable law, AML Meter shall not be liable for:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Regulatory penalties or enforcement actions</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Incorrect risk assessments or screening outcomes</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Business losses resulting from system use</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Data-related issues arising from client inputs</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Use of AML Meter is at the user's own risk.
                  </p>
                </div>

                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    11. No Advisory or Fiduciary Relationship
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Use of AML Meter does not create:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Legal advisory relationships</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Consulting engagements</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Fiduciary duties</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    AML Meter remains a technology provider only.
                  </p>
                </div>

                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    12. Intellectual Property
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    All platform components, including:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Risk models</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Methodologies</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>System architecture</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Reports and outputs</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3">
                    Are the intellectual property of AML Meter unless otherwise stated.
                  </p>
                  <p className="text-slate-600 leading-relaxed mt-2 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Unauthorized use or reproduction is prohibited.
                  </p>
                </div>

                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    13. Updates and Modifications
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    AML Meter reserves the right to update this Disclaimer to reflect:
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Regulatory changes</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Product enhancements</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <span className="text-[#5b2bd8] text-lg leading-5">▣</span>
                      <span>Legal requirements</span>
                    </li>
                  </ul>
                  <p className="text-slate-600 leading-relaxed mt-3 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Continued use of the platform constitutes acceptance of such updates.
                  </p>
                </div>

                {/* Contact Section */}
                <div className="group border-l-4 border-[#5b2bd8]/20 hover:border-[#5b2bd8] transition-all duration-300 pl-5 py-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
                    14. Contact
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    For any questions regarding this Disclaimer, Privacy Policy, or Terms:
                  </p>
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#5b2bd8]/5 to-transparent rounded-xl border border-[#5b2bd8]/20">
                    <p className="text-slate-600">
                      <strong>Email:</strong>{" "}
                      <a href="mailto:support@amlmeter.com" className="text-[#5b2bd8] hover:underline">
                        support@amlmeter.com
                      </a>
                    </p>
                    <p className="text-slate-600 mt-1">
                      <strong>Website:</strong>{" "}
                      <a href="https://amlmeter.com/" target="_blank" rel="noopener noreferrer" className="text-[#5b2bd8] hover:underline">
                        https://amlmeter.com/
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500">
                  By using AML Meter, you acknowledge that you have read, understood, and agree to this Disclaimer.
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
"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function CopyrightPage() {
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
                            AML Meter <span className="text-[#5b2bd8]">Copyright Policy</span>
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex flex-col items-center gap-1 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 mb-4"
                        >
                            <span>Effective Date: 1st January 2026</span>
                            <span className="text-xs text-slate-500">Last Updated: 26th March 2026</span>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.1 }}
                            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-center"
                        >
                            Protecting intellectual property rights and ensuring compliance with UAE and international copyright laws.
                        </motion.p>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white/95 shadow-[0_20px_50px_-35px_rgba(76,29,149,0.4)] overflow-hidden backdrop-blur-[2px]">
                        <section className="relative p-6 sm:p-8 md:p-10 bg-transparent">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 via-white/30 to-transparent" />
                            <div className="prose prose-slate max-w-none">
                                <div className="mb-6 pb-4 border-b border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">
                                        <strong>Effective Date:</strong> 1st January 2026
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        <strong>Last Updated:</strong> 26th March 2026
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">1. Introduction</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            This Copyright Policy explains the ownership of intellectual property associated with AML Meter and outlines procedures for reporting copyright infringement. AML Meter is a compliance technology platform incorporated in the United Arab Emirates and Bangladesh.
                                        </p>
                                        <p className="text-slate-600 leading-relaxed mt-2">
                                            All content, materials, and system components made available through AML Meter are protected by applicable intellectual property laws.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">2. Ownership of Platform Content</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Unless otherwise stated, all rights, title, and interest in and to the Platform remain the exclusive property of AML Meter.
                                        </p>
                                        <p className="text-slate-600 leading-relaxed mt-2 font-medium">This includes, but is not limited to:</p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "Software source code and object code",
                                                "Screening algorithms and matching logic",
                                                "Risk scoring methodology",
                                                "System architecture",
                                                "Platform interface design",
                                                "Reports, templates, and documentation",
                                                "Branding, logos, and visual identity",
                                                "Website content and materials"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-slate-600 leading-relaxed mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            These materials are protected under:</p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "UAE Federal Copyright Law",
                                                "International copyright conventions",
                                                "Applicable intellectual property regulations",
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-slate-600 leading-relaxed mt-2">
                                            No ownership rights are transferred to Clients.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">3. Limited License to Clients</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Clients are granted a limited, non-exclusive, non-transferable, and revocable license to use the Platform solely for internal compliance purposes during the subscription term.
                                        </p>
                                        <p className="text-slate-600 leading-relaxed mt-2 font-medium">Clients may not:</p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "Copy or reproduce proprietary system components",
                                                "Modify or create derivative works of the Platform",
                                                "Reverse engineer or decompile the software",
                                                "Extract proprietary screening logic",
                                                "Redistribute platform materials",
                                                "Use branding without written authorization",
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-slate-600 leading-relaxed mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            These materials are protected under:</p>
                                        <p className="text-slate-600 leading-relaxed mt-2">
                                            Any unauthorized use may result in immediate suspension and legal action.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">4. Client-Submitted Content</h2>
                                        <p className="text-slate-600 leading-relaxed mt-2 font-medium">This includes, but is not limited to:</p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "Customer information",
                                                "Uploaded documents",
                                                "Case notes",
                                                "Internal investigation materials",
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-slate-600 leading-relaxed mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            By submitting Client Data, the Client represents and warrants that:</p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "They have lawful rights to use and upload such data",
                                                "Submission does not infringe third-party intellectual property rights",
                                                "Required permissions have been obtained",
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-slate-600 leading-relaxed mt-2">
                                            AML Meter does not claim ownership of Client Data.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">5. Copyright Infringement Reporting</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            AML Meter respects intellectual property rights and expects users to do the same. If you believe that content hosted on the Platform infringes your copyright, you may submit a written notice including:
                                        </p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "Identification of the copyrighted work claimed to be infringed",
                                                "Description of the allegedly infringing material",
                                                "Sufficient information to locate the material",
                                                "Your contact information",
                                                "A statement of good faith belief that use is unauthorized",
                                                "A statement that the information provided is accurate",
                                                "Your signature (electronic or physical)"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="font-medium text-slate-700">Notices should be sent to:</p>
                                            <p className="text-slate-600 mt-1">
                                                <strong>Email:</strong> legal@amlmeter.com<br />
                                                <strong>Subject Line:</strong> Copyright Infringement Notice
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">6. Investigation and Action</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Upon receiving a valid notice, AML Meter may:
                                        </p>
                                        <ul className="list-none space-y-1 mt-2">
                                            {[
                                                "Investigate the claim",
                                                "Request additional information",
                                                "Temporarily restrict access to disputed content",
                                                "Remove infringing material",
                                                "Suspend user accounts if infringement is confirmed"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <span className="text-[#5b2bd8]">▣</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="font-medium text-slate-700">AML Meter reserves the right to take appropriate legal action where necessary.</p>
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">7. Repeat Infringers</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            AML Meter reserves the right to suspend or terminate accounts of users who repeatedly infringe intellectual property rights.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">8. RNo Waiver of Rights</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            Failure to enforce intellectual property rights shall not constitute a waiver of such rights. AML Meter reserves all rights not expressly granted in writing.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-bold text-slate-800">9. Contact Information</h2>
                                        <div className="mt-2 p-4 bg-gradient-to-r from-[#5b2bd8]/5 to-transparent rounded-xl border border-[#5b2bd8]/20">
                                            <p className="text-slate-600">
                                                <strong>AML Meter</strong><br />
                                                United Arab Emirates
                                            </p>
                                            <p className="text-slate-600 mt-2">
                                                <strong>Email:</strong>{" "}
                                                <a href="mailto:legal@amlmeter.com" className="text-[#5b2bd8] hover:underline">
                                                    legal@amlmeter.com
                                                </a>
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}
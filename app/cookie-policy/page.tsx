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
                                Cookies are small text files that are placed on your computer, tablet, or mobile device when
                                you visit a website. They are widely used to make websites work more efficiently, remember
                                your preferences, and provide information to website owners.

                                Cookies may be:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li><strong>Session cookies – </strong> Temporary and deleted when you close your browser.</li>
                                <li><strong>Persistent cookies – </strong> Remain on your device for a set period or until deleted.</li>
                            </ul>
                        </section>

                        {/* 3. Types of Cookies We Use */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Types of Cookies We Use</h2>
                            <p className="text-sm">We use the following categories of cookies on our Website: </p>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">3.1 Essential Cookies </h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-sm text-left border-collapse">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-semibold">Purpose</td>
                                            <td className="p-3">These cookies are necessary for the Website to function properly. They enable core features such as security, network management, and accessibility. </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Examples</td>
                                            <td className="p-3">Session cookies, security tokens, load balancing cookies </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Duration</td>
                                            <td className="p-3">Session / Persistent </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Consent</td>
                                            <td className="p-3">No consent required – always active</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">3.2 Analytics Cookies </h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-sm text-left border-collapse">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-semibold">Purpose</td>
                                            <td className="p-3">These cookies help us understand how visitors interact with our Website by
                                                collecting anonymous information about pages visited, time spent, and error
                                                messages. This helps us improve performance. </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Providers</td>
                                            <td className="p-3">Google Analytics, Microsoft Clarity</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Duration</td>
                                            <td className="p-3">Up to 2 years</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Consent</td>
                                            <td className="p-3">Required</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">3.3 Marketing Cookies</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-sm text-left border-collapse">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-semibold">Purpose</td>
                                            <td className="p-3">These cookies track your browsing habits across websites to deliver advertisements
                                                that are relevant to you and measure ad effectiveness. They may be set by our
                                                advertising partners. </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Providers</td>
                                            <td className="p-3">LinkedIn, Google Ads, Meta (Facebook), Twitter </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Duration</td>
                                            <td className="p-3">Up to 1 years</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Consent</td>
                                            <td className="p-3">Required</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">3.4 Functional Cookies </h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="w-full text-sm text-left border-collapse">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-semibold">Purpose</td>
                                            <td className="p-3">These cookies enhance your experience by remembering your preferences (e.g.,
                                                language, region) and providing personalized features. </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Providers</td>
                                            <td className="p-3">First-party only </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Duration</td>
                                            <td className="p-3">Up to 1 years</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Consent</td>
                                            <td className="p-3">Required</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                        <tr>
                                            <td className="p-3">PHPSESSID</td>
                                            <td className="p-3">AML Meter</td>
                                            <td className="p-3">Session management</td>
                                            <td className="p-3">Session</td>
                                            <td className="p-3">Essential</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">cookie_consent</td>
                                            <td className="p-3">AML Meter</td>
                                            <td className="p-3">Stores preferences</td>
                                            <td className="p-3">1 year</td>
                                            <td className="p-3">Essential</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">_ga</td>
                                            <td className="p-3">Google Analytics</td>
                                            <td className="p-3">Distinguishes unique users</td>
                                            <td className="p-3">2 years</td>
                                            <td className="p-3">Analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">_gid</td>
                                            <td className="p-3">Google Analytics</td>
                                            <td className="p-3">Distinguishes unique users</td>
                                            <td className="p-3">24 hours</td>
                                            <td className="p-3">Analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">_gat</td>
                                            <td className="p-3">Google Analytics</td>
                                            <td className="p-3">Throttles request rate </td>
                                            <td className="p-3">1 minute</td>
                                            <td className="p-3">Analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">_clck</td>
                                            <td className="p-3">Microsoft Clarity</td>
                                            <td className="p-3">Persists Clarity User ID</td>
                                            <td className="p-3">1 year</td>
                                            <td className="p-3">Analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">_clsk</td>
                                            <td className="p-3">Microsoft Clarity</td>
                                            <td className="p-3">Stores session information </td>
                                            <td className="p-3">24 hours</td>
                                            <td className="p-3">Analytics</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">li_sugr</td>
                                            <td className="p-3">LinkedIn</td>
                                            <td className="p-3">Browser identifier </td>
                                            <td className="p-3">3 months </td>
                                            <td className="p-3">Marketing</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">bcookie</td>
                                            <td className="p-3">LinkedIn</td>
                                            <td className="p-3">Browser identifier </td>
                                            <td className="p-3">2 years </td>
                                            <td className="p-3">Marketing</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">_fbp</td>
                                            <td className="p-3">Meta (Facebook)</td>
                                            <td className="p-3">Ad delivery</td>
                                            <td className="p-3">3 months</td>
                                            <td className="p-3">Marketing</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">IDE</td>
                                            <td className="p-3">Google Ads</td>
                                            <td className="p-3">Ad targeting</td>
                                            <td className="p-3">1 year</td>
                                            <td className="p-3">Marketing</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 italic"></p>
                        </section>

                        {/* 5. How We Obtain Consent */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. How We Obtain Your Consent</h2>
                            <p>
                                When you first visit our Website, you will see a cookie banner that allows you to:
                            </p>
                            <p className="mb-4"><strong>- Accept All – consent to all cookie categories;</strong></p>
                            <p className="mb-4"><strong>- Decline – accept only essential cookies; </strong></p>
                            <p className="mb-4"><strong>- Customize – choose which categories to accept.</strong></p>
                            <p className="mb-4">
                                Your consent is stored for 6 months. After this period, the banner will reappear to renew your
                                consent.<br />
                                You can change your preferences at any time by clicking the "Cookie Settings" link in the
                                website footer.
                            </p>
                        </section>

                        {/* 6. Browser Settings */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Managing Cookies via Browser Settings</h2>
                            <p className="mb-4">Most web browsers allow you to control cookies through their settings. You can: </p>
                            <p className="mb-4">- Delete all cookies; </p>
                            <p className="mb-4">- Block specific cookies; </p>
                            <p className="mb-4">- Block third-party cookies; </p>
                        </section>

                        {/* 7. Do Not Track (DNT) Signals  */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Do Not Track (DNT) Signals </h2>
                            <p className="mb-4">Some browsers transmit "Do Not Track" signals to websites. Our Website does not currently
                                respond to DNT signals. We will continue to monitor industry standards and update this
                                policy as practices evolve. </p>
                        </section>

                        {/* 8. Third-Party Cookies   */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Third-Party Cookies </h2>
                            <p className="mb-4">
                                Some cookies on our Website are placed by third-party service providers for analytics and
                                marketing purposes. These providers may also use cookies for their own purposes, which are
                                governed by their respective privacy policies:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li><strong>Google Analytics: </strong><a href="https://policies.google.com/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a></li>
                                <li><strong>Microsoft: </strong><a href="https://privacy.microsoft.com/en-us/privacystatement" className="text-indigo-600 hover:underline">Privacy Policy</a></li>
                                <li><strong>LinkedIn: </strong><a href="https://www.linkedin.com/legal/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</a></li>
                                <li><strong>Meta (Facebook): </strong><a href="https://www.facebook.com/policy.php" className="text-indigo-600 hover:underline">Privacy Policy</a></li>
                                <li><strong>Twitter: </strong><a href="https://twitter.com/en/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a></li>
                            </ul>
                        </section>
                        <p className="mb-4">
                            We do not control these third-party cookies. You should review the relevant third-party
                            privacy policies for more information.
                        </p>
                        {/* 9. International Users */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Users</h2>
                            <p className="mb-4">If you are accessing our Website from the European Economic Area (EEA) , the United
                                Kingdom, or Switzerland, please note: </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Non-essential cookies require explicit consent.</li>
                                <li>You have the right to withdraw consent at any time.</li>
                                <li>Data transfers outside the EEA/UK are governed by our Privacy Policy.</li>
                            </ul>
                            <p className="mb-4">
                                - We will only place non-essential cookies on your device with your explicit consent;
                            </p>
                            <p className="mb-4">
                                - You have the right to withdraw your consent at any time;
                            </p>
                            <p className="mb-4">
                                - Your data may be transferred outside the EEA/UK as described in our [Privacy
                                Policy](/privacy-policy) (Section 5 – International Data Transfers).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Updates to This Cookie Policy </h2>
                            <p className="mb-4">
                                We may update this Cookie Policy from time to time to reflect changes in technology,
                                regulation, or our business practices. The updated version will be posted on this page with a
                                revised "Last Updated" date.
                                If we make material changes, we will notify you via a notice on our Website or by email.
                            </p>
                        </section>

                        {/* 11. Contact Us */}
                        <section className="pt-8 border-t border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
                            <p>If you have any questions about this Cookie Policy or our use of cookies, please contact us:  </p>
                            <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                <p className="font-medium text-slate-900">Email: <a href="mailto:trustandsafety@amlmeter.com " className="text-indigo-600">trustandsafety@amlmeter.com </a> </p>
                                <p className="text-slate-700">Address: AML Meter, United Arab Emirates </p>
                                <p className="text-slate-700">For data protection enquiries, please include "Cookie Policy" in the subject line. </p>
                            </div>
                        </section>

                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}
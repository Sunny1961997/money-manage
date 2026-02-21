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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                        <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
                        <p className="mb-4">AML Meter ("we", "our", "us") is a compliance technology platform designed to support the following –</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Name and Watchlist screening including sanctions and PEP screening</li>
                            <li>KYC and Customer Due Diligence workflows and reports</li>
                            <li>Risk scoring and profiling of customers</li>
                            <li>Assistance in Regulatory Reporting (GoAML)</li>
                        </ul>
                        <p className="list-disc pl-6 mb-4">
                            AML Meter operates through registered entities in the United Arab Emirates and Bangladesh. This Privacy Policy explains how AML Meter processes personal data in accordance with:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>EU General Data Protection Regulation 2016/679 (GDPR)</li>
                            <li>UK General Data Protection Regulation (UK GDPR)</li>
                            <li>UAE Federal Decree-Law No. 45 of 2021 (UAE PDPL)</li>
                            <li>Other applicable data protection laws</li>
                        </ul>
                        <p className="mb-4">
                            This Privacy Policy explains how AML Meter collects, processes, stores, and protects information when you:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Use the AML Meter platform</li>
                            <li>Access our website</li>
                            <li>Register for an account</li>
                            <li>Submit customer screening and KYC data</li>
                            <li>Communicate with us</li>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">2. Data Protection Roles</h2>
                        <p className="mb-4">
                            AML Meter processes personal data in two capacities.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">2.1 AML Meter as Data Processor (Article 28 GDPR)</h2>
                        <p className="mb-4">
                            AML Meter acts as a <strong>Data Processor</strong> when processing:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Client customer data</li>
                            <li>Client’s client identification details</li>
                            <li>CDD documentation</li>
                            <li>Screening inputs and results</li>
                            <li>Risk scoring outputs</li>
                            <li>Case investigation records</li>
                            <li>UBO and beneficial ownership information</li>
                        </ul>
                        <p className="mb-4">
                            In this context:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>The client organization acts as the Data Controller</li>
                            <li>AML Meter processes data only on documented instructions</li>
                            <li>AML Meter does not determine the purposes or legal basis of processing</li>
                        </ul>
                        <p className="mb-4">
                            AML Meter complies with Article 28 GDPR obligations, including:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Processing only under written instruction</li>
                            <li>Ensuring confidentiality of personnel</li>
                            <li>Implementing appropriate technical and organizational measures</li>
                            <li>Assisting controllers with data subject rights</li>
                            <li>Supporting breach notification obligations</li>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">2.2 AML Meter as Data Controller (Article 24 GDPR)</h2>
                        <p className="mb-4">
                            AML Meter acts as a <strong>Data Controller</strong> for:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Client organization account data</li>
                            <li>Authorized platform user data</li>
                            <li>Contractual and onboarding information</li>
                            <li>Billing and subscription data</li>
                            <li>Website visitor data</li>
                            <li>Marketing preferences</li>
                        </ul>
                        <p className="mb-4">
                            Legal basis for such processing includes:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Contractual necessity (Article 6(1)(b) GDPR</li>
                            <li>Legal obligation (Article 6(1)(c))</li>
                            <li>Legitimate interest (Article 6(1)(f))</li>
                            <li>Consent where applicable (Article 6(1)(a))</li>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            3. Categories of Personal Data
                        </h2>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            3.1 Client Organization and User Data
                        </h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Company name</li>
                            <li>Registration number</li>
                            <li>Contact name</li>
                            <li>Official email address</li>
                            <li>Telephone number</li>
                            <li>User credentials and access roles</li>
                            <li>Billing and payment details</li>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            3.2 Client Customer Data (Processed Under Instruction)
                        </h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Full name</li>
                            <li>Date of birth</li>
                            <li>Nationality</li>
                            <li>Identification numbers</li>
                            <li>Passport or ID details</li>
                            <li>Corporate registration data</li>
                            <li>Beneficial ownership information</li>
                            <li>Screening results</li>
                            <li>Risk ratings</li>
                            <li>Investigation notes</li>
                            <li>Audit logs</li>
                        </ul>
                        <p className="mb-4">
                            AML Meter does not originate or independently collect this data.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            3.3 Technical and Log Data
                        </h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>IP addresses</li>
                            <li>Device identifiers</li>
                            <li>Login timestamps</li>
                            <li>System activity records</li>
                            <li>Audit trail data</li>
                        </ul>
                        <p className="mb-4">
                            This data is necessary for system security, integrity, and regulatory traceability.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            4. GDPR Principles Applied
                        </h2>
                        <p className="mb-4">
                            AML Meter adheres to GDPR Article 5 principles:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Lawfulness, fairness, and transparency</li>
                            <li>Purpose limitation</li>
                            <li>Data minimization</li>
                            <li>Accuracy</li>
                            <li>Storage limitation</li>
                            <li>Integrity and confidentiality</li>
                            <li>Accountability</li>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            5. International Data Transfers
                        </h2>
                        <p className="mb-4">
                            AML Meter's data centers are located exclusively in the United Arab Emirates. If you are accessing our services from the European Economic Area (EEA), the United Kingdom, or Switzerland, your personal data will be transferred to and processed in the UAE.
                            The UAE has not been recognised by the European Commission or UK Government as providing an adequate level of data protection equivalent to that in the EEA or UK. To ensure your data is protected to GDPR standards, AML Meter relies on the following safeguards:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li><strong>Standard Contractual Clauses (SCCs):</strong> For transfers from the EEA, AML Meter has implemented the European Commission's Standard Contractual Clauses (2021/914) for the transfer of personal data to third countries.</li>
                            <li><strong>UK International Data Transfer Addendum:</strong> For transfers from the United Kingdom, AML Meter has implemented the UK International Data Transfer Addendum to the EU Standard Contractual Clauses.</li>
                        </ul>
                        <p className="mb-4">
                            Copies of these safeguards are available upon request by contacting trustandsafety@amlmeter.com. By using our services, you acknowledge that your data will be transferred to and processed in the UAE under these safeguards.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            6. Data Retention
                        </h2>
                        <p className="mb-4">
                            Data is retained:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>For the duration of the service agreement</li>
                            <li>According to client-defined retention settings</li>
                            <li>As required by legal or regulatory obligations</li>
                        </ul>
                        <p className="mb-4">
                            Upon termination:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Data may be returned to the client</li>
                            <li>Data may be securely deleted in accordance with contractual terms</li>
                        </ul>
                        <p className="mb-4">
                            If a client does not specify retention settings or fails to retrieve their data upon termination of the service agreement, AML Meter will securely delete all Client Data ninety (90) days after the end of the contract, unless a longer retention period is required by applicable law for AML Meter's own compliance (e.g., tax, audit, or anti-money laundering record-keeping obligations). Where required by law, data may be retained in a restricted, archived form for the legally mandated period.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            7. Data Security Measures
                        </h2>
                        <p className="mb-4">
                            AML Meter implements appropriate technical and organizational measures under Article 32 GDPR, including:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Encrypted data transmission</li>
                            <li>Secure authentication mechanisms</li>
                            <li>Role-based access controls</li>
                            <li>Logical data segregation</li>
                            <li>Audit logging and traceability</li>
                            <li>Controlled administrative access</li>
                            <li>Periodic access review</li>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            8. Data Subject Rights (GDPR)
                        </h2>
                        <p className="mb-4">
                            Where applicable, data subjects may have rights under GDPR, including:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Right of access (Article 15)</li>
                            <li>Right to rectification (Article 16)</li>
                            <li>Right to erasure (Article 17)</li>
                            <li>Right to restrict (Article 18)</li>
                            <li>Right to data portability (Article 20)</li>
                            <li>Right to object (Article 21)</li>
                        </ul>
                        <p className="mb-4">
                            For client customer data, requests must be directed to the relevant client organization acting as Data Controller.
                            AML Meter will assist controllers in responding to lawful requests.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            9. Personal Data Breach Notification
                        </h2>
                        <p className="mb-4">
                            In the event of a personal data breach:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>AML Meter will notify the relevant client without undue delay</li>
                            <li>AML Meter will provide necessary information to support regulatory reporting</li>
                            <li>Corrective measures will be implemented</li>
                        </ul>
                        <p className="mb-4">
                            Controllers remain responsible for notifying supervisory authorities and affected individuals where required.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            10. Subprocessors
                        </h2>
                        <p className="mb-4">
                            AML Meter may engage subprocessors to assist in providing the Services. A current list of subprocessors, including their name, purpose, and location, is maintained at:
                            www.amlmeter.com/subprocessors
                            Before engaging any new subprocessor, AML Meter will:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Update the list at the above URL;</li>
                            <li>Notify affected Clients via the email address associated with their account at least fourteen (14) days in advance.</li>
                        </ul>
                        <p className="mb-4">
                            If a Client objects to a new subprocessor on reasonable grounds relating to the protection of personal data, the Client may terminate the affected services without penalty by providing written notice within fourteen (14) days of the notification.
                            All subprocessors are contractually bound to comply with data protection obligations equivalent to those imposed on AML Meter under this Privacy Policy.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            11. Cookies and Website Tracking
                        </h2>
                        <h3 className="text-xl font-semibold mt-6 mb-2">
                            11.1 What Are Cookies
                        </h3>
                        <p className="mb-4">
                            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and deliver targeted content.
                        </p>
                        <h3 className="text-xl font-semibold mt-6 mb-2">
                            11.2 Types of Cookies We Use
                        </h3>
                        <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
                            <table className="w-full text-left border-collapse table-auto">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="p-4 font-bold text-slate-900 border-r border-b border-slate-300">Cookie Type</th>
                                        <th className="p-4 font-bold text-slate-900 border-r border-b border-slate-300">Purpose</th>
                                        <th className="p-4 font-bold text-slate-900 border-r border-b border-slate-300">Duration</th>
                                        <th className="p-4 font-bold text-slate-900 border-b border-slate-300">Third Parties / Providers</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Essential Cookies */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-semibold text-slate-900 border-r border-b border-slate-200">Essential Cookies</td>
                                        <td className="p-4 text-slate-700 border-r border-b border-slate-200">
                                            Necessary for the Website to function properly. They enable core features such as security, network management, and accessibility.
                                        </td>
                                        <td className="p-4 text-slate-700 border-r border-b border-slate-200">Session / Persistent</td>
                                        <td className="p-4 text-slate-700 border-b border-slate-200">First-party only</td>
                                    </tr>

                                    {/* Analytics Cookies */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-semibold text-slate-900 border-r border-b border-slate-200">Analytics Cookies</td>
                                        <td className="p-4 text-slate-700 border-r border-b border-slate-200">
                                            Help us understand how visitors interact with our Website by collecting anonymous information about pages visited, time spent, and error messages.
                                        </td>
                                        <td className="p-4 text-slate-700 border-r border-b border-slate-200">Up to 2 years</td>
                                        <td className="p-4 text-slate-700 border-b border-slate-200">Google Analytics, Microsoft Clarity</td>
                                    </tr>

                                    {/* Marketing Cookies */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-semibold text-slate-900 border-r border-b border-slate-200">Marketing Cookies</td>
                                        <td className="p-4 text-slate-700 border-r border-b border-slate-200">
                                            Track your browsing habits across websites to deliver advertisements that are relevant to you and measure ad effectiveness.
                                        </td>
                                        <td className="p-4 text-slate-700 border-r border-b border-slate-200">Up to 1 year</td>
                                        <td className="p-4 text-slate-700 border-b border-slate-200">LinkedIn, Google Ads, Meta (Facebook), Twitter</td>
                                    </tr>

                                    {/* Functional Cookies */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-semibold text-slate-900 border-r border-slate-200">Functional Cookies</td>
                                        <td className="p-4 text-slate-700 border-r border-slate-200">
                                            Enhance your experience by remembering your preferences (e.g., language, region) and providing personalized features. 
                                        </td>
                                        <td className="p-4 text-slate-700 border-r border-slate-200">Up to 1 year</td>
                                        <td className="p-4 text-slate-700">First-party only</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            11.3 Consent and Control
                        </h2>
                        <p className="mb-4">
                            When you first visit our website, you will see a cookie banner asking for your consent. You may:
                        </p>
                        <ul className="list-disc list-inside mb-4">
                            <li><strong>Accept All</strong> – consent to all cookie types;</li>
                            <li><strong>Decline</strong> – accept only essential cookies;</li>
                            <li><strong>Customize</strong> – select which cookie categories to accept.</li>
                        </ul>
                        <p className="mb-4">
                            You can change your preferences at any time by clicking the <strong>"Cookie Settings"</strong> link in the website footer.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            11.4 Managing Cookies via Browser
                        </h2>
                        <p className="mb-4">
                            Most browsers allow you to control cookies through settings. You can:
                        </p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Delete all cookies;</li>
                            <li>Block specific cookies;</li>
                            <li>Set preferences for certain websites.</li>
                        </ul>
                        <p className="mb-4">
                            <strong>Instructions for common browsers:</strong>
                        </p>
                        <ul className="list-disc list-inside mb-4">
                            <a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer"><li>Google Chrome</li></a>
                            <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank" rel="noopener noreferrer"><li>Mozilla Firefox</li></a>
                            <a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer"><li>Safari</li></a>
                            <a href="https://support.microsoft.com/en-us/help/4468242/windows-10-manage-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer"><li>Microsoft Edge</li></a>
                        </ul>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            11.5 Do Not Track Signals
                        </h2>
                        <p className="mb-4">
                            Our website does not currently respond to "Do Not Track" (DNT) signals. We will continue to monitor industry standards and update this policy as practices evolve.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            11.6 Consequences of Disabling Cookies
                        </h2>
                        <p className="mb-4">
                            If you disable essential cookies, certain parts of our website may not function properly. Disabling analytics or marketing cookies will not affect website functionality but may result in less personalized content.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            11.7 Updates to This Cookie Policy
                        </h2>
                        <p className="mb-4">
                            We may update this Cookie Policy from time to time. The latest version will always be available on our website with an updated effective date.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            12. Changes to This Policy
                        </h2>
                        <p className="mb-4">
                            AML Meter may update this Privacy Policy periodically. The updated version will be published with a revised effective date.
                        </p>
                        <h2 className="text-xl font-semibold mt-6 mb-2">
                            13. Contact Details
                        </h2>
                        <p className="mb-4">
                            <strong>AML Meter</strong><br />
                            <strong>Data Protection Enquiries:</strong> <a href="mailto:trustandsafety@amlmeter.com" className="underline text-primary">trustandsafety@amlmeter.com</a><br />
                            <strong>Legal Enquiries:</strong> <a href="mailto:legal@amlmeter.com" className="underline text-primary">legal@amlmeter.com</a><br />
                            <strong>Location:</strong> United Arab Emirates
                        </p>
                        <p>If you are in the EEA or UK and are unsatisfied with our response, you have the right to lodge a complaint with your local supervisory authority (e.g., ICO in the UK, or your national data protection authority).</p>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}

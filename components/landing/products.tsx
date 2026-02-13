"use client";

import Link from "next/link";
import { ProductCard } from "./product-card";
import { UserCheck, ShieldAlert, FileText, Scale } from "lucide-react";

export function Products() {
  const products = [
    {
      title: "Customer Onboarding with Due Diligence",
      description: "The AML Meter method helps regulated businesses get new customers by making sure that customer data is regularly gathered, checked, and approved in line with AML/CFT rules.",
      primary_characteristics: [
        "The onboarding of individual clients and customers",
        "The onboarding of legal business entities",
        "The capture of beneficial ownership",
        "The customer service for non-residents",
        "The record retention and document acquisition",
        "The user accountability and approval procedures"
      ],
      icon: UserCheck
    },
    {
      title: "Watchlist Screening",
      description: "As part of customer due diligence and continuing compliance duties, AML Meter delivers screening tools to support sanctions, PEP, and adverse media investigations.",
      primary_characteristics: [
        "Conducts screening for sanctions",
        "Screening for Politically Exposed Persons (PEPs)",
        "Adverse media checks",
        "Evidence retention and history screening"
      ],
      icon: ShieldAlert
    },
    {
      title: "Regulatory Reporting",
      description: "Streamlined reporting tools to ensure compliance with regulatory requirements.",
      primary_characteristics: [
        "Report generation that is automated",
        "Exports in multiple formats",
        "Changes in regulations",
        "Dashboards for compliance"
      ],
      icon: FileText
    },
    {
      title: "Compliance Advisory & Support",
      description: "Advisory support is provided to complement AML Meter, when necessary, with a concentration on the design and implementation of the AML framework.",
      primary_characteristics: [
        "Assistance with the AML/CFT framework",
        "Implementation guidance for a risk-based approach",
        "Assistance with control design and documentation",
        "Assistance with regulatory readiness"
      ],
      features: [
        "Features at a Glance",
        "Onboarding workflows for natural persons on an individual basis",
        "Corporate profile capture and legal entity induction",
        "Documentation of the ownership structure and UBO",
        "Centralized document accumulation and record retention",
        "Screening for sanctions",
        "Identification and documentation of PEP",
        "Recorded outcomes of adverse media screening",
        "Disposition logging and match review (escalate, false positive, genuine match)",
        "Continuous screening and periodic rescreening",
        "Exportable audit evidence and compliance reporting"
      ],
      icon: Scale
    }
  ];

  return (
    <section id="services" className="relative py-16 sm:py-20 bg-white scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight leading-tight">Our <span className="text-primary">Services</span></h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed text-justify">
            Comprehensive AML solutions designed to keep your organization compliant, secure, and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-md hover:shadow-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { FAQAccordion } from "@/components/faq/faq-accordion";
import { FAQ_ITEMS } from "@/data/faqs";

export function FaqsPreview() {
  return (
    <section id="faq" className="py-12 sm:py-14 px-4 bg-gradient-to-b from-white to-slate-50/60">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8 sm:mb-9"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            AML Meter <span className="text-primary">FAQs</span>
          </h2>
          <p className="mt-2.5 text-slate-600 max-w-xl mx-auto">
            Clear answers for UAE DNFBPs and regulated entities adopting a risk-based compliance approach.
          </p>
        </motion.div>

        <FAQAccordion items={FAQ_ITEMS} maxItems={3} variant="preview" autoCloseOnRowLeave={false} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
          >
            Explore AML Meter FAQs
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

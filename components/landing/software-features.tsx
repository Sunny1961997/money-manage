'use client';

import { ArrowRight, Workflow, ShieldCheck, SlidersHorizontal, Building2, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const valuePropositions = [
  {
    title: 'Integrated AML Compliance in One Platform',
    description:
      'AML Meter combines customer onboarding, CDD documentation, name screening, and risk assessment into a single structured system built for practical compliance.',
    icon: Workflow
  },
  {
    title: 'Built for Regulatory Defensibility',
    description:
      'From onboarding data capture to screening disposition and risk scoring, every decision is documented, traceable, and inspection-ready.',
    icon: ShieldCheck
  },
  {
    title: 'Risk-Based Approach Made Simple',
    description:
      'Configurable risk scoring and standardized workflows help firms implement a true risk-based AML framework without overengineering or manual spreadsheets.',
    icon: SlidersHorizontal
  },
  {
    title: 'Designed for SMEs and DNFBPs',
    description:
      'Designed for SMEs and DNFBPs, AML Meter delivers professional AML controls without the cost, infrastructure burden, or technical complexity of large banking systems.',
    icon: Building2
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

function LadderStepCard({
  title,
  description,
  icon: Icon,
  isLast
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  isLast: boolean;
}) {
  return (
    <motion.article
      variants={itemVariants}
      className="group relative h-full min-h-[220px] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30"
    >
      <div>
        <div className="mb-4">
          <div className="w-11 h-11 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors duration-300 leading-snug">{title}</h3>
        </div>
        <p className="text-slate-600 leading-relaxed text-sm text-left">{description}</p>
      </div>

      {!isLast && (
        <div className="hidden xl:flex absolute -right-[15px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] items-center justify-center rounded-full border border-primary/40 bg-white text-primary shadow-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </motion.article>
  );
}

export function SoftwareFeatures() {
  return (
    <section id="value-proposition" className="relative py-16 sm:py-20 bg-white scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-slate-50/35 to-slate-50/70" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Our <span className="text-primary">Value Propositions</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto text-center">
            Practical AML capabilities built for defensible compliance outcomes
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-5 md:p-6 h-full relative overflow-hidden group/bento"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />
          <div className="hidden xl:block absolute left-10 right-10 top-[7.2rem] h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
          <div className="mb-6 md:mb-7">
            <h3 className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              Compliance Confidence Ladder
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {valuePropositions.map((item, index) => (
              <LadderStepCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                isLast={index === valuePropositions.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

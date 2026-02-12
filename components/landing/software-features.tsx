'use client';

import { ArrowRight, ShieldCheck, Activity, Target, Share2, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const coreCompliance = [
  {
    title: 'AML Screening',
    description: 'Screen for sanctions, PEP/RCAs, and adverse media.',
    icon: ShieldCheck
  },
  {
    title: 'AML Monitoring',
    description: 'Detect criminal patterns in real-time and post-event.',
    icon: Activity
  },
  {
    title: 'AML Risk Scoring',
    description: 'Identify high-risk customers.',
    icon: Target
  }
];

const intelligenceSharing = [
  {
    title: 'AML Bridge',
    description: 'Send and receive intelligence. Launch collaborative investigations.',
    icon: Share2
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

function FeatureCard({
  title,
  description,
  icon: Icon,
  variant = 'default'
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'tinted';
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={[
        'relative h-full min-h-[180px] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 bg-white border',
        variant === 'tinted'
          ? 'border-primary/20 bg-primary/[0.02] shadow-sm'
          : 'border-slate-100 shadow-sm',
        'hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 group'
      ].join(' ')}
    >
      <div>
        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm text-left">{description}</p>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
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
            Our <span className="text-primary">Value Proposition</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto text-center">
            Comprehensive compliance and intelligence tools designed to protect your business
          </p>
        </div>

        {/* Layout mimicking the screenshot */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >

          {/* Core Compliance Group (Spans 3/4) */}
          <div className="lg:col-span-3">
            {/* Dashed Border Container */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-5 md:p-6 h-full relative overflow-hidden group/bento flex flex-col">
              {/* Label overlapping the border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />

              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 whitespace-nowrap">
                  Core Compliance
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                {coreCompliance.map((item, index) => (
                  <FeatureCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    variant="default"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Intelligence Sharing Group (Spans 1/4) */}
          <div className="lg:col-span-1">
            {/* Dashed Border Container */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-5 md:p-6 h-full relative overflow-hidden group/bento flex flex-col">
              {/* Label overlapping the border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />

              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 whitespace-nowrap">
                  Intelligence Sharing
                </h3>
              </div>

              <div className="flex-grow">
                {intelligenceSharing.map((item, index) => (
                  <FeatureCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    variant="tinted"
                  />
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

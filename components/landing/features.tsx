'use client';

import { Award, Compass, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Award,
    title: 'Our Expertise',
    description: `Our team possesses a wealth of experience in the UAE financial services regulatory environment, 
                  utilizing structured, risk-based compliance practices to assist regulated entities in comprehending and 
                  addressing their AML, sanctions, and risk management obligations.`
  },
  {
    icon: Compass,
    title: 'Our Approach',
    description: `Our advisory and implementation support are customized to fit the changing regulations, 
                  with a focus on the consistent application of risk-based control design.`
  },
  {
    icon: Target,
    title: 'Our Mission',
    description: `To establish practicable, adaptable compliance controls that are appropriate 
                  for the ever-evolving and intricate regulatory requirements.`
  }
];

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section id="features" className="py-12 sm:py-20 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 items-center mb-24"
        >
          <motion.div variants={itemVariants} className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 hover:scale-[1.02] transition-transform duration-500">
            <img
              src="/AML Dashboard Screen 1.png"
              alt="AML Controls Dashboard on MacBook"
              className="w-full h-auto"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">
              AML Controls for Regulated Businesses: <span className="text-primary">A Structured Approach</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              <span className="font-semibold">AML Meter</span> is a platform which is based on compliance technology, which is developed to help out regulated entities in the implementation of anti-money laundering and financial crime controls in accordance with a risk-based methodology.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              The AML policies are transformed into system-driven, actionable processes in critical regulatory focal areas, such as customer onboarding, due diligence, sanctions and PEP screening, risk assessment, and record-keeping, by our platform.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 items-center mb-32"
        >
          <motion.div variants={itemVariants} className="order-1 md:order-2 relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 hover:scale-[1.02] transition-transform duration-500">
            <img
              src="/AML Dashboard Screen 1.png"
              alt="AML Compliance Dashboard"
              className="object-cover w-full h-full"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">
              Specifically Built for <span className="text-primary">AML-Regulated Environments</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Professionals with direct experience in AML compliance operations, quality assurance, and regulatory review exposure have developed AML Meter by putting their years of expertise into one platform.
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              It encompasses a practitioner-led design that guarantees the following:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-slate-600 text-sm">The reasoning of the system matches what regulators want and what supervisors say.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-slate-600 text-sm">Automation improves how controls are carried out without lowering responsibility.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-slate-600 text-sm">It is possible to track and record every test result, escalation, and approval.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-slate-600 text-sm">Outputs that are already made for governmental reviews, internal audits, and independent reviews.</span>
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed italic">
              The platform prioritizes the consistency of application, governance, and control efficacy over non-essential functionality or broad feature sets.
            </p>
          </motion.div>
        </motion.div>

        <div id="about" className="scroll-mt-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="p-10 md:p-14 bg-primary border border-primary-foreground/10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/grid.svg')] bg-repeat" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-[100px] -ml-32 -mb-32" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-center mb-6 text-balance">
                About <span className="text-primary-foreground/80">AML Meter Management</span>
              </h2>
              <p className="text-center text-purple-50/90 max-w-4xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
                Over 25 Years of combined experience in the Industry around the globe,
                ACAMS-certified professionals with expertise in AML/CFT, sanctions compliance,
                and risk-based control frameworks have established AML Meter,
                a compliance advisory platform based in the United Arab Emirates.
                The firm provides structured AML program design, implementation support,
                and compliance governance advisory.
              </p>
              <div className="grid lg:grid-cols-3 gap-6 mt-12">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex flex-col items-center text-center group p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/[0.15] hover:border-white/50 hover:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-2 shadow-inner"
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xl border border-white/10">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-foreground/90 transition-colors duration-300 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

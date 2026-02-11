'use client';

import { Award, Compass, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const featuresList = [
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
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <section className="relative z-20 -mt-12 sm:-mt-16 overflow-hidden">
      <div className="bg-white rounded-t-[3rem] sm:rounded-t-[4rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.08)] border-t border-white/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-24 relative">
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
          </div>

          <div className="space-y-24 md:space-y-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-20 items-center"
            >
              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/15 to-transparent blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 bg-white shadow-2xl backdrop-blur-sm group-hover:shadow-primary/20 transition-all duration-500">
                  <img
                    src="/AML Dashboard Screen 1.png"
                    alt="AML Controls Dashboard"
                    className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  AML Controls for Regulated Businesses: <span className="text-primary">A Structured Approach</span>
                </h2>
                <div className="space-y-5">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">AML Meter</span> is a compliance technology platform developed to help regulated entities implement anti-money laundering and financial crime controls.
                  </p>
                  <p className="text-base text-slate-600 leading-relaxed">
                    The platform transforms AML policies into system-driven, actionable processes in critical regulatory focal areas, such as customer onboarding, due diligence, sanctions and PEP screening, risk assessment, and record-keeping.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid lg:grid-cols-[42%_58%] gap-12 lg:gap-20 items-center"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                  Specifically Built for <br className="hidden xl:block" />
                  <span className="text-primary">AML-Regulated Environments</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  Professionals with direct experience in AML compliance operations have developed AML Meter by putting their years of expertise into one platform.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-10">
                <div className="space-y-6">
                  <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-bold">
                    It encompasses a practitioner-led design that guarantees:
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      "The reasoning of the system matches what regulators want and what supervisors say.",
                      "Automation improves how controls are carried out without lowering responsibility.",
                      "It is possible to track and record every test result, escalation, and approval.",
                      "Outputs that are already made for governmental reviews, internal audits, and independent reviews.",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-slate-600 font-medium text-sm leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 p-7 rounded-2xl rounded-tl-none border border-primary/10 border-l-[6px] border-l-primary shadow-sm relative overflow-hidden lg:max-w-[95%]">
                  <p className="relative z-10 text-slate-700 text-sm md:text-base leading-relaxed italic font-medium">
                    "The platform prioritizes the consistency of application, governance, and control efficacy over non-essential functionality or broad feature sets."
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <div id="about" className="scroll-mt-24">
              <div className="p-8 md:p-16 lg:p-20 bg-primary rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-repeat" />
                <div className="relative z-10 text-center space-y-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight"
                  >
                    About <span className="text-white/80">AML Meter Management</span>
                  </motion.h2>
                  <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                    Over 25 years of combined global experience in AML/CFT, sanctions compliance, and risk frameworks.
                    Based in the UAE, we provide structured support and advisory for regulated entities.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 pt-8">
                    {featuresList.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all text-center"
                      >
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-sm text-white/80 leading-relaxed">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

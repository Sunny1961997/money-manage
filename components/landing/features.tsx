'use client';

import { Zap, Smartphone, Code2, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Our Expertise',
    description: `Our team possesses a wealth of experience in the UAE financial services regulatory environment, 
                  utilizing structured, risk-based compliance practices to assist regulated entities in comprehending and 
                  addressing their AML, sanctions, and risk management obligations.`
  },
  {
    icon: Smartphone,
    title: 'Our Approach',
    description: `Our advisory and implementation support are customized to fit the changing regulations, 
                  with a focus on the consistent application of risk-based control design.`
  },
  {
    icon: Code2,
    title: 'Our Mission',
    description: `To establish practicable, adaptable compliance controls that are appropriate 
                  for the ever-evolving and intricate regulatory requirements.`
  }
];

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <img
              src="/AML Dashboard Screen 1.png"
              alt="AML Controls Dashboard on MacBook"
              className="w-full h-auto"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              AML Controls for Regulated Businesses: A Structured Approach
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              AML Meter is a platform which is based on compliance technology, which is developed to help out regulated entities in the implementation of anti-money laundering and financial crime controls in accordance with a risk-based methodology.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The AML policies are transformed into system-driven, actionable processes in critical regulatory focal areas, such as customer onboarding, due diligence, sanctions and PEP screening, risk assessment, and record-keeping, by our platform.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="order-1 md:order-2 relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <img
              src="/AML Dashboard Screen 1.png"
              alt="AML Compliance Dashboard"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Specifically Built for AML-Regulated Environments
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Professionals with direct experience in AML compliance operations, quality assurance, and regulatory review exposure have developed AML Meter by putting their years of expertise into one platform.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              It encompasses a practitioner-led design that guarantees the following:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">The reasoning of the system matches what regulators want and what supervisors say.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Automation improves how controls are carried out without lowering responsibility.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">It is possible to track and record every test result, escalation, and approval.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Outputs that are already made for governmental reviews, internal audits, and independent reviews.</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed italic">
              The platform prioritizes the consistency of application, governance, and control efficacy over non-essential functionality or broad feature sets.
            </p>
          </div>
        </div>

        <div id="about" className="scroll-mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4 text-balance">
            About AML Meter Management
          </h2>
          <p className="text-center  max-w-4xl mx-auto mb-16">
            Over 25 Years of combined experience in the Industry around the globe,
            ACAMS-certified professionals with expertise in AML/CFT, sanctions compliance,
            and risk-based control frameworks have established AML Meter,
            a compliance advisory platform based in the United Arab Emirates.
            The firm provides structured AML program design, implementation support,
            and compliance governance advisory to assist regulated entities in meeting
            regulatory requirements with a few clicks.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

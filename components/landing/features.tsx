'use client';

import { Zap, Smartphone, Code2 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Our Expertise',
    description: `Our team specializes in navigating the complex regulatory landscape of the UAE's Financial Services
                  Industry. We take pride in bringing the deep industry expertise, enabling business leaders to develop
                  a deep understanding of the unique compliance and risk management challenges faced.`
  },
  {
    icon: Smartphone,
    title: 'Our Approach',
    description: `We provide expert guidance and tailored consultancy services to help businesses navigate regulatory
                  requirements efficiently. Our solutions are customized to staying ahead of regulatory changes.`
  },
  {
    icon: Code2,
    title: 'Our Mission',
    description: `We are dedicated to ensuring our clients meet industry and regulatory standards, mitigating risks and
                  maintaining compliance. Our goal is to help our clients to navigate the complex regulatory
                  environments.`
  }
];

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4 text-balance">
          About AML Meter Management
        </h2>
        <p className="text-center  max-w-4xl mx-auto mb-16">
          AML Management Solutions LLC, based in the UAE, specializes in Compliance Consultancy services. Founded
          by ACAMS-certified professionals with extensive knowledge and experience in Anti-Money Laundering (AML)/CFT,
          sanctions compliance, and managing a dedicated risk-based approach- navigates complex regulatory landscapes
          and provides enhanced AML/CFT solutions and consultancy frameworks.
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
    </section>
  );
}

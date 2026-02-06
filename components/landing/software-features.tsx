'use client';

import { ArrowRight } from 'lucide-react';

const coreCompliance = [
  {
    title: 'AML Screening',
    description: 'Screen for sanctions, PEP/RCAs, and adverse media.'
  },
  {
    title: 'AML Monitoring',
    description: 'Detect criminal patterns in real-time and post-event.'
  },
  {
    title: 'AML Risk Scoring',
    description: 'Identify high-risk customers.'
  }
];

const intelligenceSharing = [
  {
    title: 'AML Bridge',
    description: 'Send and receive intelligence. Launch collaborative investigations.'
  }
];

function FeatureCard({
  title,
  description,
  variant = 'default'
}: {
  title: string;
  description: string;
  variant?: 'default' | 'tinted';
}) {
  return (
    <div
      className={[
        'relative h-full min-h-[240px] rounded-xl p-6 flex flex-col justify-between transition-shadow hover:shadow-lg',
        variant === 'tinted'
          ? 'bg-sky-100/50' 
          : 'bg-gray-50/50 border border-gray-100 shadow-sm'
      ].join(' ')}
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export function SoftwareFeatures() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive compliance and intelligence tools designed to protect your business
          </p>
        </div>

        {/* Layout mimicking the screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Core Compliance Group (Spans 3/4) */}
          <div className="lg:col-span-3">
            <div className="relative pt-6 h-full">
              {/* Label overlapping the border */}
              <div className="absolute -top-3 left-0 bg-white pr-4 z-10">
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                  Core Compliance
                </span>
              </div>
              
              {/* Dashed Border Container */}
              <div className="h-full border-t-2 border-l-2 border-r-2 border-dashed border-green-500 rounded-t-xl pt-8 px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {coreCompliance.map((item, index) => (
                    <FeatureCard
                      key={index}
                      title={item.title}
                      description={item.description}
                      variant="default"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Sharing Group (Spans 1/4) */}
          <div className="lg:col-span-1">
            <div className="relative pt-6 h-full">
              {/* Label overlapping the border */}
              <div className="absolute -top-3 left-0 bg-white pr-4 z-10">
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                  Intelligence Sharing
                </span>
              </div>

              {/* Dashed Border Container */}
              <div className="h-full border-t-2 border-l-2 border-r-2 border-dashed border-green-500 rounded-t-xl pt-8 px-4 pb-4">
                <div className="h-full">
                  {intelligenceSharing.map((item, index) => (
                    <FeatureCard
                      key={index}
                      title={item.title}
                      description={item.description}
                      variant="tinted"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
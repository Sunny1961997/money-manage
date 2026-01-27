'use client';

import { Check } from 'lucide-react';

const features = [
  'KYC Review and Verification',
  'Client on-boarding form',
  'KYC documents verification',
  'Full service MLRO support',
  'Screening against 100+ sanctions lists',
  'CDD, KYC File',
  'Enterprise-wide risk assessment',
  'Product/Service risk assessments',

];

export function SoftwareFeatures() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg h-80 flex items-center justify-center border-2xl">
            <img
              src="/AML Dashboard Screen 2.png"
              alt="Theme Preview"
              className="w-full h-auto block"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">
              Software Features
            </h2>
            <p className="text-muted-foreground mb-8">
              Simply dummy text of the Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

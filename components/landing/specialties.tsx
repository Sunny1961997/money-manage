'use client';

import { Monitor, Palette, Type, Code, Smartphone, Zap, ImageIcon, Play } from 'lucide-react';

const specialties = [
  { icon: Monitor, title: 'High Resolution Output', description: 'Pixel-perfect designs and crisp rendering ensure your applications look stunning on any display.' },
  { icon: Palette, title: 'Advanced Color Systems', description: 'Sophisticated color palette management with accessibility compliance and theming support.' },
  { icon: Type, title: 'Typography Excellence', description: 'Integrated Google Fonts and professional typography system for beautiful, readable content.' },
  { icon: Code, title: 'Clean Code Architecture', description: 'Well-structured, maintainable codebase following industry best practices and standards.' },
  { icon: Smartphone, title: 'Responsive Design', description: 'Fully responsive layouts that adapt beautifully to all screen sizes and devices.' },
  { icon: Zap, title: 'Lightning Performance', description: 'Optimized for speed with efficient rendering and minimal bundle sizes.' },
  { icon: ImageIcon, title: 'Rich Media Support', description: 'Seamless integration of images, videos, and multimedia content.' },
  { icon: Play, title: 'Smooth Animations', description: 'GPU-accelerated animations and transitions for polished user interactions.' },
];

export function Specialties() {
  return (
    <section id="specialties" className="py-16 sm:py-24 bg-white scroll-mt-32 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-balance text-slate-900">
          AML Meter Specialties
        </h2>
        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-12 text-lg">
          We combine cutting-edge technology with thoughtful design to deliver powerful, accessible, and beautiful web experiences. Every feature is crafted with precision and purpose.
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-900">
                  {specialty.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {specialty.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

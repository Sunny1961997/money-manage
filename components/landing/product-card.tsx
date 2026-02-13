'use client';

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface ProductProps {
    title: string;
    description: string;
    icon: LucideIcon;
    primary_characteristics?: string[];
    features?: string[];
}

export function ProductCard({ product }: { product: ProductProps }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasFeatures = product.features && product.features.length > 0;
    const Icon = product.icon;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 flex flex-col h-full group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 inline-block">
                    <div className="p-3.5 bg-primary/5 rounded-2xl inline-flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors duration-300 tracking-tight">{product.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-medium opacity-80 text-justify">{product.description}</p>

                <div className="space-y-4">
                    {product.primary_characteristics && (
                        <div className="mb-6">
                            <p className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Primary Characteristics</p>
                            <ul className="space-y-2.5">
                                {product.primary_characteristics.map((char, idx) => (
                                    <li key={idx} className="flex items-start group/item">
                                        <span className="text-primary mr-3 mt-1 bg-primary/10 rounded-full p-0.5">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-slate-600 group-hover/item:text-slate-900 transition-colors">{char}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {hasFeatures && (
                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <div>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center text-primary font-semibold hover:text-primary/80 transition-colors focus:outline-none mb-2 text-sm w-full justify-between"
                            >
                                <span>{isExpanded ? 'Hide Key Features' : 'View Key Features'}</span>
                                <svg
                                    className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                            >
                                <div className="overflow-hidden">
                                    <ul className="space-y-2 pb-2 mt-4">
                                        {product.features!.map((feature, idx) => (
                                            <li key={idx} className="flex items-start group/item">
                                                <span className="text-primary mr-3 mt-1 bg-primary/10 rounded-full p-0.5">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                <span className="text-slate-600 group-hover/item:text-slate-900 transition-colors">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

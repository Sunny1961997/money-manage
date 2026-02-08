'use client';

import { useState } from 'react';

interface ProductProps {
    title: string;
    description: string;
    icon: string;
    primary_characteristics?: string[];
    features?: string[];
}

export function ProductCard({ product }: { product: ProductProps }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasFeatures = product.features && product.features.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            <div className="text-5xl mb-4">{product.icon}</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">{product.title}</h3>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="space-y-4">
                {product.primary_characteristics && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Primary Characteristics:</h4>
                        <ul className="space-y-2">
                            {product.primary_characteristics.map((char, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-primary mr-2">✓</span>
                                    <span className="text-gray-600">{char}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hasFeatures && (
                    <div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center text-primary font-semibold hover:underline focus:outline-none mb-2"
                        >
                            <span>{isExpanded ? 'Hide Key Features' : 'View Key Features'}</span>
                            <svg
                                className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <h4 className="font-semibold text-gray-900 mb-2 mt-2">Key Features:</h4>
                                <ul className="space-y-2 pb-2">
                                    {product.features!.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="text-primary mr-2">✓</span>
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

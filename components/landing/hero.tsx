import Link from "next/link";

export function Hero() {
  return (
    <section id="home" className="bg-gradient-to-b from-primary via-primary to-primary/80 text-white py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="w-25 h-25 border-2 border-white rounded flex items-center justify-center mb-8">
          {/* <span className="text-3xl font-bold">AML</span> */}
          <img
            src="/aml_meter_transparent.png"
            alt="AML Meter"
          // className="h-20 w-auto object-contain" 
          />
        </div>
        <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white mb-8 backdrop-blur-sm">
          <span className="font-medium">AML Compliance Made Easy for DNFBPs</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
          AML Compliance, Simplified for Regulated Businesses in UAE
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-2xl">
          AML Meter is an all-in-one customer onboarding, screening, and adverse media monitoring platform built
          for UAE-regulated firms. Specially designed with <span className="text-white font-semibold">DNFBPs</span>
          in mind, which helps institutions adopt a risk-based approach, document every decision, and stay audit-ready,
          without overcomplicating compliance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/contact-us">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-100 hover:text-black transition-all duration-200 shadow-lg">
              Request a Demo
            </button>
          </Link>
          <Link href="/products">
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-200">
              Get Started Now
            </button>
          </Link>
        </div>
        {/* <p className="text-sm text-white/70 mt-6">Currently on 3.2.1 patch 4</p> */}
      </div>
    </section>
  );
}
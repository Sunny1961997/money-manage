import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary via-primary to-primary/80 text-white py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 border-2 border-white rounded flex items-center justify-center mb-8">
          <span className="text-3xl font-bold">AML</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
          AML Management Solutions
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-2xl">
          Streamline your anti-money laundering processes with our cutting-edge solutions. Stay compliant, reduce
                risks, and protect your business.
        </p>
        <Link href="/login">
        <button className="bg-white text-primary px-8 py-3 rounded font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg">
          Get Started
        </button>
        </Link>
        {/* <p className="text-sm text-white/70 mt-6">Currently on 3.2.1 patch 4</p> */}
      </div>
    </section>
  );
}

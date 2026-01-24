import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-gradient-to-r from-primary via-primary to-primary/85 text-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-balance">
          Advanced AML Screening Tool
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Our comprehensive AML compliance solution provides real-time screening against global sanctions databases,
              ensuring your business regulators for highest standards of compliance.
        </p>
        <Link href="/login">
        <button className="bg-white text-primary px-10 py-3 rounded font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg">
          Get Started Now
        </button>
        </Link>
      </div>
    </section>
  );
}

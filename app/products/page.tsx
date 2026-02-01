import { Header } from "@/components/landing/header";
import Link from "next/link";

export default function Products() {
  const products = [
    {
      title: "Sanction Screening",
      description: "Real-time screening against global sanction lists to ensure compliance with international regulations.",
      features: [
        "Automated screening processes",
        "Multi-jurisdictional coverage",
        "Real-time alerts and notifications",
        "Comprehensive audit trails"
      ],
      icon: "🛡️"
    },
    {
      title: "Transaction Monitoring",
      description: "Advanced monitoring system to detect suspicious activities and potential money laundering patterns.",
      features: [
        "AI-powered pattern recognition",
        "Customizable risk rules",
        "24/7 automated monitoring",
        "Detailed reporting and analytics"
      ],
      icon: "📊"
    },
    {
      title: "Customer Due Diligence",
      description: "Comprehensive KYC and CDD tools to verify customer identities and assess risk levels.",
      features: [
        "Identity verification",
        "Risk assessment scoring",
        "Document verification",
        "Ongoing monitoring"
      ],
      icon: "👤"
    },
    {
      title: "Regulatory Reporting",
      description: "Streamlined reporting tools to meet regulatory requirements and maintain compliance.",
      features: [
        "Automated report generation",
        "Multi-format exports",
        "Regulatory updates",
        "Compliance dashboards"
      ],
      icon: "📝"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/80 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Comprehensive AML solutions designed to keep your organization compliant, secure, and efficient.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-5xl mb-4">{product.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{product.title}</h3>
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today to learn how our AML solutions can help your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us">
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition">
                Request a Demo
              </button>
            </Link>
            <Link href="/">
              <button className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
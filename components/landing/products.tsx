import Link from "next/link";

export function Products() {
  const products = [
    {
      title: "Name Screening",
      description: "Real-time screening against global lists to ensure compliance with international regulations.",
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
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Solution</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive AML solutions designed to keep your organization compliant, secure, and efficient.
          </p>
        </div>

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

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShieldCheck,
  Target,
  Users,
  FileText,
  Search,
  ClipboardCheck,
  BarChart3,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import Header from "./header"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      {/* <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#2563EB] text-white p-1 rounded">
              <span className="font-bold text-sm">WM</span>
            </div>
            <span className="font-semibold text-sm">Winnow MS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm hover:text-[#2563EB]">
              Home
            </Link>
            <Link href="#about" className="text-sm hover:text-[#2563EB]">
              About
            </Link>
            <Link href="#services" className="text-sm hover:text-[#2563EB]">
              Services
            </Link>
            <Link href="#contact" className="text-sm hover:text-[#2563EB]">
              Contact
            </Link>
            <Link href="#" className="text-sm hover:text-[#2563EB]">
              News Room
            </Link>
          </nav>
          <Link href="/login">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">Get Started</Button>
          </Link>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="bg-[#2563EB] rounded-3xl p-16 shadow-xl">
                <div className="text-white text-center">
                  <div className="text-6xl font-bold mb-2">WM</div>
                  <div className="text-xl font-semibold tracking-wider">SOLUTIONS</div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-6 text-balance">Winnow Management Solutions</h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Streamline your anti-money laundering processes with our cutting-edge solutions. Stay compliant, reduce
                risks, and protect your business.
              </p>
              <Link href="/login">
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-lg px-8 py-6">Get Started →</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6">About Winnow Management Solutions LLC</h2>
          <p className="text-center text-slate-300 max-w-4xl mx-auto mb-16">
            Winnow Management Solutions LLC, based in the UAE, specializes in Compliance Consultancy services. Founded
            by ACAMS-certified professionals with extensive knowledge and experience in Anti-Money Laundering (AML)/CFT,
            sanctions compliance, and managing a dedicated risk-based approach- navigates complex regulatory landscapes
            and provides enhanced AML/CFT solutions and consultancy frameworks.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <div className="bg-[#2563EB] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Our Expertise</h3>
                <p className="text-slate-300 text-sm">
                  Our team specializes in navigating the complex regulatory landscape of the UAE's Financial Services
                  Industry. We take pride in bringing the deep industry expertise, enabling business leaders to develop
                  a deep understanding of the unique compliance and risk management challenges faced.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <div className="bg-[#2563EB] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Our Approach</h3>
                <p className="text-slate-300 text-sm">
                  We provide expert guidance and tailored consultancy services to help businesses navigate regulatory
                  requirements efficiently. Our solutions are customized to staying ahead of regulatory changes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <div className="bg-[#2563EB] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
                <p className="text-slate-300 text-sm">
                  We are dedicated to ensuring our clients meet industry and regulatory standards, mitigating risks and
                  maintaining compliance. Our goal is to help our clients to navigate the complex regulatory
                  environments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2563EB] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Elevate Your Compliance Strategy?</h2>
          <p className="text-white/90 mb-8">
            Let's work together to ensure your business meets and exceeds regulatory obligations.
          </p>
          <Button variant="outline" className="bg-white text-[#2563EB] hover:bg-gray-100 px-8">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Products and Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Our Products and Services</h2>
          <p className="text-center text-muted-foreground mb-12">
            Comprehensive compliance solutions for your business
          </p>

          {/* Laptop Mockup */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              <img
                src="/laptop-mockup-showing-aml-compliance-dashboard.jpg"
                alt="Product Dashboard"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">AML Compliance Advisor</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tailored action based on your requirements</li>
                  <li>• Customised AML/CFT Policies/Procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">AML/CFT Policy/Procedures</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Creating Policy Suite, manuals and policies</li>
                  <li>• Industry and best practice</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Users className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">MLRO Services</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full service MLRO support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Search className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">Sanction Screening Tool</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Screening against 100+ sanctions lists</li>
                  <li>• CDD, KYC File</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <ClipboardCheck className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">KYC Review and Verification</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Client on-boarding form</li>
                  <li>• KYC documents verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">Risk Assessment</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Enterprise-wide risk assessment</li>
                  <li>• Product/Service risk assessments</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">Available as Mandatory Regulation in Country</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• FATF, regulation</li>
                  <li>• Country specific</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">Periodic Inspection Assistance</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full Cycle inspection, Compliance reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Users className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold">AML Training</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Regulatory training and onboarding</li>
                  <li>• Training to Board and Management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced AML Screening Tool */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="bg-[#2563EB] w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Advanced AML Screening Tool</h2>
            <p className="text-muted-foreground">
              Our comprehensive AML compliance solution provides real-time screening against global sanctions databases,
              ensuring your business regulators for highest standards of compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="bg-blue-50 px-4 py-2 rounded-full inline-block mb-2">
                <span className="text-sm font-semibold text-[#2563EB]">100+ Sanctions Lists</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 px-4 py-2 rounded-full inline-block mb-2">
                <span className="text-sm font-semibold text-[#2563EB]">Real-time Monitoring</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 px-4 py-2 rounded-full inline-block mb-2">
                <span className="text-sm font-semibold text-[#2563EB]">Automated Compliance</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="font-medium">Comprehensive Sanction Database</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="font-medium">PEP Check</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Search className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="font-medium">Adverse Media Check</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="font-medium">Ongoing Monitoring</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="font-medium">Saved Posting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Enhance Your AML Compliance Strategy?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's work together to ensure your business meets and exceeds global AML/CFT requirements with our
            innovative solutions.
          </p>
          <Link href="/login">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8">Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#2563EB] text-white p-2 rounded">
                  <span className="font-bold">WM</span>
                </div>
                <span className="font-semibold">Winnow Management Solutions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Winnow MS is a provider of an advanced and cutting-edge anti-money laundering compliance solution. Your
                trusted partner toward compliance learning.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Regus Business Centre, Sharjah Media City (Shams), Al Messaned, Al Bataeh, Sharjah, United Arab
                  Emirates
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-[#2563EB]" />
                <span className="text-muted-foreground">+971-50-7447807</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-[#2563EB]" />
                <span className="text-muted-foreground">support@winnowms.com</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 All rights reserved Winnow MS v2.0. All rights reserved
          </div>
        </div>
      </footer>
    </div>
  )
}

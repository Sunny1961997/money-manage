'use client';

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"

export function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        message: formData.message,
        company_name: null,
        phone: null,
        contact_type: 'General',
        is_seen: false
      };

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Submission Failed",
          description: data.message || "Failed to submit request.",
          // variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message Sent",
        description: data.message || "Thank you for contacting us.",
        // variant: "default",
        className: "bg-green-600 text-white border-green-600"
      });

      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Could not send message. Please try again.",
        // variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-16 sm:py-24 border-t border-slate-100 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12 text-balance">
          Connect with Our Team
        </h2>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <input
              type="email"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* ...existing code... (Address/Socials unchanged) */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Headquarters</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  B.C. 1300531 Ajman Free Zone C1 Building Ajman Free Zone<br />
                  <br />
                  United Arab Emirates
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  +971 509627076  <br />
                  +971 562953927  <br />
                  +971 588961136  <br />
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  info@amlmeter.com<br />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/amlmeter/posts/?feedView=all" target='_blank' className="text-muted-foreground hover:text-primary transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
'use client';

import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you shortly.",
        // variant: "default",
        className: "bg-green-600 text-white border-none"
      });

      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Could not send message. Please try again later.",
        // variant: "destructive"
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: "B.C. 1300531 Ajman Free Zone C1 Building Ajman Free Zone, United Arab Emirates",
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: ["+971 509627076", "+971 562953927"].join("\n"),
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@amlmeter.com",
    }
  ];

  return (
    <section id="contact" className="relative py-16 md:py-24 overflow-hidden bg-slate-50/50 scroll-mt-20">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/10 bg-primary/5 text-sm font-semibold text-primary mb-6"
          >
            Contact Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Connect with <span className="text-primary">Our Team</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto text-justify"
          >
            Have questions about AML Meter solutions? Our team is ready to help you navigate
            compliance requirements with clarity and confidence.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 order-2 lg:order-1"
          >
            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
              <CardContent className="p-7 sm:p-10 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2.5">
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="h-14 px-6 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-2xl bg-slate-50 border-none"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="h-14 px-6 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-2xl bg-slate-50 border-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-14 px-6 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-2xl bg-slate-50 border-none"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Textarea
                      id="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[160px] p-6 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-2xl bg-slate-50 border-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-16 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* ...existing code... (Address/Socials unchanged) */}
          <div className="lg:col-span-2 space-y-8 order-1 lg:order-2">
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-slate-200/50 shadow-xl shadow-slate-200/20 flex flex-col h-full">
              <div className="space-y-10 flex-grow">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    className="flex gap-5 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon className="size-6" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-lg font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium opacity-90 text-justify">
                        {item.details}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12 pt-8 border-t border-slate-200/50"
              >
                <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                      <p className="text-xl font-bold">Need Immediate Help?</p>
                      <p className="text-slate-400 text-sm leading-relaxed text-justify">
                        Our support team is available during business hours for urgent inquiries.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-primary hover:bg-white hover:text-primary rounded-xl font-bold w-full transition-all duration-300"
                    >
                      <a href="tel:+971509627076" className="flex items-center justify-center gap-2">
                        <Phone className="size-5" />
                        Call Support Now
                      </a>
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>
              </motion.div>
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

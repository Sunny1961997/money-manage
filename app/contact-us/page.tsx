'use client';

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";// Assuming hook location based on components/ui/toaster

export default function ContactUs() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        contact_type: 'Request for Demo',
        is_seen: false
      };

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();

      if (!res.ok) {
        let errorMessage = "Failed to submit request.";
        
        // Safely extract error message
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.errors) {
          // Flatten validation errors: { names: ["Required"] } -> "Required"
          errorMessage = Object.values(data.errors).flat().join(', ');
        } else if (typeof data.message === 'object') {
           // If backend returns object in message (rare but possible causes of crash)
           errorMessage = JSON.stringify(data.message);
        }

        toast({
            title: "Submission Failed",
            // Cast to String to prevent "Object not valid as React child" crash
            description: String(errorMessage), 
            // variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "We've received your request and will contact you shortly.",
        className: "bg-green-600 text-white border-green-600"
      });
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        company_name: '',
        phone: '',
        message: ''
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        // variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header mode="solid" />
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 sm:pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us For Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-justify">
            Interested in seeing how AML Meter can help your organization?
            <br />
            Fill out the form below and we'll get back to you soon.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-sm">First Name *</label>
                <input 
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">Last Name *</label>
                <input 
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">Work Email *</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">Company Name *</label>
              <input 
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
                required 
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">Phone Number</label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" 
                rows={5}
                placeholder="Tell us about your needs..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

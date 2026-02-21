'use client';

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { fallbackCountries } from "@/lib/countries";

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
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        console.log("Fetching countries from /api/countries...");
        const res = await fetch("/api/countries", { method: "GET", credentials: "include" });
        const payload = await res.json().catch(async () => ({ message: await res.text() }));
        console.log("Countries payload:", payload);

        if (!res.ok || !payload?.data?.countries?.length) {
          console.warn("API failed or empty, using fallback countries.");
          setCountries(fallbackCountries);
          return;
        }
        setCountries(payload.data.countries);
      } catch (e) {
        console.error("Countries load failed, using fallback:", e);
        setCountries(fallbackCountries);
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const countryCodes = countries.map(c => {
    const code = c.phoneCode?.startsWith('+') ? c.phoneCode : `+${c.phoneCode}`;
    return {
      value: code,
      label: `${code} (${c.name})`
    };
  }).filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

  const phonePreview = selectedCountryCode ? `${selectedCountryCode} ${formData.phone}`.trim() : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9\s-]/g, "");
    setFormData({ ...formData, phone: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        phone: phonePreview,
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
      setSelectedCountryCode("");
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Interested in seeing how AML Meter can help your organization?
            <br />
            Fill out the form below and we'll get back to you soon.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company Inc."
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="grid grid-cols-[50%_1fr] gap-3">
                <Combobox
                  options={countryCodes}
                  value={selectedCountryCode}
                  onValueChange={(value) => {
                    if (typeof value === "string") setSelectedCountryCode(value);
                  }}
                  placeholder={countriesLoading ? "Loading..." : "Code"}
                  searchPlaceholder="Search..."
                  emptyText="No code found."
                  className="h-11"
                />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputMode="tel"
                  placeholder="Local number"
                  className="h-11"
                />
              </div>
              {phonePreview && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Preview: {phonePreview}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about your needs..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white h-11 rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50"
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

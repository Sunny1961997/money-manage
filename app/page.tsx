import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Themes } from '@/components/landing/themes';
import { Specialties } from '@/components/landing/specialties';
import { SoftwareFeatures } from '@/components/landing/software-features';
import { CTA } from '@/components/landing/cta';
import { Contact } from '@/components/landing/contact';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Themes />
      <Specialties />
      <SoftwareFeatures />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
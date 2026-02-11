import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Themes } from '@/components/landing/themes';
import { Specialties } from '@/components/landing/specialties';
import { SoftwareFeatures } from '@/components/landing/software-features';
import { CTA } from '@/components/landing/cta';
import { Contact } from '@/components/landing/contact';
import { Footer } from '@/components/landing/footer';
import { Products } from '@/components/landing/products';
import { BookCallPopup } from '@/components/landing/book-call-popup';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { FaqsPreview } from '@/components/landing/faqs-preview';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-white" />
          <div
            className="absolute -top-[25%] -left-[10%] h-[140%] w-[120%] opacity-35 transform-gpu"
            style={{
              background: "linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.12) 50%, transparent 55%)",
              filter: "blur(70px)",
              transform: "rotate(-12deg)",
            }}
          />
          <div className="absolute top-0 right-0 h-[720px] w-[720px] rounded-full bg-white/10 blur-[160px] mix-blend-screen translate-x-1/3 -translate-y-1/3 transform-gpu" />
          <div className="absolute bottom-0 left-0 h-[640px] w-[640px] rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen -translate-x-1/4 translate-y-1/4 transform-gpu" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.2)_60%,transparent)]" />
        </div>
        <Hero />
        <Features />
      </section>
      <Products />
      {/* <Themes /> */}
      <Specialties />
      <SoftwareFeatures />
      <FaqsPreview />
      <CTA />
      <Contact />
      <Footer />
      <BookCallPopup />
      <ScrollToTop />
    </main>
  );
}

import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          {/* <div className="w-10 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
            AML
          </div>
          <span className="font-semibold text-foreground">Meter</span> */}
          <Link href="/">
            <img 
              src="/aml_meter_2.png" 
              alt="AML Meter" 
              className="h-20 w-auto object-contain" 
            />
          </Link>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            href="/" className="text-base font-semibold text-foreground hover:text-primary transition">Home
          </Link>
          <a
            href="#about" className="text-base font-semibold text-foreground hover:text-primary transition">About Us</a>
          {/* <a href="#themes" className="text-base font-semibold text-foreground hover:text-primary transition">Themes</a> */}
          <a href="#services" className="text-base font-semibold text-foreground hover:text-primary transition">Resources</a>
          <a href="#features" className="text-base font-semibold text-foreground hover:text-primary transition">Features</a>
          <a href="#contact" className="text-base font-semibold text-foreground hover:text-primary transition">Latest News</a>
        </nav>
        <div className="flex-1 flex justify-end gap-3 items-center">
          <Link
            href="/login"
            className="w-20 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm hover:bg-primary/90 transition"
          >
            Sign in
          </Link>
          <Link
            href="/contact-us"
            className="px-5 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm hover:bg-primary/90 transition"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
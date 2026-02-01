import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-10 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
            AML
          </div>
          <span className="font-semibold text-foreground">Meter</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            href="/" className="text-sm text-foreground hover:text-primary transition">Home
          </Link>
          <Link
            href="/products" className="text-sm text-foreground hover:text-primary transition">Products</Link>
          {/* <a href="#themes" className="text-sm text-foreground hover:text-primary transition">Themes</a> */}
          <a href="#services" className="text-sm text-foreground hover:text-primary transition">Resources</a>
          <a href="#features" className="text-sm text-foreground hover:text-primary transition">Features</a>
          <a href="#contact" className="text-sm text-foreground hover:text-primary transition">Latest News</a>
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
            className="px-5 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm hover:bg-blue-700 transition"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
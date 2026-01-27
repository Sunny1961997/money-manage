import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-10 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
            AML
          </div>
          <span className="font-semibold text-foreground">Meter</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a href="#home" className="text-sm text-foreground hover:text-primary transition">Home</a>
          <a href="#about" className="text-sm text-foreground hover:text-primary transition">About</a>
          {/* <a href="#themes" className="text-sm text-foreground hover:text-primary transition">Themes</a> */}
          <a href="#services" className="text-sm text-foreground hover:text-primary transition">Services</a>
          <a href="#features" className="text-sm text-foreground hover:text-primary transition">Features</a>
          <a href="#contact" className="text-sm text-foreground hover:text-primary transition">Contact</a>
        </nav>
        <div className="flex-1 flex justify-end">
          <Link
            href="/login"
            className="w-20 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

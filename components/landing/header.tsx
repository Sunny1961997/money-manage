import Link from "next/link";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center font-bold text-sm">
            AML
          </div>
          <span className="font-semibold text-foreground">Meter</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-sm text-foreground hover:text-primary transition">Home</a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition">About</a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition">Themes</a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition">Services</a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition">Features</a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition">Contact</a>
          <Link
            href="/login"
            className="text-sm text-foreground hover:text-primary transition text-sm text-foreground hover:text-primary transition"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

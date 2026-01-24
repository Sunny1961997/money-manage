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
            className="bg-primary text-primary-foreground hover:bg-primary/90border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-1 rounded-sm"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

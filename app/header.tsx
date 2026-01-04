"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export default function Header() {
    const NavLinks = () => (
        <>
            <Link href="/" className="text-sm hover:text-[#2563EB]">Home</Link>
            <Link href="#about" className="text-sm hover:text-[#2563EB]">About</Link>
            <Link href="#services" className="text-sm hover:text-[#2563EB]">Services</Link>
            <Link href="#contact" className="text-sm hover:text-[#2563EB]">Contact</Link>
            <Link href="#" className="text-sm hover:text-[#2563EB]">News Room</Link>
        </>
    );

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <div className="bg-[#2563EB] text-white p-1 rounded">
                        <span className="font-bold text-sm">WM</span>
                    </div>
                    <span className="font-semibold text-sm">Winnow MS</span>
                </div>

                {/* Desktop Navigation - Hidden on Mobile */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLinks />
                </nav>

                <div className="flex items-center gap-4">
                    {/* Auth Button - Visible on all screens */}
                    <Link href="/login">
                        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">Log in</Button>
                    </Link>

                    {/* Mobile Menu - Visible only on Mobile/Tablet */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle className="text-left m-4">Winnow MS</SheetTitle>
                                <nav className="flex flex-col gap-4 mt-8 ml-3">
                                    <NavLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Instagram, Twitter, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Videos", href: "/videos" },
  { name: "BTS", href: "/bts" },
  { name: "Booking", href: "/booking" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:contact@alizidan.com", label: "Email" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-6 right-6 md:left-12 md:right-12 z-50 flex items-center justify-between px-8 py-4 glass-morphism rounded-2xl"
    >

      <Link href="/" className="text-xl font-bold tracking-widest uppercase hover:text-primary transition-colors">
        ALI ZIDAN
      </Link>

      <nav className="hidden md:flex gap-8 items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.name}
          </Link>
        ))}
        <Button asChild size="sm" className="rounded-none px-6 font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/booking">Book Now</Link>
        </Button>
      </nav>

      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-primary/50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:w-[400px] bg-black/40 backdrop-blur-[80px] border-l border-white/10 p-0 overflow-hidden"
          >

            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation links for the website</SheetDescription>
            </SheetHeader>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <span className="text-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                ALI ZIDAN
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col p-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex items-center justify-between py-6 text-3xl font-black uppercase tracking-tighter transition-all duration-300 border-b border-white/5",
                      pathname === item.href
                        ? "text-primary text-glow"
                        : "text-white/60 hover:text-white hover:pl-2"
                    )}
                  >
                    <span>{item.name}</span>
                    <ArrowRight className={cn(
                      "w-6 h-6 transition-all duration-300",
                      pathname === item.href
                        ? "opacity-100 text-primary scale-125"
                        : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                    )} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-2xl font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary/90 h-16 text-xl shadow-[0_10px_40px_rgba(255,102,0,0.3)]"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/booking">
                    Book Now
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50"
            >
              <div className="flex items-center justify-center gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                © 2026 Ali Zidan. All rights reserved.
              </p>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}

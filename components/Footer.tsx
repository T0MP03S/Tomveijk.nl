'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Mail } from 'lucide-react'

const socialLinks = [
  { href: 'https://www.instagram.com/tompoeso/', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/tomveijknl/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:info@tomveijk.nl', icon: Mail, label: 'Email' },
]

const navLinks = [
  { href: '/#over-mij', label: 'Over mij' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#vaardigheden', label: 'Vaardigheden' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/logo.svg" alt="Tom van Eijk" width={120} height={40} className="h-10 w-auto" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Grafisch vormgever met passie voor innovatie. Van concept tot werkelijkheid.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/60">Navigatie</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/60">Socials</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Tom van Eijk. Alle rechten voorbehouden.
          </p>
          <p className="text-white/20 text-xs">
            Handgemaakt met Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}

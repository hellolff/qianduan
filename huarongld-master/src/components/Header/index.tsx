'use client';

import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import { Logo, DesktopNav, MobileMenuButton } from './HeaderParts';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Header() {
  const t = useTranslations('Navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'carSales', href: '/car-sales' },
    { key: 'autoParts', href: '/auto-parts' },
    { key: 'news', href: '/news' },
    { key: 'globalCooperation', href: '/global-cooperation' },
    { key: 'about', href: '/about' },
    { key: 'contactUs', href: '/contact-us' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
          : 'bg-transparent border-transparent'
      )}>
      <div className=' flex h-20 items-center justify-between px-4 md:px-6 xl:px-20 relative z-50 bg-white gap-8'>
        {/* Logo */}
        <Logo isScrolled={isScrolled} />

        {/* Right Side: Navigation & Actions */}
        <div className='flex items-center gap-6'>
          {/* Desktop Navigation */}
          <DesktopNav navItems={navItems} />

          {/* Actions */}
          <div className='flex items-center gap-4'>
            <div className='hidden md:block'>
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <MobileMenuButton isMenuOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && <MobileMenu navItems={navItems} onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
    </header>
  );
}

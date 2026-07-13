'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../i18n/navigation';
import { motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface NavItem {
  key: string;
  href: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  onClose: () => void;
}

export default function MobileMenu({ navItems, onClose }: MobileMenuProps) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const isNavigating = useRef(false);

  // Lock body scroll when component is mounted
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';

      if (!isNavigating.current) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      } else {
        window.scrollTo(0, 0);
      }
    };
  }, []);

  const handleNavClick = () => {
    isNavigating.current = true;
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='fixed inset-0 z-40 lg:hidden bg-white backdrop-blur-lg overflow-y-auto overscroll-none'>
      {/* Mobile Header Placeholder to prevent content from being hidden behind fixed header */}
      <div className='h-20' />

      <div className='min-h-[calc(100vh-5rem)] flex flex-col px-6'>
        <nav className='flex flex-col'>
          {navItems.map((item, index) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between py-4 border-b border-gray-100 text-xl font-semibold transition-colors',
                    isActive ? 'text-primary' : 'text-gray-800 hover:text-primary'
                  )}
                  onClick={handleNavClick}>
                  <span className='flex-1 pr-4'>{t(item.key)}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: navItems.length * 0.1 }}
          className='mt-2'>
          <LanguageSwitcher isMobile={true} />
        </motion.div>
      </div>
    </motion.div>
  );
}

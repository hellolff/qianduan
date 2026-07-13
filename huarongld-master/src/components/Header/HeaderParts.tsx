'use client';

import { Link, usePathname } from '../../i18n/navigation';
import { cn } from '../../lib/utils';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

// --- Logo Component ---

interface LogoProps {
  isScrolled: boolean;
}

export function Logo({ isScrolled }: LogoProps) {
  const t = useTranslations('Header');

  return (
    <div className='flex items-center gap-3'>
      <Link href='/' className='flex items-center gap-3 group'>
        <Image
          src='/images/logo_2.png'
          alt='HuaRong Logo'
          width={180}
          height={48}
          className='h-12 w-auto object-contain'
          priority
        />
      </Link>
      <div className='hidden xl:block'>{t('slogan')}</div>
    </div>
  );
}

// --- DesktopNav Component ---

interface NavItem {
  key: string;
  href: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
}

export function DesktopNav({ navItems }: DesktopNavProps) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  return (
    <nav className='hidden lg:flex items-center gap-1'>
      {navItems.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'relative px-4 py-2 text-fluid-xs font-medium transition-colors hover:text-primary',
              isActive ? 'text-primary' : 'text-gray-600'
            )}>
            {t(item.key)}
            {isActive && (
              <motion.div
                layoutId='navbar-indicator'
                className='absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full'
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                initial={false}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// --- MobileMenuButton Component ---

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isMenuOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      className={cn(
        'lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300',
        isMenuOpen ? 'bg-gray-100 text-gray-900' : 'bg-transparent text-gray-600 hover:bg-gray-50'
      )}
      onClick={onClick}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
      <div className='w-5 h-5 flex flex-col justify-center gap-1.5'>
        <motion.span
          animate={{
            rotate: isMenuOpen ? 45 : 0,
            y: isMenuOpen ? 8 : 0,
            width: isMenuOpen ? '100%' : '70%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='h-0.5 bg-current rounded-full origin-center self-end'
        />
        <motion.span
          animate={{
            opacity: isMenuOpen ? 0 : 1,
            scale: isMenuOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          className='w-full h-0.5 bg-current rounded-full'
        />
        <motion.span
          animate={{
            rotate: isMenuOpen ? -45 : 0,
            y: isMenuOpen ? -8 : 0,
            width: isMenuOpen ? '100%' : '50%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='h-0.5 bg-current rounded-full origin-center self-end'
        />
      </div>
    </button>
  );
}

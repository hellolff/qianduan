'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '../../i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locales = [
    { code: 'zh', name: '简体中文', region: '中国 | China', flag: '' },
    { code: 'en', name: 'English', region: 'Global', flag: '' },
    { code: 'es', name: 'Español', region: 'España', flag: '' },
    { code: 'ru', name: 'Русский', region: 'Россия', flag: '' },
  ];

  const currentLanguage = locales.find((l) => l.code === currentLocale) || locales[0];
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mobile View: Accordion Style (Referencing AVATR)
  if (isMobile) {
    return (
      <div className='w-full'>
        {/* Accordion Trigger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className='flex items-center justify-between w-full py-4 text-xl font-semibold text-gray-800 transition-colors border-b border-gray-100 group'>
          <div className='flex items-center gap-3'>
            <svg className='w-5 h-5 text-gray-800' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>{currentLanguage.name}</span>
          </div>
          <motion.span
            animate={{ rotate: isMobileOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className='text-gray-400'>
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </motion.span>
        </button>

        {/* Accordion Content */}
        <motion.div
          initial={false}
          animate={{ height: isMobileOpen ? 'auto' : 0, opacity: isMobileOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='overflow-hidden'>
          <div className='flex flex-col py-2'>
            {locales.map((locale) => (
              <Link
                key={locale.code}
                href={pathname}
                locale={locale.code}
                className='flex flex-col py-3 pl-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 active:bg-gray-50 transition-colors'
                onClick={() => setIsMobileOpen(false)}>
                <span
                  className={`text-sm ${
                    currentLocale === locale.code ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                  {locale.region}
                </span>
                <span
                  className={`text-base ${
                    currentLocale === locale.code ? 'text-gray-900 font-bold' : 'text-gray-700'
                  }`}>
                  {locale.name}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Desktop View: Dropdown
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 group'>
        <span className='text-sm font-medium group-hover:text-gray-900'>{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden'>
          {locales.map((locale) => (
            <Link
              key={locale.code}
              href={pathname}
              locale={locale.code}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                currentLocale === locale.code
                  ? 'text-primary bg-primary/5 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setIsOpen(false)}>
              <span className='flex items-center gap-2'>
                <span>{locale.flag}</span>
                <span>{locale.name}</span>
              </span>
              {currentLocale === locale.code && (
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

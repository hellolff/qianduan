'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('Footer');

  const quickLinks = [
    { name: t('link_home'), href: '/' },
    { name: t('link_about'), href: '/about' },
    { name: t('link_cases'), href: '/news' },
    { name: t('link_globalCooperation'), href: '/global-cooperation' },
  ];

  const serviceLinks = [
    { name: t('link_carSales'), href: '/car-sales' },
    { name: t('link_autoParts'), href: '/auto-parts' },
  ];

  return (
    <footer className='bg-[#1a1a1a] text-white pt-16 pb-8 z-10'>
      <div className='container-responsive'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          {/* Col 1: Brand & WeChat */}
          <div className='space-y-6'>
            <Link href='/' className='flex items-center gap-2'>
              <span className='text-base font-bold text-white'>{t('brandTitle')}</span>
            </Link>
            <p className='text-gray-400 text-xs leading-relaxed'>{t('description')}</p>
            <div className='pt-4'>
              <div className='bg-white p-2 inline-block rounded-lg mb-2'>
                <Image
                  src='/images/qrcode-wechat.png'
                  alt={t('wechat')}
                  width={96}
                  height={96}
                  className='w-24 h-24 object-contain'
                />
              </div>
              <p className='text-gray-400 text-xs pl-1'>{t('wechat')}</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <div className='text-sm font-bold text-white mb-6'>{t('quickLinks')}</div>
            <ul className='space-y-4'>
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className='text-gray-400 hover:text-white transition-colors text-xs'>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Service Areas */}
          <div>
            <div className='text-sm font-bold text-white mb-6'>{t('serviceAreas')}</div>
            <ul className='space-y-4'>
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className='text-gray-400 hover:text-white transition-colors text-xs'>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div>
            <div className='text-sm font-bold text-white mb-6'>{t('contact')}</div>
            <div className='space-y-4'>
              <div className='flex items-start gap-3 text-gray-400 text-xs'>
                <svg className='w-5 h-5 mt-0.5 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <span>{t('address')}</span>
              </div>
              <div className='flex items-center gap-3 text-gray-400 text-xs'>
                <svg className='w-5 h-5 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
                <a href={`tel:${t('phone')}`} className='hover:text-white transition-colors'>
                  {t('phone')}
                </a>
              </div>
              <div className='flex items-center gap-3 text-gray-400 text-xs'>
                <svg className='w-5 h-5 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                <a href={`mailto:${t('email')}`} className='hover:text-white transition-colors'>
                  {t('email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-center items-center gap-4'>
          <div className='text-xs text-gray-500'>
            {t('copyright')}
            <a href='https://beian.mps.gov.cn/#/query/webSearch?code=50011202505136' rel='noreferrer' target='_blank'>
              渝公网安备50011202505136号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CooperativeDealers() {
  const t = useTranslations('GlobalCooperation.CooperativeDealers');

  return (
    <section className='py-20 bg-white'>
      <div className='container-responsive'>
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-20'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='lg:w-1/2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-blue-900'>{t('title')}</h2>
            </div>

            <div className='mb-4'>
              <span className='text-gray-500 text-lg block mb-1'>{t('subtitle')}</span>
              <span className='text-6xl font-bold text-blue-600 block'>{t('count')}</span>
            </div>

            <p className='text-gray-600 text-lg leading-relaxed'>{t('desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg'>
            <Image
              src='/images/cooperation/rectangle.png' // Placeholder
              alt='Cooperative Dealers'
              fill
              className='object-cover'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

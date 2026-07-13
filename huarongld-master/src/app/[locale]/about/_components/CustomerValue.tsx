'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function CustomerValue() {
  const t = useTranslations('About.CustomerValue');

  const cards = ['team_power', 'rich_sources', 'cost_reduction', 'efficiency', 'service_first'] as const;

  const stats = [
    { value: '24', label: t('bottom_banner.stats.quote') },
    { value: '48', label: t('bottom_banner.stats.response') },
    { value: '100%', label: t('bottom_banner.stats.guarantee') },
  ];

  return (
    <section className='w-full bg-white py-20'>
      <div className='container-responsive mx-auto'>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 whitespace-pre-line leading-tight'>
            {t('title')}
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-20'>
          {cards.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
              <div className='h-12 w-12 bg-blue-600 rounded-lg mb-6 flex items-center justify-center'>
                {/* Icons based on key */}
                {key === 'team_power' && (
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                )}
                {key === 'rich_sources' && (
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                )}
                {key === 'cost_reduction' && (
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                )}
                {key === 'efficiency' && (
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                )}
                {key === 'service_first' && (
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                )}
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>{t(`cards.${key}.title`)}</h3>
              <p className='text-gray-600 leading-relaxed whitespace-pre-line'>{t(`cards.${key}.description`)}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='w-full mx-auto py-12 bg-[#F7F9FC] '>
          <div className='text-center mb-16'>
            <div className='text-xl text-gray-600 leading-relaxed'>{t('bottom_banner.text')}</div>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-12 md:gap-24'>
            {stats.map((stat, index) => (
              <div key={index} className='flex items-baseline gap-2'>
                <span className='text-2xl xl:text-3xl font-bold text-slate-700 leading-none font-sans'>
                  {stat.value}
                </span>
                <span className='text-base text-slate-600 font-medium'>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GlobalDistributionMap() {
  const t = useTranslations('AutoParts.GlobalMap');

  const stats = [
    { value: '5', label: t('stats.middle_east') },
    { value: '8', label: t('stats.latin_america') },
    { value: '3', label: t('stats.africa') },
    { value: '4', label: t('stats.southeast_asia') },
  ];

  return (
    <section className='py-20 bg-white'>
      <div className='container-responsive'>
        <div className='flex flex-col md:flex-row justify-between items-start mb-16'>
          <h2 className='text-3xl font-bold text-gray-900'>{t('title')}</h2>
          <span className='text-gray-400 text-sm mt-2 md:mt-0'>{t('subtitle')}</span>
        </div>

        <div className='flex flex-col lg:flex-row items-center gap-20'>
          {/* Map Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='w-full lg:w-[70%]'>
            <div className='relative w-full aspect-[2/1]'>
              <Image
                src='/images/auto-parts/区域分解.png'
                alt='Global Distribution Map'
                fill
                className='object-contain'
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='w-full lg:w-[30%] grid grid-cols-2 gap-x-16 gap-y-12'>
            {stats.map((stat, index) => (
              <div key={index} className='flex flex-col'>
                <div className='flex items-baseline'>
                  <span className='text-4xl font-bold text-gray-900'>{stat.value}</span>
                  <span className='text-sm text-gray-500 ml-1'>家</span>
                </div>
                <span className='text-gray-600 mt-2'>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

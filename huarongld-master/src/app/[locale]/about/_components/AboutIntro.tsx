'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutIntro() {
  const t = useTranslations('About');

  const stats = [
    { value: '60+', label: t('stats.dealers') },
    { value: '68', label: t('stats.countries') },
    { value: '9999+', label: t('stats.exports') },
    { value: '20W+', label: t('stats.parts') },
    { value: '7年', label: t('stats.years') },
  ];

  return (
    <div className='w-full bg-white py-20'>
      <div className='container-responsive mx-auto'>
        {/* Video Banner Section */}
        <div className='relative w-full mb-16 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer'>
          {/* Video Element */}
          <video
            className='w-full h-auto block'
            src='/images/about/huarong.mp4#t=0.001'
            controls
            playsInline
            preload='metadata'
          />
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-8 mb-16'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='flex flex-col items-center text-center'>
              <span className='text-2xl font-bold text-[#0F172A] mb-2 font-mono'>{stat.value}</span>
              <span className='text-sm md:text-base text-[#2563EB] font-bold'>{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}>
          <p className='text-gray-600 text-sm md:text-base leading-loose'>{t('intro_description')}</p>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CompanyIntro() {
  const t = useTranslations('CompanyIntro');

  const stats = [
    { value: '60+', label: t('stat_dealers_label') },
    { value: '38', label: t('stat_countries_label') },
    { value: '5000+', label: t('stat_export_label') },
    { value: '20万+', label: t('stat_parts_label') },
  ];

  return (
    <div className='w-full bg-white py-20'>
      <div className='container-responsive mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-2xl 2xl:text-3xl font-bold text-[#0F172A] mb-4'>
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-base 2xl:text-lg text-gray-500'>
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Content Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative w-full aspect-4/3 md:aspect-16/10 shadow-xl overflow-hidden group'>
            <Image
              src='/images/home/shop.jpg'
              alt={t('image_caption')}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
            />
            {/* Caption Bar */}
            <div className='absolute bottom-0 left-0 w-full bg-[#001529] py-4 text-center'>
              <span className='text-white tracking-wide'>{t('image_caption')}</span>
            </div>
          </motion.div>

          {/* Right: Text & Stats */}
          <div className='flex flex-col justify-between h-full py-4'>
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='text-gray-600 text-base leading-loose text-justify mb-12'>
              {t('description')}
            </motion.p>

            {/* Stats Row */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className='flex flex-col items-center lg:items-start'>
                  <span className='text-xl 2xl:text-2xl font-bold text-[#1F2937] mb-2'>{stat.value}</span>
                  <span className='text-sm 2xl:text-base text-[#2563EB] font-medium'>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

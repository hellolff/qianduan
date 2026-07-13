'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, MapPin, Users, Heart } from 'lucide-react';

export default function GlobalNetwork() {
  const t = useTranslations('GlobalNetwork');

  const stats = [
    {
      icon: <Globe className='w-6 h-6 text-[#0F172A]' />,
      value: '56+',
      label: t('stat_countries'),
    },
    {
      icon: <MapPin className='w-6 h-6 text-[#0F172A]' />,
      value: '12+',
      label: t('stat_outlets'),
    },
    {
      icon: <Users className='w-6 h-6 text-[#0F172A]' />,
      value: '5,251,021+',
      label: t('stat_partners'),
    },
    {
      icon: <Heart className='w-6 h-6 text-[#0F172A]' />,
      value: '95.8%',
      label: t('stat_satisfaction'),
    },
  ];

  return (
    <section className='w-full py-20 bg-[#F4F8FF]'>
      <div className='container-responsive mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-2xl 2xl:text-3xl font-bold text-[#0F172A] mb-6'>
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-base 2xl:text-lg text-[#334155] max-w-5xl mx-auto leading-relaxed'>
            {t('description')}
          </motion.p>
        </div>

        {/* Map Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='relative w-full  mx-auto mb-20'>
          <div className='relative aspect-2/1 w-full'>
            <div className='h-[400px]'></div>
            <Image src='/images/home/global.png' alt='Global Network Map' fill className='object-contain' priority />
          </div>
        </motion.div>

        {/* Stats */}
        <div className='flex flex-col gap-6 lg:flex-row lg:justify-between max-w-7xl mx-auto'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className='flex items-center gap-4 bg-transparent'>
              <div className='w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0'>
                {stat.icon}
              </div>
              <div className='flex flex-col'>
                <div className='text-xl 2xl:text-2xl font-bold text-[#0F172A]'>{stat.value}</div>
                <div className='text-sm 2xl:text-base text-gray-500 font-medium'>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

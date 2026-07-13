'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

export default function Solutions() {
  const t = useTranslations('Solutions');

  const cards = [
    {
      id: 1,
      image: '/images/home/solution_vehicle.png',
      title: t('card1_title'),
      description: t('card1_desc'),
      linkText: t('card1_link'),
      href: '/car-sales',
    },
    {
      id: 2,
      image: '/images/home/solution_parts.png',
      title: t('card2_title'),
      description: t('card2_desc'),
      linkText: t('card2_link'),
      href: '/auto-parts',
    },
  ];

  return (
    <section className='w-full py-20 bg-linear-to-b from-[#F0F6FF] to-[#E6F0FF]'>
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

        {/* Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              viewport={{ once: true }}
              className='bg-white rounded-2xl overflow-hidden flex flex-col'>
              {/* Image */}
              <div className='relative w-full aspect-video overflow-hidden'>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className='object-cover transition-transform duration-700 hover:scale-105'
                />
              </div>

              {/* Content */}
              <div className='p-8 flex flex-col grow'>
                <h3 className='text-xl font-bold text-[#0F172A] mb-4'>{card.title}</h3>
                <div className='grow mb-8'>
                  <p className='text-gray-600 leading-relaxed line-clamp-2'>{card.description}</p>
                </div>

                <Link
                  href={card.href}
                  className='inline-flex items-center self-center text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors group'>
                  {card.linkText}
                  <svg
                    className='w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

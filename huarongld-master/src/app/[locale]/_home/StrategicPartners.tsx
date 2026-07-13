'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PARTNERS = [
  { id: 1, src: '/images/partner/logo_1.png', alt: 'Changan Minsheng Logistics' },
  { id: 2, src: '/images/partner/logo_2.png', alt: 'Sanyang Ma Logistics' },
  { id: 3, src: '/images/partner/logo_3.png', alt: 'Sinotrans' },
  { id: 4, src: '/images/partner/logo_4.png', alt: 'China Import and Export Group' },
];

export default function StrategicPartners() {
  const t = useTranslations('StrategicPartners');

  return (
    <section className='w-full py-16 bg-[#F8F9FA]'>
      <div className='container-responsive mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
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
            className='text-base 2xl:text-lg text-gray-500 max-w-5xl mx-auto'>
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Partners Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto'>
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-center justify-center h-32 md:h-40 border border-gray-100'>
              <div className='relative w-full h-full'>
                <Image src={partner.src} alt={partner.alt} fill className='object-contain p-2' />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

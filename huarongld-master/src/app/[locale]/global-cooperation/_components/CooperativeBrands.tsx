'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CooperativeBrands() {
  const t = useTranslations('GlobalCooperation.CooperativeBrands');

  // Placeholder images - using partner logos for now
  const brands = [
    { id: 1, name: 'Livan', src: '/images/partner/brand_img_1.png' },
    { id: 2, name: 'Deepal', src: '/images/partner/brand_img_2.png' },
    { id: 3, name: 'Avatr', src: '/images/partner/brand_img_3.png' },
    { id: 4, name: 'BYD', src: '/images/partner/brand_img_4.png' },
    { id: 5, name: 'Hongqi', src: '/images/partner/brand_img_5.png' },
    { id: 6, name: 'Toyota', src: '/images/partner/brand_img_6.png' },
    { id: 7, name: 'FAW', src: '/images/partner/brand_img_7.png' },
    { id: 8, name: 'BAIC', src: '/images/partner/brand_img_8.png' },
  ];

  return (
    <section className='py-20 bg-blue-50/50'>
      <div className='container-responsive'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900'>{t('title')}</h2>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className='bg-white rounded-xl p-8 flex items-center justify-center h-40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
              <div className='relative w-full h-full'>
                <Image src={brand.src} alt={brand.name} fill className='object-contain' />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

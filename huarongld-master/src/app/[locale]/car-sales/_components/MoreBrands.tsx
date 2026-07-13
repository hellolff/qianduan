'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

const brands = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  img: `/images/partner/brand_img_${i + 1}.png`,
  alt: `Brand ${i + 1}`,
}));

export default function MoreBrands() {
  const t = useTranslations('CarSales.more_brands');

  return (
    <section className='w-full py-16 bg-white'>
      <div className='container-responsive'>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-4'>
          <h2 className='text-2xl font-bold text-gray-900'>{t('title')}</h2>
          <p className='text-gray-500 text-base max-w-2xl '>{t('subtitle')}</p>
        </div>

        {/* Brands Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {brands.map((brand) => (
            <div
              key={brand.id}
              className='bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex items-center justify-center h-48'>
              <div className='relative w-32 h-32'>
                <Image src={brand.img} alt={brand.alt} fill className='object-contain' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

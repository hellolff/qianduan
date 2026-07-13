'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Flame, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import CarCard from './CarCard';
import { brandService, BrandCarSeries } from '@/services/api';

export default function BrandModels() {
  const t = useTranslations('CarSales.brand_models');
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await brandService.getCarModelList();
        if (res.code === 200 && Array.isArray(res.data)) {
          const mappedBrands = res.data.map((item: BrandCarSeries) => ({
            id: item.brandId,
            name: item.brandName,
            logo: item.brandImage || '/images/partner/logo_1.png', // Fallback
            cars:
              item.seriesList?.slice(0, 3).map((series, idx) => ({
                id: `${item.brandId}-car-${idx}`,
                name: series.carSeriesName,
                image: series.carSeriesImage || '/images/home/banner_1.png', // Fallback
                rating: Number(series.score) || 5,
                features: series.carSeriesFeatures ? series.carSeriesFeatures.split(',') : [],
              })) || [],
            hotList:
              item.modelList?.map((model) => ({
                type: model.newStatus === 'YES' ? 'NEW' : 'HOT', // Prioritize NEW, default to HOT or check hotStatus
                text: model.carModelName,
              })) || [],
          }));
          setBrands(mappedBrands);
        }
      } catch (error) {
        console.error('Failed to fetch brand models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className='w-full py-16 bg-white'>
      <div className='container-responsive'>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-gray-100 pb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>{t('title')}</h2>
          <p className='text-gray-500 text-base max-w-2xl'>{t('subtitle')}</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='w-10 h-10 text-gray-400 animate-spin' />
          </div>
        ) : brands.length > 0 ? (
          <div className='space-y-16'>
            {brands.map((brand) => (
              <div key={brand.id} className='flex flex-col gap-6'>
                {/* Top Row: Logo Card + Cars Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {/* Logo Card */}
                  <div className='bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col justify-center items-center p-6 h-full'>
                    <div className='relative w-40 h-40 mb-4'>
                      <Image src={brand.logo} alt={brand.name} fill className='object-contain' />
                    </div>
                  </div>

                  {/* Cars */}
                  {brand.cars.map((car: any) => (
                    <div key={car.id} className='min-w-0'>
                      <CarCard car={car} />
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Hot List */}
                <div className='space-y-3'>
                  {brand.hotList.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className='flex items-center gap-3 text-sm md:text-base text-gray-700 font-medium hover:text-[#002B49] cursor-pointer transition-colors'>
                      {item.type === 'NEW' ? (
                        <Image
                          src='/images/car-sales/new.png'
                          alt='NEW'
                          width={32}
                          height={16}
                          className='object-contain w-8'
                        />
                      ) : (
                        <Flame className='w-5 h-5 text-orange-500 fill-orange-500' />
                      )}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-64 text-gray-400'>{t('no_data')}</div>
        )}
      </div>
    </section>
  );
}

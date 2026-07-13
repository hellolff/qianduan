'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CarCard from './CarCard';
import { carSeriesService, CarSeries } from '@/services/api';

export default function RecommendedModels() {
  const t = useTranslations('CarSales.recommended_models');

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        // Using object for params similar to NewsInsights.tsx
        const res = await carSeriesService.getList({ recStatus: 'YES' });
        if (res.code === 200 && Array.isArray(res.data)) {
          const mappedCars = res.data.map((item: CarSeries, index: number) => ({
            id: String(index),
            name: item.carSeriesName,
            image: item.carSeriesImage, // Fallback image similar to NewsInsights
            rating: Number(item.score),
            features: item.carSeriesFeatures ? item.carSeriesFeatures.split(',') : [],
          }));
          setCars(mappedCars);
        }
      } catch (error) {
        console.error('Failed to fetch recommended cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
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
        ) : cars.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {cars.map((car, index) => (
              <div key={index} className='min-w-0'>
                <CarCard car={car} />
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

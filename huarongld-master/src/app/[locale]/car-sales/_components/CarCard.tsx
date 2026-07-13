'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import QuoteModal from './QuoteModal';

interface Car {
  id: string;
  name: string;
  image: string;
  rating: number;
  features: string[];
}

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const t = useTranslations('CarSales.latest_models');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Helper to render stars
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < count ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col'>
      {/* Image Area */}
      <div className='relative w-full aspect-[4/3] bg-gray-100 overflow-hidden'>
        <Image
          src={car.image}
          alt={car.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
      </div>

      {/* Content */}
      <div className='space-y-4 p-4'>
        {/* Stars */}
        <div className='flex gap-0.5'>{renderStars(car.rating)}</div>

        {/* Title */}
        <h4 className='text-lg font-bold text-gray-900'>{car.name}</h4>

        {/* Features */}
        <div className='text-xs text-gray-400 flex flex-wrap gap-x-2'>
          {car.features.map((feature, idx) => (
            <span key={idx} className='flex items-center'>
              {feature}
              {idx < car.features.length - 1 && <span className='mx-2 text-gray-300'>|</span>}
            </span>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className='w-full text-gray-900 py-2.5 rounded-lg text-sm transition-opacity hover:opacity-90 cursor-pointer'
          style={{ background: 'linear-gradient(270deg, #F8DF98 0%, #EDC96F 100%)' }}>
          {t('get_quote')}
        </button>
      </div>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} carName={car.name} />
    </div>
  );
}

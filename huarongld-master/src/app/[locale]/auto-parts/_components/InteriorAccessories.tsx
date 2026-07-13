'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { interiorService, InteriorCategory } from '@/services/api';

export default function InteriorAccessories() {
  const t = useTranslations('AutoParts.InteriorAccessories');
  const [activeTab, setActiveTab] = useState('');
  const [categories, setCategories] = useState<InteriorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 }, [Autoplay()]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await interiorService.getList();
        if (res.code === 200 && res.data && res.data.length > 0) {
          setCategories(res.data);
          setActiveTab(res.data[0].categoryId);
        }
      } catch (error) {
        console.error('Failed to fetch interior accessories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const currentCategory = categories.find((c) => c.categoryId === activeTab);
  const products = currentCategory ? currentCategory.list : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleTabClick = (categoryId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(categoryId);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <section className='py-20 bg-white'>
      <div className='container-responsive'>
        <div className='flex flex-col md:flex-row justify-between items-start mb-12'>
          <h2 className='text-3xl font-bold text-gray-900'>{t('title')}</h2>
          <span className='text-gray-400 text-sm mt-2 md:mt-0'>{t('subtitle')}</span>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-900' />
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className='flex items-center gap-4 mb-8 md:mb-16'>
              <button
                onClick={() => scroll('left')}
                className='flex-none p-2 bg-white text-blue-900 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors hidden md:flex items-center justify-center'
                aria-label='Scroll left'>
                <ChevronLeft className='w-5 h-5' />
              </button>

              <div
                ref={scrollContainerRef}
                className='flex-1 flex overflow-x-auto gap-2 md:gap-4 py-2 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth'>
                {categories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={(e) => handleTabClick(category.categoryId, e)}
                    className={clsx(
                      'px-4 md:px-6 py-2 rounded text-xs md:text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0',
                      activeTab === category.categoryId
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-900'
                    )}>
                    {category.categoryName}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scroll('right')}
                className='flex-none p-2 bg-white text-blue-900 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors hidden md:flex items-center justify-center'
                aria-label='Scroll right'>
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>

            {/* Content */}
            <div className='flex items-center gap-6'>
              {/* Slider Left Button */}
              <button
                onClick={scrollPrev}
                className='hidden lg:flex flex-none w-12 h-12 bg-blue-900 text-white items-center justify-center rounded-full hover:bg-blue-800 transition-colors shadow-lg'>
                <ChevronLeft className='w-6 h-6' />
              </button>

              <div className='flex-1 overflow-hidden min-w-0' ref={emblaRef}>
                <div className='flex -ml-6'>
                  {products.map((product, index) => (
                    <div className='flex-[0_0_100%] min-w-0 pl-6' key={index}>
                      <div className='relative aspect-[21/9] bg-gray-50 rounded-lg overflow-hidden group'>
                        <Image
                          src={product.coverImage || '/images/home/shop.jpg'}
                          alt={product.name}
                          fill
                          className='object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80' />
                        <div className='absolute bottom-6 left-6 text-white'>
                          <h4 className='font-bold text-xl md:text-2xl tracking-wide'>{product.name}</h4>
                          <div className='h-1 w-12 bg-blue-500 mt-3 rounded-full' />
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className='flex-[0_0_100%] pl-6'>
                      <div className='text-center text-gray-400 py-10'>No products available in this category.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slider Right Button */}
              <button
                onClick={scrollNext}
                className='hidden lg:flex flex-none w-12 h-12 bg-blue-900 text-white items-center justify-center rounded-full hover:bg-blue-800 transition-colors shadow-lg'>
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className='flex justify-center gap-4 mt-8 lg:hidden'>
              <button
                onClick={scrollPrev}
                className='w-10 h-10 bg-blue-900 text-white flex items-center justify-center rounded-full hover:bg-blue-800 transition-colors'>
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={scrollNext}
                className='w-10 h-10 bg-blue-900 text-white flex items-center justify-center rounded-full hover:bg-blue-800 transition-colors'>
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

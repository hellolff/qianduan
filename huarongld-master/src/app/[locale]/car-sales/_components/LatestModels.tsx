'use client';

import { useTranslations, useFormatter } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CarCard from './CarCard';
import { carSeriesService, CarSeries } from '@/services/api';

export default function LatestModels() {
  const t = useTranslations('CarSales.latest_models');
  const format = useFormatter();

  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 'auto' }, // Tablet/Desktop scroll by "page"
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevBtnEnabled(api.canScrollPrev());
    setNextBtnEnabled(api.canScrollNext());
  }, []);

  const updateScrollSnaps = useCallback((api: any) => {
    const snaps = api.scrollSnapList();
    setScrollSnaps((prev) => {
      if (prev.length === snaps.length && prev.every((snap: number, i: number) => snap === snaps[i])) {
        return prev;
      }
      return snaps;
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    // Avoid synchronous setState warning by deferring initial update
    const onInit = () => {
      onSelect(emblaApi);
      updateScrollSnaps(emblaApi);
    };
    setTimeout(onInit, 0);

    emblaApi.on('reInit', onSelect);
    emblaApi.on('reInit', updateScrollSnaps);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onSelect);
      emblaApi.off('reInit', updateScrollSnaps);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect, updateScrollSnaps]);

  // Fetch data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await carSeriesService.getList({ newStatus: 'YES' });
        if (res.code === 200 && Array.isArray(res.data)) {
          const mappedCars = res.data.map((item: CarSeries, index: number) => ({
            id: String(index),
            name: item.carSeriesName,
            image: item.carSeriesImage,
            rating: Number(item.score) || 5,
            features: item.carSeriesFeatures ? item.carSeriesFeatures.split(',') : [],
          }));
          setCars(mappedCars);
        }
      } catch (error) {
        console.error('Failed to fetch car series:', error);
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
        <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-4'>
          <h2 className='text-2xl font-bold text-gray-900'>{t('title')}</h2>
          <p className='text-gray-500 text-base max-w-2xl '>{t('subtitle')}</p>
        </div>

        {/* Main Content Container (Dark Blue) */}
        <div className='bg-[#002B49] rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl overflow-hidden'>
          {/* Header inside blue box */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4'>
            <div className='flex flex-wrap items-center justify-start gap-2'>
              {/* 循环3个标签 */}
              {[1, 2, 3].map((item, index) => (
                <Image
                  key={index}
                  src='/images/car-sales/new.png'
                  alt='NEW'
                  width={28}
                  height={28}
                  className='object-contain'
                />
              ))}
              <h3 className='text-white text-lg md:text-xl font-bold'>
                {format.dateTime(new Date(), { year: 'numeric', month: 'long', day: 'numeric' })} {t('library_title')}
              </h3>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='flex items-center gap-2 px-4 py-2 bg-white text-[#002B49] rounded-full text-sm font-medium transition-colors hover:bg-gray-100'>
              <span>{isExpanded ? t('collapse_view_more') : t('expand_view_more')}</span>
              {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
            </button>
          </div>

          {/* Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='overflow-hidden'>
                {loading ? (
                  <div className='flex justify-center items-center h-64'>
                    <Loader2 className='w-10 h-10 text-white animate-spin' />
                  </div>
                ) : cars.length > 0 ? (
                  <div>
                    {/* Embla Viewport */}
                    <div className='overflow-hidden -mx-6 px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10 pt-8' ref={emblaRef}>
                      <div className='grid grid-rows-1 md:grid-rows-2 grid-flow-col gap-6 auto-cols-[85%] sm:auto-cols-[45%] lg:auto-cols-[23%]'>
                        {cars.map((car, index) => (
                          <div key={index} className='min-w-0'>
                            <CarCard car={car} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination / Arrows */}
                    <div className='flex justify-center items-center w-full gap-4 mt-8'>
                      <button
                        className='p-2 rounded-full border border-white/20 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
                        onClick={scrollPrev}
                        disabled={!prevBtnEnabled}
                        aria-label='Previous slide'>
                        <ChevronLeft className='w-5 h-5' />
                      </button>

                      <div className='flex gap-2 md:gap-3'>
                        {scrollSnaps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                              selectedIndex === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        className='p-2 rounded-full border border-white/20 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
                        onClick={scrollNext}
                        disabled={!nextBtnEnabled}
                        aria-label='Next slide'>
                        <ChevronRight className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex justify-center items-center h-64 text-white/50'>{t('no_data')}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

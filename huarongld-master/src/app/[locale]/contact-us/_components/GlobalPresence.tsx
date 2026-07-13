'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import { Flag, MapPin, User, Mail, Phone } from 'lucide-react';
import { companyService, CompanyLocation } from '@/services/api';

export function GlobalPresence() {
  const t = useTranslations('ContactUs.global_presence');
  const [locations, setLocations] = useState<CompanyLocation[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: false,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await companyService.getList();
        if (res.code === 200) {
          setLocations(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch company locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className='py-20 bg-white overflow-hidden'>
      <div className='container-responsive'>
        {/* Title */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl 2xl:text-3xl font-bold text-[#14358A] leading-tight mb-4 '>{t('title_1')}</h2>
          <h2 className='text-2xl 2xl:text-3xl font-bold text-[#14358A] leading-tight'>{t('title_2')}</h2>
        </div>

        {/* Map */}
        <div className='relative w-full aspect-[2/1] md:aspect-[2.5/1] mx-auto mb-8'>
          <Image src='/images/contact/world.png' alt='World Map' fill className='object-contain' />
        </div>

        {/* Carousel */}
        <div className='relative mx-auto px-4 md:px-12'>
          <div className='overflow-hidden py-6 -my-6' ref={emblaRef}>
            <div className='flex -ml-6'>
              {locations.map((loc, index) => (
                <div key={index} className='flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-6'>
                  <div className='bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-shadow border border-gray-100 h-full flex flex-col'>
                    {/* Header Icon */}
                    <div className='w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30'>
                      <Flag className='w-6 h-6' />
                    </div>

                    <h3 className='text-xl font-bold text-[#0F172A] mb-6'>{loc.companyName}</h3>

                    <div className='space-y-4 flex-grow'>
                      {/* Contact */}
                      <div className='flex items-start gap-3 text-sm'>
                        <div className='w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5'>
                          <User className='w-4 h-4' />
                        </div>
                        <div className='text-gray-600 break-words [overflow-wrap:anywhere]'>{loc.contact}</div>
                      </div>

                      {/* Email */}
                      <div className='flex items-start gap-3 text-sm'>
                        <div className='w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5'>
                          <Mail className='w-4 h-4' />
                        </div>
                        <div className='text-gray-600 break-all'>{loc.contactEmail}</div>
                      </div>

                      {/* Phone */}
                      <div className='flex items-start gap-3 text-sm'>
                        <div className='w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5'>
                          <Phone className='w-4 h-4' />
                        </div>
                        <div className='text-gray-600'>{loc.contactPhone}</div>
                      </div>

                      {/* Address */}
                      <div className='flex items-start gap-3 text-sm'>
                        <div className='w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5'>
                          <MapPin className='w-4 h-4' />
                        </div>
                        <div className='text-gray-600 break-words [overflow-wrap:anywhere]'>{loc.address}</div>
                      </div>
                    </div>

                    {/* Button Removed as per image */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev Arrow */}
          <button
            onClick={scrollPrev}
            className='hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Previous slide'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='m15 18-6-6 6-6' />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            onClick={scrollNext}
            className='hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Next slide'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='m9 18 6-6-6-6' />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className='flex justify-center items-center gap-2 mt-8'>
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'bg-[#2563EB] w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

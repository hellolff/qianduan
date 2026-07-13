'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';

import Image from 'next/image';

export default function HeroCarousel() {
  const t = useTranslations('Home');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const slides = [
    {
      id: 1,
      image: '/images/home/banner_1.png',
      title: t('slide1_title'),
      description: t('slide1_desc'),
    },
    {
      id: 2,
      image: '/images/home/banner_2.png',
      title: t('slide2_title'),
      description: t('slide2_desc'),
    },
    {
      id: 3,
      image: '/images/home/banner_3.png',
      title: t('slide3_title'),
      description: t('slide3_desc'),
    },
    {
      id: 4,
      image: '/images/home/banner_4.png',
      title: t('slide4_title'),
      description: t('slide4_desc'),
    },
  ];

  return (
    <div className='relative w-full h-screen overflow-hidden bg-black'>
      <div className='overflow-hidden h-full' ref={emblaRef}>
        <div className='flex h-full touch-pan-y'>
          {slides.map((slide, index) => (
            <div className='flex-[0_0_100%] min-w-0 relative h-full' key={slide.id}>
              <Image src={slide.image} alt={slide.title} fill className='object-cover' priority={index === 0} />
              <div className='absolute inset-0 bg-black/40' /> {/* Overlay */}
              {/* Content */}
              <div className='relative h-full container-responsive flex flex-col justify-center text-white px-4'>
                {/* Only animate content when slide is active */}
                {index === selectedIndex && (
                  <div className='flex flex-col'>
                    <motion.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className='text-3xl 2xl:text-5xl font-bold mb-4 max-w-5xl whitespace-pre-wrap'>
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className='text-lg md:text-xl text-gray-200 max-w-3xl'>
                      {slide.description}
                    </motion.p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className='absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/80 hover:w-4'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

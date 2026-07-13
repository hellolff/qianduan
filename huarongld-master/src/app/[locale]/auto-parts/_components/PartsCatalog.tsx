'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { accessoryService, AccessoryCategory } from '@/services/api';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function PartsCatalog() {
  const t = useTranslations('AutoParts.PartsCatalog');
  const [activeTab, setActiveTab] = useState('');
  const [categories, setCategories] = useState<AccessoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await accessoryService.getList();
        if (res.code === 200 && res.data && res.data.length > 0) {
          setCategories(res.data);
          setActiveTab(res.data[0].categoryId);
        }
      } catch (error) {
        console.error('Failed to fetch accessories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentCategory = categories.find((c) => c.categoryId === activeTab);
  const displayParts = currentCategory ? currentCategory.list : [];

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
    <section className='py-10 md:py-20 bg-white'>
      <div className='container-responsive'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-2'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>{t('title')}</h2>
          <span className='text-gray-400 text-xs md:text-sm'>{t('subtitle')}</span>
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

            {/* Grid */}
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8'>
              {displayParts.map((part, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='group flex flex-col items-center cursor-pointer'>
                  <div className='relative w-full aspect-square mb-3 md:mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-white'>
                    <div className='relative w-[85%] h-[85%] group-hover:scale-110 transition-transform duration-300'>
                      <Image
                        src={part.coverImage || '/images/home/solution_parts.png'}
                        alt={part.name}
                        fill
                        className='object-contain'
                      />
                    </div>
                  </div>
                  <span className='text-xs md:text-sm font-bold text-blue-900 text-center px-2 group-hover:text-blue-700 transition-colors'>
                    {part.name}
                  </span>
                </motion.div>
              ))}
              {displayParts.length === 0 && (
                <div className='col-span-full text-center text-gray-400 py-10'>
                  No parts available in this category.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

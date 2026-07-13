'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { articleService } from '@/services/api';

interface NewsItem {
  id: string | number;
  image: string;
  title: string;
  description: string;
  date: string;
  href: string;
}

export default function NewsInsights() {
  const t = useTranslations('NewsInsights');
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await articleService.getIndustryNews(1, 3);
        if (res.code === 200) {
          const fetchedNews = res.data.records.map((item) => ({
            id: item.id,
            image: item.coverImage || '/images/home/banner_1.png', // Fallback image
            title: item.title || '',
            description: item.subtitle || '',
            date: item.publishDate || '',
            href: `/news/${item.id}`,
          }));
          setNews(fetchedNews);
        }
      } catch (error) {
        console.error('Error fetching industry news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className='w-full py-20 bg-[#0F2C5C] relative overflow-hidden'>
      {/* Dot Pattern Background */}
      {/* <div
        className='absolute inset-0 opacity-10 pointer-events-none'
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      /> */}

      <div className='container-responsive mx-auto px-4 relative z-10'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-2xl 2xl:text-3xl font-bold text-white mb-4'>
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-base 2xl:text-lg text-gray-300 max-w-4xl mx-auto'>
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              className='group bg-white rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300'>
              {/* Image */}
              <div className='relative w-full aspect-[16/9] overflow-hidden'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>

              {/* Content */}
              <div className='p-6 flex flex-col grow'>
                <h3 className='text-lg font-bold text-[#0F172A] mb-4 leading-tight group-hover:text-[#2563EB] transition-colors line-clamp-2'>
                  {item.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed mb-6 grow line-clamp-3'>{item.description}</p>

                {/* Footer */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100 mt-auto'>
                  <span className='text-xs text-gray-400'>{item.date}</span>
                  <Link
                    href={item.href}
                    className='inline-flex items-center text-[#2563EB] text-sm font-semibold hover:text-[#1D4ED8] transition-colors group/link'>
                    {t('read_more')}
                    <ArrowRight className='w-4 h-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1' />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <div className='text-center'>
          <Link
            href='/news'
            className='inline-block px-12 py-3 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#0F172A] font-bold rounded-md transition-colors duration-300 shadow-sm hover:shadow-md'>
            {t('view_more')}
          </Link>
        </div>
      </div>
    </section>
  );
}

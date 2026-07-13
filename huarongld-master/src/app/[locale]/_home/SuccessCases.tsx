'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { articleService } from '@/services/api';

interface CaseItem {
  id: string | number;
  image: string;
  category: string;
  title: string;
  description: string;
  date: string;
  href: string;
}

export default function SuccessCases() {
  const t = useTranslations('SuccessCases');
  const [cases, setCases] = useState<CaseItem[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await articleService.getSuccessCases(1, 2);
        if (res.code === 200) {
          const fetchedCases = res.data.records.map((item) => ({
            id: item.id,
            image: item.coverImage || '',
            category: item.orderSource,
            title: item.title || '',
            description: item.subtitle || '',
            date: item.publishDate || '',
            href: `/news/${item.id}`,
          }));
          setCases(fetchedCases);
        }
      } catch (error) {
        console.error('Error fetching success cases:', error);
      }
    };

    fetchCases();
  }, []);

  return (
    <section className='w-full py-20 bg-white'>
      <div className='container-responsive mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-16 px-4'>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-2xl 2xl:text-3xl font-bold text-[#0F172A] mb-6'>
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-base 2xl:text-lg text-gray-500 max-w-4xl mx-auto leading-relaxed'>
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16'>
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              viewport={{ once: true }}
              style={{ boxShadow: '8px 24px 96px 0px rgba(126, 138, 253, 0.08)' }}
              className='group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col'>
              {/* Image */}
              <div className='relative w-full aspect-video overflow-hidden'>
                <Image src={item.image} alt={item.title} fill className='object-cover' />
              </div>

              {/* Content */}
              <div className='p-8 flex flex-col grow'>
                <div className='text-sm text-gray-400 mb-3 font-medium tracking-wide min-h-[1.25rem] truncate'>
                  {item.category}
                </div>
                <h3 className='text-xl font-bold text-[#0F172A] mb-4 group-hover:text-[#2563EB] transition-colors truncate'>
                  {item.title}
                </h3>
                <p className='text-gray-600 leading-relaxed mb-6 grow line-clamp-2'>{item.description}</p>

                {/* Footer */}
                <div className='flex items-center justify-between pt-6 border-t border-gray-100 mt-auto'>
                  <div className='text-sm text-gray-400'>{item.date}</div>

                  <Link
                    href={item.href}
                    className='inline-flex items-center text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors group/link'>
                    {t('read_more')}
                    <svg
                      className='w-4 h-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                    </svg>
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
            className='inline-block px-12 py-4 bg-[#FCD34D] hover:bg-[#FBBF24] text-[#0F172A] font-bold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md'>
            {t('view_more')}
          </Link>
        </div>
      </div>
    </section>
  );
}

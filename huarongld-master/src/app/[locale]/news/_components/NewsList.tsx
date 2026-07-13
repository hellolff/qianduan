'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { articleService, Article } from '@/services/api';
import { Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function NewsList() {
  const t = useTranslations('News');
  const [activeTab, setActiveTab] = useState('success_case');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 9;

  const tabs = [
    { id: 'success_case', label: t('tabs.success_case') },
    { id: 'industry', label: t('tabs.industry') },
    { id: 'company', label: t('tabs.company') },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await articleService.getArticles({
          articleType: activeTab,
          size: itemsPerPage,
          current: currentPage,
          // recStatus: 'YES' // Optional: filter by recommended status if needed
        });

        if (res.code === 200) {
          setArticles(res.data.records);
          setTotalPages(res.data.pages);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeTab, currentPage]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const getDaysAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${t('days_ago')}`;
  };

  const FeaturedNews = ({ article }: { article: Article }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-12 group'>
      <div className='flex flex-col lg:flex-row h-full lg:h-[400px]'>
        {/* Content Side */}
        <div className='flex-1 p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1 min-w-0'>
          <h2 className='text-3xl lg:text-4xl font-bold text-blue-900 mb-6 group-hover:text-blue-700 transition-colors break-all'>
            {article.title}
          </h2>
          <p className='text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3 break-all'>
            {article.subtitle || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 150) : '')}
          </p>
          <div className='flex items-center justify-between mt-auto'>
            <span className='text-gray-400'>{getDaysAgo(article.publishDate || article.createTime)}</span>
            <Link
              href={`/news/${article.id}`}
              className='flex items-center text-blue-900 font-bold text-lg transition-colors group/link'>
              {t('read_more')}
              <ArrowRight className='w-5 h-5 ml-2 transition-transform duration-300 group-hover/link:translate-x-1' />
            </Link>
          </div>
        </div>

        {/* Image Side */}
        <Link
          href={`/news/${article.id}`}
          className='lg:w-[55%] relative h-[300px] lg:h-full order-1 lg:order-2 overflow-hidden cursor-pointer'>
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className='object-cover transform group-hover:scale-105 transition-transform duration-700'
              sizes='(max-width: 1024px) 100vw, 55vw'
              priority
            />
          ) : (
            <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
              <span className='text-6xl font-bold text-gray-200'>NEWS</span>
            </div>
          )}
          {/* Overlay */}
          <div className='absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300' />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <section className='py-16 bg-gray-50 min-h-[600px]'>
      <div className='container-responsive'>
        {/* Tabs */}
        <div className='flex justify-center mb-12'>
          <div className='flex space-x-8 md:space-x-16 border-b border-gray-200 w-full md:w-auto justify-center px-4'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={clsx(
                  'pb-4 text-lg font-medium transition-colors relative whitespace-nowrap',
                  activeTab === tab.id ? 'text-blue-900' : 'text-gray-500 hover:text-gray-700'
                )}>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId='activeTab' className='absolute bottom-0 left-0 right-0 h-1 bg-blue-900' />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='w-10 h-10 text-blue-900 animate-spin' />
          </div>
        ) : (
          <>
            {articles.length > 0 ? (
              <>
                {/* Featured News for Industry and Company tabs on first page */}
                {currentPage === 1 && ['industry', 'company'].includes(activeTab) && (
                  <FeaturedNews article={articles[0]} />
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                  {/* For featured tabs on first page, skip the first item */}
                  {(currentPage === 1 && ['industry', 'company'].includes(activeTab)
                    ? articles.slice(1)
                    : articles
                  ).map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full'>
                      {/* Image */}
                      <Link
                        href={`/news/${article.id}`}
                        className='relative h-56 overflow-hidden bg-gray-200 block cursor-pointer'>
                        {article.coverImage ? (
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className='object-cover transform group-hover:scale-110 transition-transform duration-500'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>
                            <span className='text-4xl font-bold opacity-20'>NEWS</span>
                          </div>
                        )}
                      </Link>

                      {/* Content */}
                      <div className='p-6 flex flex-col flex-grow'>
                        <div className='mb-3 text-xs text-gray-500 uppercase tracking-wider'>
                          {article.orderSource || tabs.find((t) => t.id === activeTab)?.label}
                        </div>

                        <Link href={`/news/${article.id}`} className='block'>
                          <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors break-all'>
                            {article.title}
                          </h3>
                        </Link>

                        <p className='text-gray-600 text-sm line-clamp-3 mb-6 flex-grow break-all'>
                          {article.subtitle ||
                            (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 100) : '')}
                        </p>

                        <div className='flex items-center justify-between pt-4 border-t border-gray-100 mt-auto'>
                          <span className='text-sm text-gray-400'>
                            {getDaysAgo(article.publishDate || article.createTime)}
                          </span>
                          <Link
                            href={`/news/${article.id}`}
                            className='flex items-center text-blue-900 font-medium text-sm transition-colors group/link'>
                            {t('read_more')}
                            <ArrowRight className='w-4 h-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1' />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className='text-center py-20 text-gray-500'>{t('no_data')}</div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 pb-8'>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      'w-8 h-8 flex items-center justify-center rounded border transition-colors text-sm',
                      currentPage === page
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'hover:bg-gray-50 border-gray-200'
                    )}>
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className='px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

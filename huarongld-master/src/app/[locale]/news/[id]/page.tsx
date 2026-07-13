'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { articleService, Article } from '@/services/api';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import PageBanner from '@/components/PageBanner';

interface NewsDetailProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function NewsDetail({ params }: NewsDetailProps) {
  const { id } = use(params);
  const t = useTranslations('News');
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, these would come from the API
  // For now, we'll simulate them or leave them null if API doesn't support them
  const [prevArticle, setPrevArticle] = useState<{ id: string; title: string } | null>(null);
  const [nextArticle, setNextArticle] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await articleService.getDetail(id);
        if (res.code === 200) {
          setArticle(res.data);
          // Note: If the API returns prev/next info, set it here
          if (res.data.prevResult) {
            setPrevArticle({
              id: res.data.prevResult.id,
              title: res.data.prevResult.title,
            });
          } else {
            setPrevArticle(null);
          }

          if (res.data.nextResult) {
            setNextArticle({
              id: res.data.nextResult.id,
              title: res.data.nextResult.title,
            });
          } else {
            setNextArticle(null);
          }
        } else {
          setError(res.msg || 'Failed to load article');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('An error occurred while fetching the article');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 pt-20'>
        <Loader2 className='w-10 h-10 text-blue-900 animate-spin' />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20 px-4'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>{error || t('no_data')}</h1>
        <Link href='/news' className='px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors'>
          {t('back_to_list')}
        </Link>
      </div>
    );
  }

  return (
    <main className='flex min-h-screen flex-col pt-20 bg-gray-50'>
      <PageBanner
        title={t('banner_title')}
        subtitle={t('banner_subtitle')}
        description={t('banner_desc')}
        image='/images/news/banner.png'
      />

      <article className='container-responsive py-12 md:py-20'>
        <div className='bg-white rounded-2xl shadow-sm p-6 md:p-12 mx-auto'>
          {/* Back Button */}
          <div className='mb-8'>
            <Link
              href='/news'
              className='inline-flex items-center text-gray-500 hover:text-blue-900 transition-colors group'>
              <ArrowLeft className='w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform' />
              {t('back_to_list')}
            </Link>
          </div>

          {/* Header */}
          <header className='mb-12 text-center border-b border-gray-100 pb-12'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight break-all'>
              {article.title}
            </h1>

            <div className='flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm md:text-base'>
              <div className='flex items-center'>
                <span className='font-medium mr-2'>{t('author')}:</span>
                <span>{article.author || '华融联大'}</span>
              </div>
              <div className='flex items-center'>
                <span className='font-medium mr-2'>{t('publish_time')}:</span>
                <span>{article.publishDate || article.createTime?.split(' ')[0]}</span>
              </div>
              <div className='flex items-center'>
                <span className='font-medium mr-2'>{t('views')}:</span>
                <span>{article.realClick || 0}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div
            className='prose prose-lg max-w-none text-gray-700 leading-relaxed break-all
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:mb-6 prose-p:leading-8
              prose-a:text-blue-900 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-sm prose-img:mx-auto prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-blue-900 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
              prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6'
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Navigation */}
          <div className='mt-16 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer group'>
              {prevArticle ? (
                <Link href={`/news/${prevArticle.id}`} className='block'>
                  <div className='text-sm text-gray-400 mb-2 group-hover:text-blue-900 transition-colors flex items-center'>
                    <ArrowLeft className='w-4 h-4 mr-1' />
                    {t('prev_post')}
                  </div>
                  <div className='text-gray-800 font-medium line-clamp-1'>{prevArticle.title}</div>
                </Link>
              ) : (
                <div className='text-gray-400'>
                  <div className='text-sm mb-2'>{t('prev_post')}</div>
                  <div>{t('no_more_posts')}</div>
                </div>
              )}
            </div>

            <div className='bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer group text-right'>
              {nextArticle ? (
                <Link href={`/news/${nextArticle.id}`} className='block'>
                  <div className='text-sm text-gray-400 mb-2 group-hover:text-blue-900 transition-colors flex items-center justify-end'>
                    {t('next_post')}
                    <ArrowRight className='w-4 h-4 ml-1' />
                  </div>
                  <div className='text-gray-800 font-medium line-clamp-1'>{nextArticle.title}</div>
                </Link>
              ) : (
                <div className='text-gray-400'>
                  <div className='text-sm mb-2'>{t('next_post')}</div>
                  <div>{t('no_more_posts')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

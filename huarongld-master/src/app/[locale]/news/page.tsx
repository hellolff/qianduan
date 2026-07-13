import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageBanner from '@/components/PageBanner';
import NewsList from './_components/NewsList';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'News' });

  return {
    title: t('banner_title'),
    description: t('banner_desc'),
  };
}

export default function News() {
  const t = useTranslations('News');

  return (
    <main className='flex min-h-screen flex-col pt-20'>
      <PageBanner
        title={t('banner_title')}
        subtitle={t('banner_subtitle')}
        description={t('banner_desc')}
        image='/images/news/banner.png'
      />
      <NewsList />
    </main>
  );
}

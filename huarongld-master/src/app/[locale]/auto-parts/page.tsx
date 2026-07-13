import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageBanner from '@/components/PageBanner';
import GlobalDistributionMap from './_components/GlobalDistributionMap';
import PartsCatalog from './_components/PartsCatalog';
import InteriorAccessories from './_components/InteriorAccessories';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AutoParts' });

  return {
    title: t('banner_title'),
    description: t('banner_desc'),
  };
}

export default function AutoParts() {
  const t = useTranslations('AutoParts');

  return (
    <main className='flex min-h-screen flex-col pt-20'>
      <PageBanner
        title={t('banner_title')}
        subtitle={t('banner_subtitle')}
        description={t('banner_desc')}
        image='/images/auto-parts/banner.png'
      />

      <GlobalDistributionMap />
      <PartsCatalog />
      <InteriorAccessories />
    </main>
  );
}

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageBanner from '../../../components/PageBanner';
import LatestModels from './_components/LatestModels';
import RecommendedModels from './_components/RecommendedModels';
import BrandModels from './_components/BrandModels';
import CustomCar from './_components/CustomCar';
import MoreBrands from './_components/MoreBrands';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CarSales' });

  return {
    title: t('banner_title'),
    description: t('banner_desc'),
  };
}

export default function CarSales() {
  const t = useTranslations('CarSales');

  return (
    <main className='flex min-h-screen flex-col pt-20'>
      <PageBanner
        title={t('banner_title')}
        subtitle={t('banner_subtitle')}
        description={t('banner_desc')}
        image='/images/car-sales/banner.png'
      />

      <LatestModels />
      <RecommendedModels />
      <BrandModels />
      <MoreBrands />
      <CustomCar />
    </main>
  );
}

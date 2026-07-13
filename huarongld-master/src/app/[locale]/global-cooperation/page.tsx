import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageBanner from '@/components/PageBanner';
import CooperationModels from './_components/CooperationModels';
import StrategicPartners from '../_home/StrategicPartners';
import CooperativeDealers from './_components/CooperativeDealers';
import CooperativeBrands from './_components/CooperativeBrands';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GlobalCooperation' });

  return {
    title: t('banner_title'),
    description: t('banner_desc'),
  };
}

export default function GlobalCooperation() {
  const t = useTranslations('GlobalCooperation');

  return (
    <main className='flex min-h-screen flex-col pt-20'>
      <PageBanner
        title={t('banner_title')}
        subtitle={t('banner_subtitle')}
        description={t('banner_desc')}
        image='/images/cooperation/banner.png'
      />

      <CooperationModels />

      {/* Reusing the Strategic Partners component but wrapping it to adjust spacing if needed */}
      <div className='bg-gray-50'>
        <StrategicPartners />
      </div>

      <CooperativeDealers />

      <CooperativeBrands />
    </main>
  );
}

import HeroCarousel from './_home/HeroCarousel';
import CompanyIntro from './_home/CompanyIntro';
import Solutions from './_home/Solutions';
import SuccessCases from './_home/SuccessCases';
import GlobalNetwork from './_home/GlobalNetwork';
import StrategicPartners from './_home/StrategicPartners';
import NewsInsights from './_home/NewsInsights';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return (
    <main className='flex flex-col w-full'>
      <HeroCarousel />
      <CompanyIntro />
      <Solutions />
      <SuccessCases />
      <GlobalNetwork />
      <NewsInsights />
      <StrategicPartners />
    </main>
  );
}

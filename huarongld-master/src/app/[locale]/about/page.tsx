import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageBanner from '../../../components/PageBanner';
import AboutIntro from './_components/AboutIntro';
import CustomerValue from './_components/CustomerValue';
import Recruitment from './_components/Recruitment';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function AboutHuarong() {
  const t = useTranslations('About');

  return (
    <main className='flex min-h-screen flex-col pt-20'>
      <PageBanner title={t('title')} description={t('description')} image='/images/about/banner.png' subtitle={''} />
      <AboutIntro />
      <CustomerValue />
      <Recruitment />
    </main>
  );
}

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageBanner from '../../../components/PageBanner';
import { GlobalPresence } from './_components/GlobalPresence';
import { ContactForm } from './_components/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactUs.banner' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ContactUs() {
  const t = useTranslations('ContactUs.banner');

  return (
    <main className='flex min-h-screen flex-col pt-20'>
      <PageBanner title={t('title')} description={t('description')} image='/images/contact/banner.png' subtitle={''} />
      <GlobalPresence />
      <ContactForm />
    </main>
  );
}

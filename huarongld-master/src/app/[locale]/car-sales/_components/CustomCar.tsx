'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CustomCar() {
  const t = useTranslations('CarSales.custom_car');

  const steps = [
    {
      id: 1,
      title: t('steps.step1_title'),
      desc: t('steps.step1_desc'),
    },
    {
      id: 2,
      title: t('steps.step2_title'),
      desc: t('steps.step2_desc'),
    },
    {
      id: 3,
      title: t('steps.step3_title'),
      desc: t('steps.step3_desc'),
    },
    {
      id: 4,
      title: t('steps.step4_title'),
      desc: t('steps.step4_desc'),
    },
  ];

  return (
    <section className='w-full py-16 bg-white'>
      <div className='container-responsive'>
        <div className='bg-[#F5F7FA] rounded-[32px] overflow-hidden flex flex-col lg:flex-row min-h-[500px]'>
          {/* Left Side - Content */}
          <div className='w-full lg:w-[45%] p-8 lg:p-16 flex flex-col justify-center'>
            {/* Header */}
            <div className='mb-10'>
              <div className='text-2xl 2xl:text-3xl  text-[#002B49] mb-3'>{t('title')}</div>
              <p className='text-gray-500 text-base'>{t('subtitle')}</p>
            </div>

            {/* Steps */}
            <div className='flex flex-col gap-8'>
              {steps.map((step) => (
                <div key={step.id} className='flex items-center gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 rounded-full bg-[#002B49] text-white flex items-center justify-center text-sm font-medium font-sans'>
                      {step.id}
                    </div>
                  </div>
                  <div className='flex flex-col gap-1 pt-1'>
                    <p className='text-base 2xl:text-lg text-[#002B49] leading-none'>{step.title}</p>
                    <p className='text-gray-500 text-sm 2xl:text-base leading-relaxed'>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className='w-full lg:w-[55%] relative min-h-[300px] lg:min-h-full'>
            <Image src='/images/car-sales/dk_car.png' alt={t('title')} fill className='object-cover' />
          </div>
        </div>
      </div>
    </section>
  );
}

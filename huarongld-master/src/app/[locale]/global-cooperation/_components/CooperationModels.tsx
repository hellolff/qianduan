'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CooperationModal from './CooperationModal';

export default function CooperationModels() {
  const t = useTranslations('GlobalCooperation.CooperationModels');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeType, setActiveType] = useState('');

  const handleOpenModal = (type: string) => {
    setActiveType(type);
    setModalOpen(true);
  };

  const models = [
    {
      id: 'agent',
      image: '/images/cooperation/cooperation_1.png', // Placeholder
    },
    {
      id: 'joint_venture',
      image: '/images/cooperation/cooperation_2.png', // Placeholder
    },
    {
      id: 'alliance',
      image: '/images/cooperation/cooperation_3.png', // Placeholder
    },
  ];

  return (
    <section className='py-20 bg-white'>
      <div className='container-responsive'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>{t('title')}</h2>
          <p className='text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed'>{t('subtitle')}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col'>
              <div className='relative h-48 overflow-hidden'>
                <Image
                  src={model.image}
                  alt={t(`${model.id}.title`)}
                  fill
                  className='object-cover transform hover:scale-110 transition-transform duration-500'
                />
              </div>
              <div className='p-8 flex flex-col flex-grow'>
                <h3 className='text-xl font-bold text-blue-900 mb-4'>{t(`${model.id}.title`)}</h3>
                <p className='text-gray-600 mb-8 flex-grow leading-relaxed'>{t(`${model.id}.desc`)}</p>
                <button
                  onClick={() => handleOpenModal(model.id)}
                  className='w-full py-3 bg-[#E6B96D] text-white rounded-lg hover:bg-[#d9ab5c] transition-colors font-medium cursor-pointer'>
                  {t(`${model.id}.btn`)}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <CooperationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={activeType} />
    </section>
  );
}

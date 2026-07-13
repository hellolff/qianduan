'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CooperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

export default function CooperationModal({ isOpen, onClose, type }: CooperationModalProps) {
  const t = useTranslations('GlobalCooperation.CooperationModels');
  const tModal = useTranslations('GlobalCooperation.CooperationModels.CooperationModal');
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  const contactData: Record<
    string,
    {
      contact_person: string;
      phone_number: string;
      email_address: string;
    }
  > = {
    agent: {
      contact_person: '罗先生',
      phone_number: '135-1238-7329',
      email_address: 'luoyun@huarongld.com',
    },
    joint_venture: {
      contact_person: '周女士',
      phone_number: '13718063765',
      email_address: 'zhouhuiyuan@huarongld.com',
    },
    alliance: {
      contact_person: '肖女士',
      phone_number: '18008314261',
      email_address: 'xiaojie@huarongld.com',
    },
  };

  const currentContact = contactData[type] || contactData.agent;

  const contactInfo = [
    {
      icon: <User className='w-5 h-5 text-gray-500' />,
      label: tModal('contact_info.name_label'),
      value: currentContact.contact_person,
    },
    {
      icon: <Phone className='w-5 h-5 text-gray-500' />,
      label: tModal('contact_info.phone_label'),
      value: currentContact.phone_number,
      href: `tel:${currentContact.phone_number}`,
    },
    {
      icon: <Mail className='w-5 h-5 text-gray-500' />,
      label: tModal('contact_info.email_label'),
      value: currentContact.email_address,
      href: `mailto:${currentContact.email_address}`,
    },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className='relative bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden'
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='bg-gradient-to-r from-[#2563EB] to-[#1E40AF] p-8 text-white relative overflow-hidden'>
              {/* Decorative Circle (Simulating the illustration vibe) */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none' />
              <div className='absolute bottom-0 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none' />

              <div className='relative z-10'>
                <h3 className='text-3xl font-bold mb-3'>{type ? t(`${type}.title`) : tModal('title')}</h3>
                <p className='text-blue-100 text-sm max-w-[70%] leading-relaxed'>
                  {type ? t(`${type}.desc`) : tModal('subtitle')}
                </p>
              </div>

              <button
                onClick={onClose}
                className='absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors cursor-pointer z-10'>
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Content */}
            <div className='px-10 py-12 space-y-6 bg-[#F8FAFC]'>
              {contactInfo.map((info, index) => (
                <div key={index} className='flex items-center gap-6'>
                  <div className='w-5 h-5 flex-shrink-0 flex items-center justify-center'>{info.icon}</div>
                  <div className='flex items-center gap-4 text-base'>
                    <span className='text-gray-500 font-medium min-w-[3rem]'>{info.label}:</span>
                    {info.href ? (
                      <a href={info.href} className='text-[#333333] font-medium hover:text-[#2563EB] transition-colors'>
                        {info.value}
                      </a>
                    ) : (
                      <span className='text-[#333333] font-medium'>{info.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

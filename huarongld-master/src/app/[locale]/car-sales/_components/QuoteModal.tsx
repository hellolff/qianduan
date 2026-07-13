'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, Mail, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { saleCardService, SaleCard } from '@/services/api';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
}

export default function QuoteModal({ isOpen, onClose, carName }: QuoteModalProps) {
  const t = useTranslations('CarSales.QuoteModal');
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

  const [brokers, setBrokers] = useState<(SaleCard & { avatarColor: string })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && brokers.length === 0) {
      const fetchBrokers = async () => {
        try {
          setLoading(true);
          const res = await saleCardService.getList();
          if (res.code === 200) {
            const colors = ['bg-[#FFD8C2]', 'bg-[#E8D8FF]'];
            const mappedBrokers = res.data.map((item, index) => ({
              ...item,
              avatarColor: colors[index % colors.length],
            }));
            setBrokers(mappedBrokers);
          }
        } catch (error) {
          console.error('Failed to fetch brokers:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBrokers();
    }
  }, [isOpen, brokers.length]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
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
            className='relative bg-linear-to-b from-[#EBF4FF] to-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-visible'
            onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors z-50 shadow-lg cursor-pointer'>
              <X className='w-6 h-6' />
            </button>

            {/* Content Container */}
            <div className='p-8 md:p-12 relative min-h-[450px]'>
              {/* Header */}
              <div className='text-center mb-10'>
                <h2 className='text-3xl font-bold text-[#002B49] mb-3'>{t('title')}</h2>
                <p className='text-[#002B49] text-base md:text-lg opacity-90'>{t('subtitle')}</p>
              </div>

              <div className='flex flex-col md:flex-row items-start justify-between gap-8'>
                {/* Brokers List */}
                <div className='flex-1 space-y-8 w-full md:max-w-md relative z-10'>
                  {loading ? (
                    <div className='flex justify-center items-center py-20'>
                      <Loader2 className='w-10 h-10 animate-spin text-[#002B49]' />
                    </div>
                  ) : (
                    brokers.map((broker, index) => (
                      <div key={index} className='flex gap-5 items-start'>
                        {/* Avatar Placeholder */}
                        <div
                          className={`w-26 h-26 ${broker.avatarColor} rounded-xl overflow-hidden shrink-0 relative shadow-sm`}>
                          <div className='w-full h-full flex items-center justify-center text-white/50'>
                            <User className='w-12 h-12' fill='currentColor' />
                          </div>
                        </div>

                        {/* Info */}
                        <div className='flex-1 flex flex-col justify-center space-y-3 pt-1'>
                          <div className='text-[#FF7F50] text-base leading-none'>{t('agent_title')}</div>

                          <div className='flex items-center gap-3'>
                            <div className='w-5 flex justify-center'>
                              <User className='w-4 h-4 text-[#666]' />
                            </div>
                            <span className='text-[#333] text-base leading-none'>{broker.name}</span>
                          </div>

                          <div className='flex items-center gap-3'>
                            <div className='w-5 flex justify-center'>
                              <Phone className='w-4 h-4 text-[#666]' />
                            </div>
                            <span className='text-[#333] text-base leading-none'>{broker.phone}</span>
                          </div>

                          <div className='flex items-center gap-3 break-all'>
                            <div className='w-5 flex justify-center'>
                              <Mail className='w-4 h-4 text-[#666]' />
                            </div>
                            <span className='text-[#333] text-base leading-none'>{broker.email}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 3D Character Image */}
                <div className='hidden md:block absolute bottom-0 right-0 w-[40%] pointer-events-none'>
                  <Image
                    src='/images/car-sales/kefu.png'
                    alt='Customer Service'
                    width={400}
                    height={400}
                    className='w-full h-auto object-contain drop-shadow-2xl'
                    style={{ marginBottom: '0', marginRight: '0' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

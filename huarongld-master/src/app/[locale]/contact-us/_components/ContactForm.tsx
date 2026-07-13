'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { messageService } from '@/services/api';
import { Loader2 } from 'lucide-react';

export function ContactForm() {
  const t = useTranslations('ContactUs.contact_form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Since API requires content but form has email, we combine them
      // Or we can treat email as content if that's the only extra field
      const content = formData.email;

      const res = await messageService.add({
        name: formData.name,
        phone: formData.phone,
        content: content,
      });

      if (res.code === 200) {
        alert(t('submit_success') || 'Submitted successfully!');
        setFormData({ name: '', phone: '', email: '' });
      } else {
        alert(res.msg || 'Submission failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className='w-full bg-[#0F2C5C] py-20 relative overflow-hidden'>
      {/* Background Pattern */}
      <div
        className='absolute inset-0 opacity-10 pointer-events-none'
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className='container-responsive mx-auto px-4 relative z-10'>
        {/* Header Section */}
        <div className='text-center mb-12 text-white'>
          <h2 className='text-2xl 2xl:text-3xl font-bold mb-4'>{t('title')}</h2>
          <p className='text-base md:text-lg text-gray-300 max-w-3xl mx-auto'>{t('subtitle')}</p>
        </div>

        {/* Form Card */}
        <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-12'>
          <div className='text-center mb-8'>
            <h3 className='text-xl font-bold text-[#0F2C5C] mb-2'>{t('form_title')}</h3>
            <p className='text-gray-500 text-sm'>{t('form_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Name Input */}
              <div>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('name_placeholder')}
                  className='w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F2C5C] focus:border-transparent transition-all'
                  required
                />
              </div>

              {/* Phone Input */}
              <div>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('phone_placeholder')}
                  className='w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F2C5C] focus:border-transparent transition-all'
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder={t('email_placeholder')}
                className='w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F2C5C] focus:border-transparent transition-all'
                required
              />
            </div>

            {/* Submit Button */}
            <div className='flex justify-center mt-8'>
              <button
                type='submit'
                disabled={loading}
                className='w-40 bg-[#F5C564] hover:bg-[#e0b255] text-[#0F2C5C] font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2'>
                {loading && <Loader2 className='w-4 h-4 animate-spin' />}
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

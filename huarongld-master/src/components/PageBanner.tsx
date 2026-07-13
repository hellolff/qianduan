'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface PageBannerProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export default function PageBanner({ title, subtitle, description, image }: PageBannerProps) {
  return (
    <div className='relative w-full h-[480px] xl:h-[60vh] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 w-full h-full'>
        <Image src={image} alt={title} fill className='object-cover' priority />
        {/* Overlay */}
        <div className='absolute inset-0 bg-black/20' />
      </div>

      {/* Content */}
      <div className='relative h-full container-responsive flex flex-col justify-center text-white'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-3xl'>
          <h1 className='text-3xl 2xl:text-5xl font-bold mb-4 tracking-tight'>{title}</h1>
          <p className='text-lg text-white/90 font-bold'>{subtitle}</p>
          <p className='text-lg text-white/90 font-bold max-w-2xl leading-relaxed'>{description}</p>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { recruitmentService, Recruitment as RecruitmentType } from '@/services/api';
import { Loader2, X, ArrowRight } from 'lucide-react';

export default function Recruitment() {
  const t = useTranslations('About.Recruitment');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<RecruitmentType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<RecruitmentType | null>(null);
  const itemsPerPage = 6;

  const matrixItems = ['localization', 'value_chain', 'policy', 'data_driven'] as const;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedJob) {
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
  }, [selectedJob]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await recruitmentService.getPage(currentPage, itemsPerPage);
        if (res.code === 200) {
          setJobs(res.data.records);
          setTotalPages(Math.ceil(res.data.total / itemsPerPage));
        }
      } catch (error) {
        console.error('Failed to fetch recruitment jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top of grid
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className='w-full bg-slate-50 py-20'>
      <div className='container-responsive mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-blue-900 mb-4'>{t('title')}</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>{t('subtitle')}</p>
        </div>

        {/* Feature Section */}
        <div className='relative mb-24'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-8 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden'>
              <div className='absolute inset-0 bg-gray-200'>
                <Image
                  src='/images/about/team.png'
                  alt='Team'
                  fill
                  className='object-cover'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className='w-full h-full bg-slate-300 flex items-center justify-center text-slate-500'>
                  Team Image
                </div>
              </div>
            </motion.div>

            {/* Matrix Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-4 lg:-ml-20 z-10'>
              <div className='bg-slate-800 text-white p-8 rounded-2xl shadow-xl'>
                <div className='flex items-center gap-3 mb-8 border-l-4 border-yellow-500 pl-4'>
                  <h3 className='text-xl font-bold'>{t('matrix.title')}</h3>
                </div>

                <div className='space-y-6'>
                  {matrixItems.map((item) => (
                    <div key={item} className='flex gap-4'>
                      <div className='mt-1'>
                        <svg className='w-5 h-5 text-yellow-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className='font-bold text-white mb-1'>{t(`matrix.items.${item}.title`)}</h4>
                        <p className='text-sm text-gray-400'>{t(`matrix.items.${item}.desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <Loader2 className='w-8 h-8 text-blue-900 animate-spin' />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full min-h-[240px]'>
                  <div>
                    <h3 className='text-lg font-bold text-[#1E73BE] mb-4 group-hover:text-blue-700 transition-colors'>
                      {job.jobTitle}
                    </h3>
                    <div className='space-y-2 mb-6 text-slate-500 text-sm'>
                      <div className='flex items-center gap-2'>
                        <span className='opacity-90'>{t('jobs.department')}:</span>
                        <span>{job.departmentName}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='opacity-90'>{t('jobs.city')}:</span>
                        <span>{job.workCity}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='opacity-90'>{t('jobs.count')}:</span>
                        <span>
                          {job.recruitmentNumber}
                          {t('jobs.person_unit')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end pt-2'>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className='flex items-center text-[#002B49] font-bold text-sm transition-colors duration-300 group/btn cursor-pointer'>
                      {t('jobs.apply_now')}
                      <ArrowRight className='w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1' />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className='col-span-full text-center py-12 text-gray-500'>暂无招聘职位</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 text-sm text-gray-500'>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center border rounded transition-colors ${
                  currentPage === page ? 'bg-blue-900 text-white border-blue-900' : 'hover:bg-gray-50'
                }`}>
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className='w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
              &gt;
            </button>
          </div>
        )}

        {/* Job Detail Modal */}
        {selectedJob && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm'
            onClick={() => setSelectedJob(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl flex flex-col'>
              {/* Modal Header */}
              <div className='p-6 border-b border-gray-100 sticky top-0 bg-white z-10 flex justify-between items-start'>
                <div>
                  <h3 className='text-2xl font-bold text-[#002B49] mb-2'>{selectedJob.jobTitle}</h3>
                  <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                    <span className='flex items-center gap-1'>
                      <span className='font-medium'>{t('jobs.department')}:</span> {selectedJob.departmentName}
                    </span>
                    <span className='w-px h-4 bg-gray-300 self-center' />
                    <span className='flex items-center gap-1'>
                      <span className='font-medium'>{t('jobs.city')}:</span> {selectedJob.workCity}
                    </span>
                    <span className='w-px h-4 bg-gray-300 self-center' />
                    <span className='flex items-center gap-1'>
                      <span className='font-medium'>{t('jobs.count')}:</span> {selectedJob.recruitmentNumber}
                      {t('jobs.person_unit')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors -mr-2 -mt-2 cursor-pointer'>
                  <X className='w-6 h-6 text-gray-400 hover:text-gray-600' />
                </button>
              </div>

              {/* Modal Content */}
              <div className='p-6 space-y-8 overflow-y-auto'>
                {selectedJob.jobResponsibilities && (
                  <div>
                    <h4 className='text-lg font-bold text-[#002B49] mb-4 flex items-center gap-2'>
                      <span className='w-1 h-5 bg-blue-600 rounded-full'></span>
                      岗位职责
                    </h4>
                    {/<[a-z][\s\S]*>/i.test(selectedJob.jobResponsibilities) ? (
                      <div
                        className='prose prose-slate max-w-none text-gray-600 prose-headings:text-[#002B49] prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-[#002B49] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5'
                        dangerouslySetInnerHTML={{ __html: selectedJob.jobResponsibilities }}
                      />
                    ) : (
                      <div className='text-gray-600 leading-relaxed whitespace-pre-line'>
                        {selectedJob.jobResponsibilities}
                      </div>
                    )}
                  </div>
                )}

                {selectedJob.jobRequirements && (
                  <div>
                    <h4 className='text-lg font-bold text-[#002B49] mb-4 flex items-center gap-2'>
                      <span className='w-1 h-5 bg-blue-600 rounded-full'></span>
                      任职要求
                    </h4>
                    {/<[a-z][\s\S]*>/i.test(selectedJob.jobRequirements) ? (
                      <div
                        className='prose prose-slate max-w-none text-gray-600 prose-headings:text-[#002B49] prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-[#002B49] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5'
                        dangerouslySetInnerHTML={{ __html: selectedJob.jobRequirements }}
                      />
                    ) : (
                      <div className='text-gray-600 leading-relaxed whitespace-pre-line'>
                        {selectedJob.jobRequirements}
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Email Box */}
                <div className='bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8'>
                  <div>
                    <div className='text-[#002B49] font-bold mb-1'>有意者请将简历发送至：</div>
                    <div className='text-sm text-gray-500'>邮件主题请注明：应聘岗位+姓名</div>
                  </div>
                  <a
                    href={`mailto:${selectedJob.contactEmail || 'hr@hualongglobal.com'}`}
                    className='flex items-center justify-center gap-2 px-6 py-2.5 bg-[#002B49] text-white rounded-lg hover:bg-blue-900 transition-colors font-medium'>
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                    {selectedJob.contactEmail || 'hr@hualongglobal.com'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

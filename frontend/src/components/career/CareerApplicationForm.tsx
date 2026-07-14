import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { careerApplySchema, CareerApplyData } from '@/lib/validations'
import { useApplyJob } from '@/hooks/useForms'
import { useParams } from 'react-router-dom'
import { useJob } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Loading } from '@/components/ui/Loading'
import { ArrowLeft, FileText, Send, MapPin, Clock, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const CareerApplicationForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: job, isLoading } = useJob(slug!)
  const { mutate: apply, isPending } = useApplyJob()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CareerApplyData>({
    resolver: zodResolver(careerApplySchema),
    defaultValues: {
      portfolio_url: '',
      linkedin_url: '',
    },
  })

  const resumeFile = watch('resume')

  const onSubmit = (data: CareerApplyData) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    if (data.phone) formData.append('phone', data.phone)
    if (data.cover_letter) formData.append('cover_letter', data.cover_letter)
    if (data.portfolio_url) formData.append('portfolio_url', data.portfolio_url)
    if (data.linkedin_url) formData.append('linkedin_url', data.linkedin_url)
    if (data.resume) formData.append('resume', data.resume)

    apply({ slug: slug!, formData })
  }

  if (isLoading) {
    return <Section padding='xl'><Container><Loading text='Loading position...' /></Container></Section>
  }

  if (!job) {
    return (
      <Section padding='xl'>
        <Container>
          <div className='max-w-2xl mx-auto text-center'>
            <h1 className='heading-2 text-brand-primary mb-4'>Position Not Found</h1>
            <Link to='/careers'>
              <Button variant='primary'>Back to Careers</Button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <Section id='apply-hero' padding='xl' background='surface'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-8'
            >
              <Link to='/careers' className='inline-flex items-center gap-1 text-brand-primary hover:text-brand-secondary text-sm font-medium mb-4'>
                <ArrowLeft className='w-4 h-4' />
                Back to Careers
              </Link>
              <span className='inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium mb-3'>
                {job.department}
              </span>
              <h1 className='heading-1 text-brand-primary mb-2'>{job.title}</h1>
              <div className='flex flex-wrap items-center gap-4 text-sm text-brand-muted'>
                <span className='flex items-center gap-1'><MapPin className='w-4 h-4' /> {job.location}</span>
                <span className='flex items-center gap-1'><Clock className='w-4 h-4' /> {job.type.replace('_', ' ')}</span>
                {job.is_remote && <span className='px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full'>Remote</span>}
                {job.salary_range && <span className='flex items-center gap-1'><DollarSign className='w-4 h-4' /> {job.salary_range}</span>}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section id='application-form' padding='xl'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className='bg-white dark:bg-brand-dark rounded-xl p-8 border border-brand-surface/50'>
                <h2 className='heading-2 text-brand-primary mb-6'>Application Form</h2>
                <p className='text-brand-muted mb-8'>Fill out the form below to apply for this position. Fields marked with * are required.</p>                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' encType='multipart/form-data'>
                  <div className='grid sm:grid-cols-2 gap-6'>
                    <Input
                      label='Full Name *'
                      placeholder='John Doe'
                      error={errors.name?.message}
                      {...register('name')}
                      required
                    />
                    <Input
                      label='Email *'
                      type='email'
                      placeholder='john@example.com'
                      error={errors.email?.message}
                      {...register('email')}
                      required
                    />
                  </div>

                  <div className='grid sm:grid-cols-2 gap-6'>
                    <Input
                      label='Phone Number'
                      type='tel'
                      placeholder='+977 1 234 5678'
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Input
                      label='LinkedIn Profile'
                      type='url'
                      placeholder='https://linkedin.com/in/yourprofile'
                      error={errors.linkedin_url?.message}
                      {...register('linkedin_url')}
                    />
                  </div>

                  <Input
                    label='Portfolio / Website'
                    type='url'
                    placeholder='https://yourportfolio.com'
                    error={errors.portfolio_url?.message}
                    {...register('portfolio_url')}
                  />

                  <div className='relative'>
                    <label className='block text-sm font-medium text-brand-text mb-1.5'>
                      Resume / CV * <span className='text-red-500'>(PDF, DOC, DOCX - Max 5MB)</span>
                    </label>
                    <input
                      type='file'
                      accept='.pdf,.doc,.docx'
                      className={cn(
                        'w-full px-4 py-2.5 rounded-lg border',
                        'bg-white dark:bg-brand-dark',
                        'text-brand-text placeholder:text-brand-muted',
                        'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                        'file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20',
                        errors.resume ? 'border-red-500' : 'border-brand-surface/50'
                      )}
                      {...register('resume', {
                        required: 'Resume is required',
                        validate: {
                          fileType: file => !file || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) || 'File must be PDF, DOC, or DOCX',
                          fileSize: file => !file || file.size <= 5 * 1024 * 1024 || 'File must be less than 5MB',
                        },
                      })}
                    />
                    {errors.resume && <p className='mt-1.5 text-sm text-red-500'>{errors.resume.message}</p>}
                    {resumeFile && (
                      <p className='mt-1.5 text-sm text-brand-primary flex items-center gap-1'>
                        <FileText className='w-4 h-4' />
                        {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <Textarea
                    label='Cover Letter'
                    placeholder="Tell us why you&apos;re a great fit for this role..."
                    rows={6}
                    error={errors.cover_letter?.message}
                    {...register('cover_letter')}
                  />

                  <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t border-brand-surface/50'>
                    <Button type='submit' loading={isPending} className='flex-1' size='lg'>
                      <Send className='w-5 h-5 mr-2' />
                      Submit Application
                    </Button>
                    <Link to={'/careers/' + job.slug}>
                      <Button type='button' variant='secondary' className='flex-1 sm:flex-none'>
                        <ArrowLeft className='w-5 h-5 mr-2' />
                        Back to Position
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  )
}
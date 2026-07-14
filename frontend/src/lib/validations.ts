import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().email('Invalid email address').max(200),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(200),
  name: z.string().max(150).optional(),
  tags: z.array(z.string().max(50)).optional(),
})

export const screeningRequestSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(200),
  organization: z.string().min(2).max(200),
  phone: z.string().max(50).optional(),
  film_id: z.number().int().positive(),
  venue_name: z.string().min(2).max(200),
  venue_address: z.string().min(5).max(500),
  preferred_date: z.string().refine(date => new Date(date) >= new Date(), 'Date must be in the future'),
  preferred_time: z.string().max(50).optional(),
  expected_attendees: z.number().int().min(1).max(500),
  purpose: z.string().max(1000).optional(),
  technical_requirements: z.string().max(1000).optional(),
})

export const careerApplySchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  cover_letter: z.string().max(5000).optional(),
  portfolio_url: z.string().url().max(300).optional().or(z.literal('')),
  linkedin_url: z.string().url().max(300).optional().or(z.literal('')),
  resume: z.instanceof(File).optional().refine(
    file => !file || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
    'File must be PDF, DOC, or DOCX'
  ).refine(
    file => !file || file.size <= 5 * 1024 * 1024,
    'File must be less than 5MB'
  ),
})

export const rsvpSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  guests: z.number().int().min(0).max(10).default(1),
  message: z.string().max(1000).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type ScreeningRequestData = z.infer<typeof screeningRequestSchema>
export type CareerApplyData = z.infer<typeof careerApplySchema>
export type RsvpFormData = z.infer<typeof rsvpSchema>
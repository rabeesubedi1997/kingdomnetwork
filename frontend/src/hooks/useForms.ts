import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { contactSchema, newsletterSchema, screeningRequestSchema, CareerApplyData } from '@/lib/validations'
import { useToast } from './useToast'

export function useContactForm() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: any) => {
      const validated = contactSchema.parse(data)
      const response = await api.post('/contact', validated)
      return response.data
    },
    onSuccess: () => {
      toast({ type: 'success', message: 'Message sent successfully!' })
    },
    onError: (error: Error) => {
      toast({ type: 'error', message: error.message || 'Failed to send message' })
    },
  })
}

export function useNewsletterSubscribe() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: { email: string; name?: string; tags?: string[] }) => {
      const validated = newsletterSchema.parse(data)
      const response = await api.post('/newsletter/subscribe', validated)
      return response.data
    },
    onSuccess: () => {
      toast({ type: 'success', message: 'Subscribed successfully! Check your email to confirm.' })
    },
    onError: (error: Error) => {
      toast({ type: 'error', message: error.message || 'Failed to subscribe' })
    },
  })
}

export function useNewsletterUnsubscribe() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/newsletter/unsubscribe', { email })
      return response.data
    },
    onSuccess: () => {
      toast({ type: 'success', message: 'Unsubscribed successfully' })
    },
    onError: (error: Error) => {
      toast({ type: 'error', message: error.message || 'Failed to unsubscribe' })
    },
  })
}

export function useScreeningRequest() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: any) => {
      const validated = screeningRequestSchema.parse(data)
      const response = await api.post('/screenings/request', validated)
      return response.data
    },
    onSuccess: () => {
      toast({ type: 'success', message: 'Screening request submitted!' })
    },
    onError: (error: Error) => {
      toast({ type: 'error', message: error.message || 'Failed to submit request' })
    },
  })
}

export function useApplyJob() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ slug, formData }: { slug: string; formData: FormData }) => {
      const response = await api.post(`/careers/${slug}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => {
      toast({ type: 'success', message: 'Application submitted successfully!' })
    },
    onError: (error: Error) => {
      toast({ type: 'error', message: error.message || 'Failed to submit application' })
    },
  })
}

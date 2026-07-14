import toast from 'react-hot-toast'
import { useCallback } from 'react'

interface Toast {
  type: 'success' | 'error' | 'info'
  message: string
}

export function useToast() {
  const showToast = useCallback((t: Toast) => {
    switch (t.type) {
      case 'success':
        toast.success(t.message)
        break
      case 'error':
        toast.error(t.message)
        break
      case 'info':
        toast(t.message)
        break
    }
  }, [])

  return { toast: showToast }
}

import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  isLoading?: boolean
  variant?: 'danger' | 'warning'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?', confirmLabel = 'Delete',
  isLoading, variant = 'danger',
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
          <X size={18} className="text-gray-400" />
        </button>
        <div className="flex items-start gap-4">
          <div className={cn(
            'p-2.5 rounded-full flex-shrink-0',
            variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
          )}>
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                onClick={onConfirm}
                loading={isLoading}
                className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

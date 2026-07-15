import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AdminModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export const AdminModal: React.FC<AdminModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  children,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizeMap[size]} bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-brand-text">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-brand-muted hover:text-brand-text"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

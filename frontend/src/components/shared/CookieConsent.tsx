import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setTimeout(() => setVisible(true), 1000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto bg-brand-dark border border-brand-surface/80 rounded-2xl shadow-2xl shadow-black/30 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Cookie Consent</h3>
                  <button onClick={decline} className="p-1 rounded-lg hover:bg-white/5 text-brand-muted">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and serve personalized content. 
                  By clicking "Accept", you consent to our use of cookies.
                </p>
                {showDetails && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5 text-xs text-brand-muted space-y-2">
                    <p><strong className="text-white">Necessary:</strong> Session management, security (always active)</p>
                    <p><strong className="text-white">Analytics:</strong> Page views, user behavior (Google Analytics)</p>
                    <p><strong className="text-white">Preferences:</strong> Theme, language preferences</p>
                  </div>
                )}
                <button onClick={() => setShowDetails(!showDetails)} className="text-xs text-brand-primary hover:underline mt-1">
                  {showDetails ? 'Hide details' : 'Show details'}
                </button>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={accept} className="btn-primary text-xs px-5 py-2 whitespace-nowrap">Accept</button>
                <button onClick={decline} className="btn-secondary text-xs px-5 py-2 whitespace-nowrap">Decline</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

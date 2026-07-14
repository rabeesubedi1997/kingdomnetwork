import { ModuleConfigProvider } from './ModuleConfigProvider'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from 'react-hot-toast'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ModuleConfigProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#f8fafc',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f8fafc',
              },
            },
          }}
        />
      </ThemeProvider>
    </ModuleConfigProvider>
  )
}
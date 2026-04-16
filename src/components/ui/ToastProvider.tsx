import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ToastContext, type ToastApi } from './toast-context'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const show = useCallback((msg: string) => {
    setMessage(msg)
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => setOpen(false), 3200)
    return () => window.clearTimeout(id)
  }, [open])

  const value: ToastApi = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-live="polite"
      >
        {open ? (
          <div
            role="status"
            className="pointer-events-auto max-w-md rounded-xl border border-book-gold/40 bg-book-elevated px-4 py-3 text-center text-sm text-neutral-200 shadow-lg shadow-black/40"
          >
            {message}
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  )
}

import { createContext } from 'react'

export type ToastApi = {
  show: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

import { createContext } from 'react'

export const NotifContext = createContext<{ openNotif: () => void }>({
  openNotif: () => {},
})

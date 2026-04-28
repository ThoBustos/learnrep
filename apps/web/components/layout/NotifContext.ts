import { createContext } from 'react'

export const NotifContext = createContext<{ openNotif: () => void; unreadCount: number }>({
  openNotif: () => {},
  unreadCount: 0,
})

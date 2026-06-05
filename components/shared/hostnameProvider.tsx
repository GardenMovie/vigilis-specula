"use client"

import { createContext, useContext, useState } from "react"

type HostnameContextType = {
  hostname: string
  setHostname: (h: string) => void
}

const HostnameContext = createContext<HostnameContextType>({
  hostname: "hewey-deb",
  setHostname: () => {},
})

export function HostnameProvider({ children }: { children: React.ReactNode }) {
  const [hostname, setHostname] = useState("hewey-deb")
  return (
    <HostnameContext.Provider value={{ hostname, setHostname }}>
      {children}
    </HostnameContext.Provider>
  )
}

export function useHostname() {
  return useContext(HostnameContext)
}

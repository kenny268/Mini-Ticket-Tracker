"use client"

import { useCallback, useSyncExternalStore } from "react"

import { loginRequest } from "@/lib/api"

const STORAGE_KEY = "ticket_tracker_access_token"
const SESSION_EVENT = "ticket-session"

function subscribe(onStoreChange: () => void) {
  window.addEventListener(SESSION_EVENT, onStoreChange)
  return () => window.removeEventListener(SESSION_EVENT, onStoreChange)
}

function readToken() {
  return sessionStorage.getItem(STORAGE_KEY)
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function useSession() {
  const isClient = useIsClient()
  const storedToken = useSyncExternalStore(subscribe, readToken, () => null)
  const token = isClient ? storedToken : null

  const login = useCallback(async (email: string, password: string) => {
    const { access } = await loginRequest(email, password)
    sessionStorage.setItem(STORAGE_KEY, access)
    window.dispatchEvent(new Event(SESSION_EVENT))
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(SESSION_EVENT))
  }, [])

  return {
    token,
    login,
    logout,
    isAuthenticated: Boolean(token),
  }
}

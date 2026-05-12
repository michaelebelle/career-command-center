'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch (e) {
      console.warn('useLocalStorage read error:', e)
    }
    setLoaded(true)
  }, [key])

  const set = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch (e) {
        console.warn('useLocalStorage write error:', e)
      }
      return next
    })
  }

  return [value, set, loaded] as const
}

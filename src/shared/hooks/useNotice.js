import { useEffect, useRef, useState } from 'react'

export function useNotice() {
  const [notice, setNotice] = useState('')
  const timeoutRef = useRef(null)

  function notify(message) {
    window.clearTimeout(timeoutRef.current)
    setNotice(message)
    timeoutRef.current = window.setTimeout(() => setNotice(''), 3000)
  }

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return { notice, notify }
}
import { useState } from 'react'

export function useAuth({ notify }) {
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(null)

  function openAuth(mode) {
    setAuthMode(mode)
  }

  function switchMode() {
    setAuthMode((current) => current === 'login' ? 'register' : 'login')
  }

  function handleAuth(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    setUser(formData.get('name') || email.split('@')[0])
    notify(authMode === 'login' ? 'Welcome back. You’re signed in.' : 'Your writer account is ready.')
  }

  function signOut() {
    setUser(null)
    notify('You’re signed out.')
  }

  return { authMode, user, openAuth, switchMode, handleAuth, signOut }
}
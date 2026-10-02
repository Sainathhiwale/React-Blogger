import { useState } from 'react'
import './App.css'
import { AuthDialog } from './features/auth/AuthDialog.jsx'
import { useAuth } from './features/auth/useAuth.js'
import { DashboardPage } from './features/dashboard/DashboardPage.jsx'
import { Sidebar } from './features/dashboard/Sidebar.jsx'
import { Topbar } from './features/dashboard/Topbar.jsx'
import { StoryEditorDialog } from './features/stories/StoryEditorDialog.jsx'
import { useStories } from './features/stories/useStories.js'
import { useNotice } from './shared/hooks/useNotice.js'

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [dialog, setDialog] = useState('')
  const { notice, notify } = useNotice()
  const stories = useStories({ notify, onOpenStories: () => setActiveNav('Stories') })
  const auth = useAuth({ notify })

  function openAuth(mode) {
    auth.openAuth(mode)
    setDialog('auth')
  }

  function saveStory(title, body) {
    stories.saveStory(title, body)
    setDialog('')
    setActiveNav('Stories')
    notify('Draft saved to your stories.')
  }

  function handleAuth(event) {
    auth.handleAuth(event)
    setDialog('')
  }

  return (
    <div className="app-shell">
      <Sidebar activeNav={activeNav} onNavigate={(page) => {
        setActiveNav(page)
        if (page === 'Stories') stories.setActiveFilter('All stories')
      }} storyCount={stories.stories.length} user={auth.user} onNotify={notify} onOpenAuth={openAuth} onSignOut={auth.signOut} />

      <main className="main-area">
        <Topbar activeNav={activeNav} user={auth.user} onOpenAuth={openAuth} onSignOut={auth.signOut} onNewStory={() => setDialog('editor')} />
        <DashboardPage activeNav={activeNav} stories={stories} onWriteStory={() => setDialog('editor')} onNotify={notify} onNavigate={setActiveNav} />
      </main>

      {notice && <div className="toast" role="status">{notice}</div>}
      {dialog === 'auth' && <AuthDialog authMode={auth.authMode} onClose={() => setDialog('')} onSubmit={handleAuth} onSwitchMode={auth.switchMode} />}
      {dialog === 'editor' && <StoryEditorDialog onClose={() => setDialog('')} onSave={saveStory} />}
    </div>
  )
}

export default App

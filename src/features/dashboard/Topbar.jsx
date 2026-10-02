import { Icon } from '../../shared/components/Icon.jsx'

export function Topbar({ activeNav, user, onOpenAuth, onSignOut, onNewStory }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div>
      <div className="topbar-actions">
        <div className="online-status"><span /> All changes saved</div>
        {user
          ? <button className="button button-outline top-auth" onClick={onSignOut}>Sign out</button>
          : <><button className="button button-quiet top-auth" onClick={() => onOpenAuth('login')}>Log in</button><button className="button button-dark top-auth" onClick={() => onOpenAuth('register')}>Sign up</button></>}
        <button className="button button-dark new-story-button" onClick={onNewStory}><Icon name="pen" size={16} /><span>New story</span></button>
      </div>
    </header>
  )
}
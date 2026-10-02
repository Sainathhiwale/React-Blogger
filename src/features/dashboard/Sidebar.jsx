import { Icon } from '../../shared/components/Icon.jsx'

const navigation = [
  { label: 'Overview', icon: 'grid' },
  { label: 'Stories', icon: 'book' },
  { label: 'Analytics', icon: 'chart' },
  { label: 'Audience', icon: 'users' },
]

export function Sidebar({ activeNav, onNavigate, storyCount, user, onNotify, onOpenAuth, onSignOut }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={() => onNavigate('Overview')}>
        <span className="brand-mark">f.</span><span>folio<span className="brand-period">.</span></span>
      </a>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map((item) => <button key={item.label} className={`nav-link ${activeNav === item.label ? 'active' : ''}`} onClick={() => onNavigate(item.label)}>
          <Icon name={item.icon} /><span>{item.label}</span>{item.label === 'Stories' && <span className="nav-count">{storyCount}</span>}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="plan-card"><div className="plan-eyebrow">YOUR PUBLICATION</div><strong>The Sunday Edit</strong><span>foliospace.com/sundayedit</span><button onClick={() => onNotify('Your publication is up to date.')}>View publication <Icon name="arrow" size={14} /></button></div>
        <button className="nav-link settings-link" onClick={() => onNotify('Settings are coming soon.')}><Icon name="settings" /><span>Settings</span></button>
        <div className="sidebar-profile"><div className="avatar">{user ? user.charAt(0).toUpperCase() : 'M'}</div><div className="profile-copy"><strong>{user || 'Morgan Lee'}</strong><span>{user ? 'Writer account' : 'Free plan'}</span></div><button className="profile-menu" aria-label="Account options" onClick={() => user ? onSignOut() : onOpenAuth('login')}>···</button></div>
      </div>
    </aside>
  )
}
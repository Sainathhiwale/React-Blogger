export function AuthDialog({ authMode, onClose, onSubmit, onSwitchMode }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
        <span className="dialog-mark">f.</span>
        <div className="dialog-kicker">A HOME FOR YOUR WORDS</div>
        <h2 id="auth-title">{authMode === 'login' ? 'Welcome back.' : 'Make yourself at home.'}</h2>
        <p className="dialog-description">{authMode === 'login' ? 'Pick up right where your next great story begins.' : 'Start a publication that sounds like you.'}</p>
        <form className="dialog-form" onSubmit={onSubmit}>
          {authMode === 'register' && <label>Your name<input name="name" type="text" autoComplete="name" placeholder="Morgan Lee" required /></label>}
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" minLength="8" required /></label>
          <button className="button button-dark form-submit" type="submit">{authMode === 'login' ? 'Log in to your workspace' : 'Create your free account'} <span>→</span></button>
        </form>
        <div className="auth-switch">
          {authMode === 'login' ? 'New to Folio?' : 'Already have an account?'}{' '}
          <button onClick={onSwitchMode}>{authMode === 'login' ? 'Create an account' : 'Log in'}</button>
        </div>
        <div className="dialog-fineprint">By continuing, you agree to our Terms of Service and Privacy Policy.</div>
      </section>
    </div>
  )
}
import { useState } from 'react'

export function StoryEditorDialog({ onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSave(title, body)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
        <div className="editor-dialog-top"><div className="dialog-kicker">YOUR NEXT STORY</div><span className="draft-indicator"><i /> Saved as draft</span></div>
        <h2 id="editor-title">Start with a thought.</h2>
        <form onSubmit={handleSubmit}>
          <input className="editor-title-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a title…" aria-label="Story title" required />
          <textarea className="editor-body-input" value={body} onChange={(event) => setBody(event.target.value)} placeholder="The first line is always the hardest. Just begin." aria-label="Story body" />
          <div className="editor-footer"><span>Good writing takes the time it takes.</span><button className="button button-dark" type="submit">Save draft <span>→</span></button></div>
        </form>
      </section>
    </div>
  )
}
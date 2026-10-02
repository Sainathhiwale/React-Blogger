import { useMemo, useState } from 'react'
import { initialStories } from './storyData.js'

export function useStories({ onOpenStories }) {
  const [stories, setStories] = useState(initialStories)
  const [activeFilter, setActiveFilter] = useState('All stories')
  const [search, setSearch] = useState('')

  const filteredStories = useMemo(() => stories.filter((story) => {
    const matchesFilter = activeFilter === 'All stories' || story.status === activeFilter
    const matchesSearch = `${story.title} ${story.category}`.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  }), [activeFilter, search, stories])

  function saveStory(title, body) {
    if (!title.trim()) return false
    setStories((current) => [{
      id: Date.now(),
      title: title.trim(),
      excerpt: body.trim().slice(0, 108) || 'A new story, ready for a few finishing touches.',
      category: 'UNCATEGORIZED',
      date: 'Just now',
      reads: '—',
      status: 'Draft',
      image: 'photo-1455390582262-044cdead277a',
      color: 'rose',
    }, ...current])
    setActiveFilter('All stories')
    onOpenStories()
    return true
  }

  function clearFilters() {
    setActiveFilter('All stories')
    setSearch('')
  }

  return { stories, filteredStories, activeFilter, setActiveFilter, search, setSearch, saveStory, clearFilters }
}
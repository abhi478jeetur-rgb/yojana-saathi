import { useCallback, useEffect, useState } from 'react'
import { appwriteEnabled, loadChecklists, saveChecklist } from './appwrite/index.js'

const KEY = 'yojana-saathi:checklist'

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

/** Saved schemes and ticked documents: { [schemeId]: number[] }. localStorage first, Appwrite TablesDB when configured. */
export function useChecklist() {
  const [lists, setLists] = useState(readLocal)

  useEffect(() => {
    if (!appwriteEnabled) return
    loadChecklists()
      .then((remote) => remote && setLists((local) => ({ ...local, ...remote })))
      .catch((err) => console.warn('[appwrite] checklist load failed, using local copy', err))
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lists))
  }, [lists])

  const update = useCallback((id, next) => {
    setLists((prev) => {
      const copy = { ...prev }
      if (next === null) delete copy[id]
      else copy[id] = next
      return copy
    })
    if (appwriteEnabled) saveChecklist(id, next).catch((err) => console.warn('[appwrite] save failed', err))
  }, [])

  const isSaved = (id) => Array.isArray(lists[id])
  const toggleSave = (id) => update(id, isSaved(id) ? null : [])
  const toggleDoc = (id, i) => {
    const done = new Set(lists[id] || [])
    done.has(i) ? done.delete(i) : done.add(i)
    update(id, [...done].sort((a, b) => a - b))
  }

  return { lists, isSaved, toggleSave, toggleDoc, done: (id) => lists[id] || [] }
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bookmark } from '@/lib/types/database'

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchBookmarks])

  const deleteBookmark = async (id: string) => {
    setDeletingId(id)
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) throw error
    } catch {
      alert('Failed to delete bookmark')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <p className="text-gray-600 text-lg font-medium mb-2">No bookmarks yet</p>
        <p className="text-gray-500 text-sm">Add your first bookmark using the form above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Bookmarks</h2>
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex items-start justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all hover:underline inline-block"
            >
              {bookmark.url}
            </a>
            <p className="text-xs text-gray-500 mt-3">
              {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            disabled={deletingId === bookmark.id}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete bookmark"
          >
            {deletingId === bookmark.id ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AddBookmarkForm from './components/AddBookmarkForm'
import BookmarkList from './components/BookmarkList'
import LogoutButton from './components/LogoutButton'
import type { Bookmark } from '@/lib/types/database'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [addBookmarkHandler, setAddBookmarkHandler] = useState<((bookmark: Bookmark) => void) | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              📚 Bookmark Manager
            </h1>
            <p className="text-sm text-gray-600 truncate">Welcome, {user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <AddBookmarkForm onBookmarkAdded={addBookmarkHandler || undefined} />
        <BookmarkList onGetAddBookmarkHandler={(handler) => setAddBookmarkHandler(() => handler)} />
      </div>
    </div>
  )
}

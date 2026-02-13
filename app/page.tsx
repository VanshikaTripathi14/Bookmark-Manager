import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddBookmarkForm from './components/AddBookmarkForm'
import BookmarkList from './components/BookmarkList'
import LogoutButton from './components/LogoutButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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

        <AddBookmarkForm />
        <BookmarkList />
      </div>
    </div>
  )
}

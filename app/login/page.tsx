import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './LoginButton'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            📚 Bookmark Manager
          </h1>
          <p className="text-gray-600">Save and organize your favorite links</p>
        </div>
        
        <LoginButton />
        
        <p className="text-xs sm:text-sm text-gray-500 text-center mt-6 px-2">
          Sign in with Google to get started. Your bookmarks are private and secure.
        </p>
      </div>
    </div>
  )
}

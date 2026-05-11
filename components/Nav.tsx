'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  owner_name: string
  assistant_name: string
  avatar_url: string | null
} | null

export default function Nav({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/', label: 'Network' },
    { href: '/projects', label: 'Projects' },
  ]

  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="text-white font-semibold text-sm">🤖 AAN</span>
          <div className="flex gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium text-white">
                {profile?.assistant_name?.[0] ?? '?'}
              </div>
            )}
            <span className="text-sm text-gray-300">{profile?.assistant_name}</span>
          </Link>
          <button
            onClick={signOut}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

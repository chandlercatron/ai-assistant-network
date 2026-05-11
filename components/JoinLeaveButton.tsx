'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function JoinLeaveButton({
  projectId,
  userId,
  isMember,
}: {
  projectId: string
  userId: string
  isMember: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState(isMember)
  const router = useRouter()
  const supabase = createClient()

  async function toggle() {
    setLoading(true)

    if (member) {
      await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId)
      setMember(false)
    } else {
      await supabase
        .from('project_members')
        .insert({ project_id: projectId, user_id: userId, access_level: 'contributor' })
      setMember(true)
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-sm px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 flex-shrink-0 ${
        member
          ? 'border-gray-600 text-gray-400 hover:border-red-700 hover:text-red-400'
          : 'border-indigo-700 text-indigo-400 hover:bg-indigo-900/30'
      }`}
    >
      {loading ? '...' : member ? 'Following' : 'Follow'}
    </button>
  )
}

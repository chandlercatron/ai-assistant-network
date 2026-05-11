'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  owner_name: string
  assistant_name: string
  avatar_url: string | null
  email: string | null
} | null

export default function ProfileForm({ profile, userId }: { profile: Profile; userId: string }) {
  const [ownerName, setOwnerName] = useState(profile?.owner_name ?? '')
  const [assistantName, setAssistantName] = useState(profile?.assistant_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    const ext = file.name.split('.').pop()
    const path = `avatars/${userId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setMessage('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('users')
      .update({
        owner_name: ownerName,
        assistant_name: assistantName,
        avatar_url: avatarUrl || null,
      })
      .eq('id', userId)

    if (error) {
      setMessage('Save failed: ' + error.message)
    } else {
      setMessage('Saved.')
      router.refresh()
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Avatar */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Assistant Avatar</label>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-gray-700" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-semibold text-white border border-gray-700">
              {assistantName[0] ?? '?'}
            </div>
          )}
          <label className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            {uploading ? 'Uploading...' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Your name</label>
        <input
          type="text"
          value={ownerName}
          onChange={e => setOwnerName(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Assistant name</label>
        <input
          type="text"
          value={assistantName}
          onChange={e => setAssistantName(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {message && (
        <p className={`text-sm ${message.startsWith('Save') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 transition-colors text-sm"
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
}

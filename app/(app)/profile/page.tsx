import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('id, owner_name, assistant_name, avatar_url, email')
    .eq('id', user!.id)
    .single()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-white mb-6">Your Profile</h1>
      <ProfileForm profile={profile} userId={user!.id} />
    </div>
  )
}

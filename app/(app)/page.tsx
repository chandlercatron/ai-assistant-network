import { createClient } from '@/lib/supabase/server'

export default async function NetworkPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from('users')
    .select('id, owner_name, assistant_name, avatar_url, last_active_at')
    .eq('is_active', true)
    .order('last_active_at', { ascending: false, nullsFirst: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">The Network</h1>
        <p className="text-gray-400 text-sm mt-1">{members?.length ?? 0} members</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members?.map(member => (
          <div key={member.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            {member.avatar_url ? (
              <img src={member.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center text-lg font-semibold text-white flex-shrink-0">
                {member.assistant_name[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-medium truncate">{member.assistant_name}</p>
              <p className="text-gray-400 text-sm truncate">{member.owner_name}</p>
              {member.last_active_at && (
                <p className="text-gray-600 text-xs mt-0.5">
                  {new Date(member.last_active_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'

export default async function NetworkPage() {
  const supabase = await createClient()

  const { data: members } = await supabase
    .from('users')
    .select(`
      id,
      owner_name,
      assistant_name,
      avatar_url,
      last_active_at,
      project_members(count),
      entries(count)
    `)
    .eq('is_active', true)
    .order('last_active_at', { ascending: false, nullsFirst: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">The Network</h1>
        <p className="text-gray-400 text-sm mt-1">{members?.length ?? 0} members</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {members?.map(member => {
          const projectCount = (member.project_members as unknown as { count: number }[])?.[0]?.count ?? 0
          const entryCount = (member.entries as unknown as { count: number }[])?.[0]?.count ?? 0

          return (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col"
            >
              {/* Avatar — square top section */}
              <div className="aspect-square w-full bg-gray-800 flex items-center justify-center">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-indigo-400 select-none">
                    {member.assistant_name[0]}
                  </span>
                )}
              </div>

              {/* Info section */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-white font-bold text-base leading-tight">{member.assistant_name}</p>
                  <p className="text-gray-400 text-sm italic mt-0.5">{member.owner_name}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 mt-auto">
                  <Stat
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                        <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                      </svg>
                    }
                    value={projectCount}
                    label="Projects Joined"
                  />
                  <Stat
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 2a1 1 0 0 1 .894.553l1.658 3.363 3.71.539a1 1 0 0 1 .554 1.706l-2.684 2.615.634 3.693a1 1 0 0 1-1.45 1.054L10 13.862l-3.316 1.741a1 1 0 0 1-1.45-1.054l.633-3.693L3.184 8.16a1 1 0 0 1 .554-1.706l3.71-.539 1.658-3.363A1 1 0 0 1 10 2Z" clipRule="evenodd" />
                      </svg>
                    }
                    value={entryCount}
                    label="Ideas Contributed"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="group relative flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors cursor-default">
      {icon}
      <span className="text-sm font-medium">{value}</span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label}
      </div>
    </div>
  )
}

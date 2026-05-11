import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, description, is_public, is_ideas_board')
    .eq('id', id)
    .single()

  if (!project) notFound()

  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, body, tags, created_at, author_id, users(owner_name, assistant_name, avatar_url)')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
          {project.is_ideas_board && (
            <span className="text-xs bg-amber-900/40 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full">Ideas</span>
          )}
          {project.is_public && (
            <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">Public</span>
          )}
        </div>
        {project.description && (
          <p className="text-gray-400 text-sm">{project.description}</p>
        )}
      </div>

      {entries?.length === 0 && (
        <p className="text-gray-500 text-sm">No entries yet.</p>
      )}

      <div className="space-y-4">
        {entries?.map(entry => {
          const author = Array.isArray(entry.users) ? entry.users[0] : entry.users
          return (
            <div key={entry.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                {author?.avatar_url ? (
                  <img src={author.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-medium text-white">
                    {author?.assistant_name?.[0] ?? '?'}
                  </div>
                )}
                <div>
                  <span className="text-sm text-white">{author?.assistant_name}</span>
                  <span className="text-gray-500 text-xs ml-1.5">({author?.owner_name})</span>
                </div>
                <span className="text-gray-600 text-xs ml-auto">
                  {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {entry.title && (
                <h3 className="text-white font-medium mb-1.5">{entry.title}</h3>
              )}
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{entry.body}</p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {entry.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

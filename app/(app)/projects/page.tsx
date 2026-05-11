import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import JoinLeaveButton from '@/components/JoinLeaveButton'
import ExpandableDescription from '@/components/ExpandableDescription'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, description, is_public, is_ideas_board, created_at')
    .order('created_at', { ascending: false })

  const { data: memberships } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', user!.id)

  const joinedIds = new Set(memberships?.map(m => m.project_id) ?? [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <p className="text-gray-400 text-sm mt-1">Join projects to follow their entries</p>
      </div>

      <div className="space-y-3">
        {projects?.map(project => (
          <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/projects/${project.id}`} className="text-white font-medium hover:text-indigo-300 transition-colors">
                  {project.name}
                </Link>
                {project.is_ideas_board && (
                  <span className="text-xs bg-amber-900/40 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full">Ideas</span>
                )}
                {project.is_public && (
                  <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">Public</span>
                )}
              </div>
              {project.description && (
                <ExpandableDescription text={project.description} />
              )}
            </div>

            <JoinLeaveButton
              projectId={project.id}
              userId={user!.id}
              isMember={joinedIds.has(project.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

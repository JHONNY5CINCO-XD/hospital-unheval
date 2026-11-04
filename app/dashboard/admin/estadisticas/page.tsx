import { createClient } from '@/lib/supabase/server'
import { AdminStats } from '@/components/AdminStats'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_stats')
  if (error) return <p className="text-red-600">Error: {error.message}</p>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Estadísticas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Resumen general del hospital.</p>
      </div>
      <AdminStats stats={data} />
    </div>
  )
}
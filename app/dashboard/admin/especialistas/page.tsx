import { createClient } from '@/lib/supabase/server'
import { SpecialistForm } from '@/components/SpecialistForm'
import { SpecialistTable } from '@/components/SpecialistTable'

export default async function SpecialistsAdminPage() {
  const supabase = await createClient()
  const { data: specialists } = await supabase
    .from('profiles').select('*').eq('role','specialist').order('full_name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Especialistas</h1>
        <p className="text-sm text-slate-500">Crea y administra las cuentas del personal médico.</p>
      </div>
      <SpecialistForm />
      <SpecialistTable specialists={specialists ?? []} />
    </div>
  )
}
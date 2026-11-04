import { createClient } from '@/lib/supabase/server'
import { AdminAppointmentsTable } from '@/components/AdminAppointmentsTable'

export default async function AdminCitasPage() {
  const supabase = await createClient()
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Todas las Citas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Historial global de atenciones del hospital.</p>
      </div>
      <AdminAppointmentsTable appointments={appointments ?? []} />
    </div>
  )
}
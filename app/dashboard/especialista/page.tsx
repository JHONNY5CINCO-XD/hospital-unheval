import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppointmentRow } from '@/components/AppointmentRow'
import { SpecialistCalendar } from '@/components/SpecialistCalendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs' // <-- Necesitamos crear esto abajo

export default async function SpecialistDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('specialty, full_name').eq('id', user.id).single()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('specialty', profile?.specialty ?? '')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  const pending = appointments?.filter(a => a.status === 'pending') ?? []
  const others  = appointments?.filter(a => a.status !== 'pending') ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pacientes — {profile?.specialty}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {pending.length} solicitudes pendientes de confirmación.
        </p>
      </div>

      <Tabs defaultValue="calendario">
        <TabsList>
          <TabsTrigger value="calendario">📅 Calendario</TabsTrigger>
          <TabsTrigger value="lista">📋 Lista de Citas</TabsTrigger>
        </TabsList>

        <TabsContent value="calendario">
          <SpecialistCalendar appointments={appointments ?? []} specialistId={user.id} />
        </TabsContent>

        <TabsContent value="lista">
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Pendientes</h2>
              {pending.length === 0
                ? <p className="card p-6 text-sm text-slate-500 dark:text-slate-400">No tienes solicitudes pendientes.</p>
                : <div className="space-y-3">{pending.map(a => <AppointmentRow key={a.id} appointment={a} specialistId={user.id} canEdit />)}</div>}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Historial</h2>
              {others.length === 0
                ? <p className="card p-6 text-sm text-slate-500 dark:text-slate-400">Aún no hay historial.</p>
                : <div className="space-y-3">{others.map(a => <AppointmentRow key={a.id} appointment={a} specialistId={user.id} canEdit />)}</div>}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
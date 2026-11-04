import Link from 'next/link'
import { Users, Pill, CalendarDays, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminHome() {
  const supabase = await createClient()
  const [specRes, medRes, apptRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role','specialist'),
    supabase.from('medications').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status','pending'),
  ])

  const stats = [
    { label: 'Especialistas', value: specRes.count ?? 0, href: '/dashboard/admin/especialistas', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Medicamentos',  value: medRes.count ?? 0,  href: '/dashboard/admin/medicamentos',  icon: Pill, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Citas pendientes', value: apptRes.count ?? 0, href: '/dashboard/admin/especialistas', icon: CalendarDays, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]

  const links = [
    { href: '/dashboard/admin/citas', title: 'Todas las Citas', desc: 'Ver historial global y exportar reportes a Excel.', icon: CalendarDays },
    { href: '/dashboard/admin/especialistas', title: 'Gestionar especialistas', desc: 'Crear, editar y desactivar cuentas del personal médico.', icon: Users },
    { href: '/dashboard/admin/estadisticas', title: 'Ver estadísticas', desc: 'Analiza tendencias, rendimiento y flujo de pacientes.', icon: CalendarDays },
    { href: '/dashboard/admin/medicamentos', title: 'Gestionar medicamentos', desc: 'Agregar y editar el catálogo de fármacos disponibles.', icon: Pill },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de administración</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen general del Hospital Unheval.</p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">{s.value}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Accesos rápidos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="group card p-6 transition hover:border-emerald-500/50 hover:shadow-md dark:hover:border-emerald-500/50">
              <div className="flex items-center gap-3">
                <link.icon className="h-6 w-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {link.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{link.desc}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                Ir ahora <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
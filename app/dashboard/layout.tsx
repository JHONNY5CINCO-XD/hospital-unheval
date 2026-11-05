import Link from 'next/link'
import { redirect } from 'next/navigation'
import { HeartPulse } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role, full_name, specialty').eq('id', user.id).single()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="border-b border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-400">
            <HeartPulse className="h-6 w-6" /> Hospital Unheval
          </Link>
          
          {/* Aquí se integra la sección optimizada para móviles */}
          <div className="flex items-center gap-3 md:gap-4 text-sm">
            <ThemeToggle />
            
            {/* Oculta el texto del perfil en pantallas pequeñas (sm:block lo vuelve a mostrar) */}
            <div className="hidden text-right sm:block">
              <div className="font-medium text-slate-900 dark:text-white">{profile?.full_name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {profile?.role === 'admin' ? 'Administrador' : profile?.specialty}
              </div>
            </div>

            {/* Mantenemos tu botón original que ya sabe cómo cerrar sesión de forma segura */}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  )
}
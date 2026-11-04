'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus, Mail, Lock, Phone, Stethoscope } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'

export function SpecialistForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null); setOk(false)
    const form = e.currentTarget
    const fd = new FormData(form)
    
    try {
      const res = await fetch('/api/admin/create-specialist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fd.get('full_name'),
          email: fd.get('email'),
          password: fd.get('password'),
          specialty: fd.get('specialty'),
          phone: fd.get('phone') || null,
        }),
      })
      const json = await res.json()
      
      if (!res.ok) throw new Error(json.error || 'Error al crear especialista')
      
      setOk(true)
      form.reset()
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nuevo Especialista</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Crea las credenciales de acceso para el personal médico.</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Nombre completo</label>
          <div className="relative">
            <UserPlus className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input name="full_name" className="input pl-9" placeholder="Ej. Dr. Jhonny Pérez" required />
          </div>
        </div>
        
        <div>
          <label className="label">Especialidad</label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select name="specialty" className="input pl-9" required defaultValue="">
              <option value="" disabled>Selecciona especialidad</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Correo de acceso</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input name="email" type="email" className="input pl-9" placeholder="medico@unheval.com" required />
          </div>
        </div>
        
        <div>
          <label className="label">Contraseña temporal</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input name="password" type="text" className="input pl-9" minLength={6} placeholder="Mínimo 6 caracteres" required />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="label">Teléfono (opcional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input name="phone" className="input pl-9" placeholder="Ej. +51 999 999 999" />
          </div>
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      {ok && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">✅ Especialista creado correctamente.</div>}

      <div className="mt-6 flex justify-end">
        <button disabled={loading} className="btn-primary w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} 
          {loading ? 'Creando cuenta...' : 'Crear especialista'}
        </button>
      </div>
    </form>
  )
}
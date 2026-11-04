'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SPECIALTIES } from '@/lib/specialties'
import { Pencil, X, Check, ShieldAlert, ShieldCheck } from 'lucide-react'

export function SpecialistTable({ specialists }: { specialists: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [editing, setEditing] = useState<string | null>(null)

  async function toggleActive(id: string, active: boolean) {
    await supabase.from('profiles').update({ active: !active }).eq('id', id)
    router.refresh()
  }

  async function saveEdit(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await supabase.from('profiles').update({
      full_name: String(fd.get('full_name')),
      specialty: String(fd.get('specialty')),
      phone: String(fd.get('phone') || '') || null,
    }).eq('id', id)
    setEditing(null); router.refresh()
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Contacto</th>
              <th className="px-6 py-4 font-semibold">Especialidad</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {specialists.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {editing === s.id ? (
                  <td colSpan={5} className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80">
                    <form id={`edit-${s.id}`} onSubmit={(e) => saveEdit(s.id, e)} className="grid gap-3 md:grid-cols-4 items-end">
                      <div>
                        <label className="text-xs mb-1 block">Nombre</label>
                        <input name="full_name" defaultValue={s.full_name} className="input" required />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block">Especialidad</label>
                        <select name="specialty" defaultValue={s.specialty} className="input" required>
                          {SPECIALTIES.map(x => <option key={x} value={x}>{x}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs mb-1 block">Teléfono</label>
                        <input name="phone" defaultValue={s.phone ?? ''} className="input" />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="btn-primary w-full">Guardar</button>
                        <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-3"><X className="h-4 w-4" /></button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{s.full_name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{s.phone || 'Sin teléfono'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{s.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/30">
                        {s.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 badge ${s.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {s.active ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                        {s.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(s.id)} className="btn-secondary p-2" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => toggleActive(s.id, s.active)} className={`p-2 rounded-lg border text-sm font-medium transition-colors ${s.active ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/30' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30'}`} title={s.active ? 'Desactivar' : 'Activar'}>
                          {s.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {specialists.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Sin especialistas registrados.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
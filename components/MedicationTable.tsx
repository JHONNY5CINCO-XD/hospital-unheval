'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, X, Check, Pill } from 'lucide-react'
import { toast } from 'sonner'

export function MedicationTable({ medications }: { medications: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [editing, setEditing] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Estás seguro de eliminar ${name}?`)) return
    const { error } = await supabase.from('medications').delete().eq('id', id)
    if (error) return toast.error("Error al eliminar", { description: error.message })
    toast.success("Medicamento eliminado")
    router.refresh()
  }

  async function saveEdit(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('medications').update({
      name: String(fd.get('name')),
      description: String(fd.get('description') || '') || null,
      stock: Number(fd.get('stock')),
      unit: String(fd.get('unit') || '') || null,
    }).eq('id', id)
    
    if (error) return toast.error("Error al editar", { description: error.message })
    toast.success("Medicamento actualizado")
    setEditing(null); router.refresh()
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Descripción</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Unidad</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {medications.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {editing === m.id ? (
                  <td colSpan={5} className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80">
                    <form id={`edit-med-${m.id}`} onSubmit={(e) => saveEdit(m.id, e)} className="grid gap-3 md:grid-cols-4 items-end">
                      <div><label className="text-xs mb-1 block">Nombre</label><input name="name" defaultValue={m.name} className="input" required /></div>
                      <div><label className="text-xs mb-1 block">Descripción</label><input name="description" defaultValue={m.description ?? ''} className="input" /></div>
                      <div><label className="text-xs mb-1 block">Stock</label><input name="stock" type="number" defaultValue={m.stock} className="input" required /></div>
                      <div className="flex gap-2">
                        <input name="unit" defaultValue={m.unit ?? ''} className="input w-1/2" placeholder="Unidad" />
                        <button type="submit" className="btn-primary flex-1">Guardar</button>
                        <button type="button" onClick={() => setEditing(null)} className="btn-secondary px-3"><X className="h-4 w-4" /></button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{m.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{m.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${m.stock > 10 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {m.stock} uds
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{m.unit || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(m.id)} className="btn-secondary p-2"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(m.id, m.name)} className="btn-danger p-2"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {medications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <Pill className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Sin medicamentos en el catálogo.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
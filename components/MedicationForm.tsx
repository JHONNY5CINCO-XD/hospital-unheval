'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function MedicationForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    await supabase.from('medications').insert({
      name: String(fd.get('name')),
      description: String(fd.get('description') || '') || null,
      stock: Number(fd.get('stock') ?? 0),
      unit: String(fd.get('unit') || '') || null,
    })
    setLoading(false); form.reset(); router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="card p-6">
      <h2 className="font-semibold text-slate-900">Agregar medicamento</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <input name="name" className="input md:col-span-2" placeholder="Nombre" required />
        <input name="stock" type="number" min="0" defaultValue={0} className="input" placeholder="Stock" />
        <input name="unit" className="input" placeholder="Unidad (caja, frasco...)" />
        <input name="description" className="input md:col-span-4" placeholder="Descripción" />
      </div>
      <button disabled={loading} className="btn-primary mt-4">Agregar</button>
    </form>
  )
}
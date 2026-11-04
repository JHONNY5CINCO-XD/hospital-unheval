'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Med = { id: string; name: string; unit?: string | null }

type RxItem = {
  medication_id: string
  medication_name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export function CompleteAppointmentModal({
  appointment,
  specialistId,
  onClose,
}: { appointment: any; specialistId: string; onClose: () => void }) {
  const supabase = createClient()
  const router = useRouter()
  const [meds, setMeds] = useState<Med[]>([])
  const [items, setItems] = useState<RxItem[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('medications').select('id, name, unit').order('name')
      .then(({ data }) => setMeds(data ?? []))
  }, [supabase])

  function addItem() {
    setItems([...items, {
      medication_id: '', medication_name: '', dosage: '', frequency: '', duration: '', instructions: '',
    }])
  }

  function updateItem(i: number, patch: Partial<RxItem>) {
    setItems(items.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  }

  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setError(null)
    const fd = new FormData(e.currentTarget)

    // 1) Historial clínico
    const { error: mrErr } = await supabase.from('medical_records').insert({
      appointment_id: appointment.id,
      specialist_id: specialistId,
      diagnosis: String(fd.get('diagnosis') || '') || null,
      treatment: String(fd.get('treatment') || '') || null,
      recommendations: String(fd.get('recommendations') || '') || null,
      blood_pressure: String(fd.get('blood_pressure') || '') || null,
      temperature: fd.get('temperature') ? Number(fd.get('temperature')) : null,
      heart_rate: fd.get('heart_rate') ? Number(fd.get('heart_rate')) : null,
    })
    if (mrErr) { setSaving(false); setError(mrErr.message); return }

    // 2) Recetas
    const validItems = items.filter(i => i.medication_name && i.dosage)
    if (validItems.length > 0) {
      const { error: rxErr } = await supabase.from('prescriptions').insert(
        validItems.map(i => ({
          appointment_id: appointment.id,
          medication_id: i.medication_id || null,
          medication_name: i.medication_name,
          dosage: i.dosage,
          frequency: i.frequency || null,
          duration: i.duration || null,
          instructions: i.instructions || null,
        }))
      )
      if (rxErr) { setSaving(false); setError(rxErr.message); return }
    }

    // 3) Marcar cita completada
    await supabase.from('appointments').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      assigned_specialist_id: specialistId,
    }).eq('id', appointment.id)

    // 4) Enviar correo con la receta (si el paciente puso email)
    if (appointment.email) {
      fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          to: appointment.email,
          patientName: appointment.patient_name,
          code: appointment.access_code,
          type: 'completed',
          specialty: appointment.specialty,
          prescriptions: validItems // Los medicamentos que se acaban de recetar
        })
      })
    }
    
    setSaving(false)
    onClose()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Completar cita</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.patient_name} · {appointment.specialty}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 p-5">
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Signos vitales</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div><label className="label">Presión arterial</label><input name="blood_pressure" className="input" placeholder="120/80" /></div>
              <div><label className="label">Temperatura (°C)</label><input name="temperature" type="number" step="0.1" className="input" placeholder="36.5" /></div>
              <div><label className="label">FC (lpm)</label><input name="heart_rate" type="number" className="input" placeholder="72" /></div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Historial clínico</h3>
            <div className="space-y-3">
              <div><label className="label">Diagnóstico</label><textarea name="diagnosis" rows={2} className="input" required /></div>
              <div><label className="label">Tratamiento</label><textarea name="treatment" rows={2} className="input" /></div>
              <div><label className="label">Recomendaciones</label><textarea name="recommendations" rows={2} className="input" /></div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Receta</h3>
              <button type="button" onClick={addItem} className="btn-secondary">
                <Plus className="h-4 w-4" /> Añadir medicamento
              </button>
            </div>
            {items.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Sin medicamentos añadidos.</p>}
            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <div className="grid gap-2 md:grid-cols-2">
                    <select
                      className="input"
                      value={it.medication_id}
                      onChange={(e) => {
                        const med = meds.find(m => m.id === e.target.value)
                        updateItem(i, { medication_id: e.target.value, medication_name: med?.name ?? '' })
                      }}
                      required
                    >
                      <option value="">Selecciona medicamento</option>
                      {meds.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <input className="input" placeholder="Dosis (ej. 500 mg)" value={it.dosage} onChange={e => updateItem(i, { dosage: e.target.value })} required />
                    <input className="input" placeholder="Frecuencia (cada 8 h)" value={it.frequency} onChange={e => updateItem(i, { frequency: e.target.value })} />
                    <input className="input" placeholder="Duración (7 días)" value={it.duration} onChange={e => updateItem(i, { duration: e.target.value })} />
                    <input className="input md:col-span-2" placeholder="Indicaciones adicionales" value={it.instructions} onChange={e => updateItem(i, { instructions: e.target.value })} />
                  </div>
                  <button type="button" onClick={() => removeItem(i)} className="btn-danger mt-2">
                    <Trash2 className="h-3 w-3" /> Eliminar
                  </button>
                </div>
              ))}
            </div>
          </section>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button disabled={saving} className="btn-primary">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Guardar y completar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
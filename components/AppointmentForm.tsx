'use client'
import { useState } from 'react'
import { CheckCircle2, Loader2, Copy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function AppointmentForm({ specialties }: { specialties: string[] }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null); setCode(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    
    // Usamos .rpc() en lugar de .insert() tal como pide la instrucción
    const { data: accessCode, error } = await supabase.rpc('create_appointment', {
      p_patient_name: String(fd.get('patient_name') ?? '').trim(),
      p_weight: Number(fd.get('weight')),
      p_height: Number(fd.get('height')),
      p_phone: String(fd.get('phone') ?? '').trim(),
      p_email: String(fd.get('email') ?? '').trim(), // <-- NUEVO
      p_specialty: String(fd.get('specialty')),
      p_appointment_date: String(fd.get('appointment_date')),
      p_appointment_time: String(fd.get('appointment_time')),
      p_notes: String(fd.get('notes') ?? '').trim() || null,
    })
      
    setLoading(false)
    if (error) { toast.error("Error al agendar", { description: error.message }); return }
    
    // Enviar correo (sin bloquear si falla)
    fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: String(fd.get('email')),
        patientName: String(fd.get('patient_name')),
        code: accessCode,
        type: 'created',
        date: `${fd.get('appointment_date')} a las ${fd.get('appointment_time')}`,
        specialty: String(fd.get('specialty')),
      })
    })

    toast.success("¡Cita solicitada!", { description: `Código: ${accessCode}` })
    setCode(accessCode as string)
    form.reset()

    // Línea agregada al final del submit
    toast.success("Medicamento agregado")
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="patient_name">Nombre completo</label>
          <input id="patient_name" name="patient_name" className="input" placeholder="Ej. Juan Pérez" required />
        </div>
        <div>
          <label className="label" htmlFor="phone">Teléfono</label>
          <input id="phone" name="phone" type="tel" className="input" placeholder="Ej. 999 888 777" required />
        </div>
        <div>
          <label className="label" htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" className="input" placeholder="Ej. juan@gmail.com" required />
        </div>
        <div>
          <label className="label" htmlFor="weight">Peso (kg)</label>
          <input id="weight" name="weight" type="number" step="0.1" min="1" className="input" placeholder="Ej. 70.5" required />
        </div>
        <div>
          <label className="label" htmlFor="height">Talla (cm)</label>
          <input id="height" name="height" type="number" step="0.1" min="30" className="input" placeholder="Ej. 175" required />
        </div>
        <div>
          <label className="label" htmlFor="specialty">Especialidad</label>
          <select id="specialty" name="specialty" className="input" required defaultValue="">
            <option value="" disabled>Selecciona una especialidad</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="appointment_date">Fecha</label>
            <input id="appointment_date" name="appointment_date" type="date" className="input" required min={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className="label" htmlFor="appointment_time">Hora</label>
            <input id="appointment_time" name="appointment_time" type="time" className="input" required />
          </div>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">Notas / Motivo de consulta (opcional)</label>
        <textarea id="notes" name="notes" rows={3} className="input" placeholder="Describe brevemente tus síntomas..." />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300 font-mono">{error}</p>}
      
      {code && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> ¡Cita solicitada con éxito!
          </p>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
            Guarda tu código para consultar el estado de tu atención:
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="rounded-lg bg-white px-3 py-1.5 font-mono text-lg font-bold text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
              {code}
            </code>
            <button type="button" onClick={() => navigator.clipboard.writeText(code)} className="btn-secondary">
              <Copy className="h-4 w-4" /> Copiar
            </button>
          </div>
        </div>
      )}

      <button disabled={loading} className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 mt-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Solicitar cita
      </button>
    </form>
  )
}
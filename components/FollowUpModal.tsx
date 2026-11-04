'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, CalendarPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function FollowUpModal({ appointment, onClose }: { appointment: any, onClose: () => void }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    
    // Usamos la misma función RPC que usa el paciente
    const { data: newCode, error } = await supabase.rpc('create_appointment', {
      p_patient_name: appointment.patient_name,
      p_weight: appointment.weight,
      p_height: appointment.height,
      p_phone: appointment.phone,
      p_email: appointment.email || null,
      p_specialty: appointment.specialty,
      p_appointment_date: String(fd.get('appointment_date')),
      p_appointment_time: String(fd.get('appointment_time')),
      p_notes: String(fd.get('notes') || '') || 'Cita de seguimiento médico.',
    })

    if (error) {
      setLoading(false)
      toast.error("Error al agendar seguimiento", { description: error.message })
      return
    }

    // Enviar correo si el paciente tiene uno registrado
    if (appointment.email) {
      fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify({
          to: appointment.email,
          patientName: appointment.patient_name,
          code: newCode,
          type: 'followup',
          date: `${fd.get('appointment_date')} a las ${fd.get('appointment_time')}`,
          specialty: appointment.specialty,
        })
      })
    }

    toast.success("Seguimiento agendado", { description: `Código: ${newCode}` })
    setLoading(false)
    onClose()
    router.refresh()
  }

  // Fecha mínima de mañana
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().slice(0, 10)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <CalendarPlus className="h-5 w-5 text-blue-500" /> Agendar Seguimiento
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.patient_name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Fecha</label>
              <input name="appointment_date" type="date" min={minDate} className="input" required />
            </div>
            <div>
              <label className="label">Hora</label>
              <input name="appointment_time" type="time" className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Motivo / Notas</label>
            <textarea name="notes" rows={2} className="input" placeholder="Ej. Revisión de análisis clínicos..." />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button disabled={loading} className="btn-primary">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Agendar y Notificar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
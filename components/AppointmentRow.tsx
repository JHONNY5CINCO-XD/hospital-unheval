'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CompleteAppointmentModal } from './CompleteAppointmentModal'
import { PatientHistoryModal } from './PatientHistoryModal'
import { FollowUpModal } from './FollowUpModal'
import { CalendarPlus } from 'lucide-react';

const statusStyles: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}
const statusLabels: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada',
  completed: 'Completada', cancelled: 'Cancelada',
}


export function AppointmentRow({
  appointment, specialistId, canEdit = false,
}: { appointment: any; specialistId?: string; canEdit?: boolean }) {
  const supabase = createClient()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [openComplete, setOpenComplete] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const [openFollowUp, setOpenFollowUp] = useState(false)

  async function update(status: string) {
    setBusy(true)
    await supabase.from('appointments').update({ status }).eq('id', appointment.id)
    setBusy(false); router.refresh()
  }

  return (
    <>
      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{appointment.patient_name}</span>
            <span className={`badge ${statusStyles[appointment.status]}`}>{statusLabels[appointment.status]}</span>
            <span className="font-mono text-xs text-slate-400">{appointment.access_code}</span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            📅 {appointment.appointment_date} · 🕐 {appointment.appointment_time?.slice(0,5)} · 📞 {appointment.phone}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-500">
            ⚖️ {appointment.weight} kg · 📏 {appointment.height} cm
            {appointment.notes && <> · 📝 {appointment.notes}</>}
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-2">
            {/* El botón de Ver Historial se mueve aquí arriba para que esté visible en cualquier estado */}
            <button onClick={() => setOpenHistory(true)} className="btn-secondary text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30">
              Ver Historial
            </button>
            <button onClick={() => setOpenFollowUp(true)} className="btn-secondary text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30">
            <CalendarPlus className="h-4 w-4 mr-1 inline" /> Seguimiento
            </button>

            {appointment.status === 'pending' && (
              <>
                <button disabled={busy} onClick={() => update('confirmed')} className="btn-primary">Confirmar</button>
                <button disabled={busy} onClick={() => update('cancelled')} className="btn-secondary">Cancelar</button>
              </>
            )}
            
            {appointment.status === 'confirmed' && specialistId && (
              <button disabled={busy} onClick={() => setOpenComplete(true)} className="btn-primary">Completar consulta</button>
            )}
          </div>
        )}
      </div>

      {openComplete && specialistId && (
        <CompleteAppointmentModal
          appointment={appointment}
          specialistId={specialistId}
          onClose={() => setOpenComplete(false)}
        />
      )}

      {openHistory && (
        <PatientHistoryModal
          phone={appointment.phone}
          name={appointment.patient_name}
          onClose={() => setOpenHistory(false)}
        />
      )}
      {openFollowUp && (
        <FollowUpModal 
          appointment={appointment} 
          onClose={() => setOpenFollowUp(false)} 
        />
      )}

    </>
  )
}
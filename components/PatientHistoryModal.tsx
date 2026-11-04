'use client'
import { useEffect, useState } from 'react'
import { X, Loader2, FileText, Pill } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function PatientHistoryModal({ phone, name, onClose }: { phone: string, name: string, onClose: () => void }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    supabase.rpc('get_patient_history', { p_phone: phone }).then(({ data }) => {
      setHistory(data ?? [])
      setLoading(false)
    })
  }, [phone, supabase])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Historial de {name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Teléfono: {phone}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          ) : history.length === 0 ? (
            <p className="text-center text-slate-500 py-10">No hay registros médicos previos.</p>
          ) : (
            history.map((item, i) => {
              const a = item.appointment
              const mr = item.medical_record
              const rx = item.prescriptions ?? []
              if (!mr && rx.length === 0) return null // Solo mostrar si hay datos clínicos
              
              return (
                <div key={i} className="rounded-xl border border-slate-200 p-5 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{a.specialty}</span>
                    <span className="text-sm text-slate-500">{a.appointment_date}</span>
                  </div>
                  
                  {mr && (
                    <div className="mb-4 text-sm space-y-2">
                      <p className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4" /> Diagnóstico: <span className="font-normal text-slate-600 dark:text-slate-300">{mr.diagnosis}</span></p>
                      <p className="flex items-center gap-2 font-medium">Tratamiento: <span className="font-normal text-slate-600 dark:text-slate-300">{mr.treatment}</span></p>
                      {mr.recommendations && <p className="flex items-center gap-2 font-medium">Recomendaciones: <span className="font-normal text-slate-600 dark:text-slate-300">{mr.recommendations}</span></p>}
                    </div>
                  )}

                  {rx.length > 0 && (
                    <div className="text-sm">
                      <p className="flex items-center gap-2 font-medium mb-2"><Pill className="h-4 w-4" /> Receta:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-2">
                        {rx.map((p: any, idx: number) => (
                          <li key={idx}>{p.medication_name} - {p.dosage} ({p.frequency})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
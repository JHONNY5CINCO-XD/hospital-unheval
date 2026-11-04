'use client'
import { useState } from 'react'
import { Loader2, FileText, Pill, Calendar, Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada',
  completed: 'Completada', cancelled: 'Cancelada',
}
const statusStyles: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export function PatientPortal() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null); setData(null)
    const fd = new FormData(e.currentTarget)
    
    // Usamos la función RPC que creamos
    const { data: result, error } = await supabase.rpc('get_appointment_by_code', {
      p_code: String(fd.get('code')).trim().toUpperCase(),
      p_phone: String(fd.get('phone')).trim(),
    })
    setLoading(false)
    if (error || !result) { setError('No encontramos una cita con esos datos. Verifica el código y el teléfono.'); return }
    setData(result)
  }

  if (data) {
    const a = data.appointment
    const mr = data.medical_record
    const rx = data.prescriptions ?? []
    const isCompleted = a.status === 'completed'

    return (
      <>
        {/* ========================================== */}
        {/* VISTA WEB (Se oculta al imprimir)          */}
        {/* ========================================== */}
        <div className="space-y-6 print:hidden">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Cita de {a.patient_name}</h2>
              <span className={`badge ${statusStyles[a.status]}`}>{statusLabels[a.status]}</span>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
              <p><Calendar className="mr-1 inline h-4 w-4" /> {a.appointment_date} · {a.appointment_time?.slice(0,5)}</p>
              <p>🩺 {a.specialty}</p>
              <p>📞 {a.phone}</p>
              <p>📏 {a.height} cm · ⚖️ {a.weight} kg</p>
            </div>
          </div>

          {mr && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5" /> Diagnóstico</h3>
              <dl className="mt-3 space-y-3 text-sm">
                {mr.diagnosis && <div><dt className="font-semibold text-slate-700 dark:text-slate-300">Diagnóstico</dt><dd className="text-slate-600 dark:text-slate-400">{mr.diagnosis}</dd></div>}
                {mr.treatment && <div><dt className="font-semibold text-slate-700 dark:text-slate-300">Tratamiento</dt><dd className="text-slate-600 dark:text-slate-400">{mr.treatment}</dd></div>}
                {mr.recommendations && <div><dt className="font-semibold text-slate-700 dark:text-slate-300">Recomendaciones</dt><dd className="text-slate-600 dark:text-slate-400">{mr.recommendations}</dd></div>}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 md:grid-cols-4">
                  {mr.blood_pressure && <div>PA: {mr.blood_pressure}</div>}
                  {mr.temperature && <div>T°: {mr.temperature} °C</div>}
                  {mr.heart_rate && <div>FC: {mr.heart_rate} lpm</div>}
                </div>
              </dl>
            </div>
          )}

          {rx.length > 0 && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold"><Pill className="h-5 w-5" /> Receta</h3>
              <ul className="mt-3 space-y-3">
                {rx.map((p: any) => (
                  <li key={p.id} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{p.medication_name} — {p.dosage}</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {[p.frequency, p.duration].filter(Boolean).join(' · ')}
                    </p>
                    {p.instructions && <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-500">{p.instructions}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 print:hidden">
            <button onClick={() => { setData(null); setError(null) }} className="btn-secondary w-full py-3">Consultar otra cita</button>
            {isCompleted && (
              <button onClick={() => window.print()} className="btn-primary w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                <Printer className="h-5 w-5" /> Imprimir Receta
              </button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* VISTA DE IMPRESIÓN (Solo se ve al imprimir)*/}
        {/* ========================================== */}
        <div className="hidden print:block text-black bg-white w-full max-w-3xl mx-auto p-8 font-serif">
          {/* Encabezado Oficial */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img src="/icon-192.png" alt="Logo Unheval" className="w-20 h-20 object-contain" />
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide">Hospital Unheval</h1>
                <p className="text-sm text-gray-600">Atención Médica de Calidad</p>
                <p className="text-xs text-gray-500">Av. Universidad 123, Huánuco - Perú</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">RECETA MÉDICA</p>
              <p className="text-xs text-gray-600">Código: {a.access_code}</p>
              <p className="text-xs text-gray-600">Fecha: {a.appointment_date}</p>
            </div>
          </div>

          {/* Datos del Paciente */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p><span className="font-bold">Paciente:</span> {a.patient_name}</p>
              <p><span className="font-bold">Teléfono:</span> {a.phone}</p>
            </div>
            <div>
              <p><span className="font-bold">Peso:</span> {a.weight} kg</p>
              <p><span className="font-bold">Talla:</span> {a.height} cm</p>
            </div>
          </div>

          {/* Diagnóstico */}
          {mr && (
            <div className="mb-6 text-sm">
              <h3 className="font-bold border-b border-gray-300 mb-2 pb-1">DIAGNÓSTICO Y TRATAMIENTO</h3>
              <p className="mb-1"><span className="font-semibold">Diagnóstico:</span> {mr.diagnosis || 'No registrado'}</p>
              <p className="mb-1"><span className="font-semibold">Tratamiento:</span> {mr.treatment || 'No registrado'}</p>
              {mr.recommendations && <p><span className="font-semibold">Recomendaciones:</span> {mr.recommendations}</p>}
            </div>
          )}

          {/* Receta */}
          {rx.length > 0 && (
            <div className="mb-10 text-sm">
              <h3 className="font-bold border-b border-gray-300 mb-2 pb-1">PRESCRIPCIÓN MÉDICA</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 font-bold">Medicamento</th>
                    <th className="border border-gray-300 p-2 font-bold">Dosis</th>
                    <th className="border border-gray-300 p-2 font-bold">Frecuencia / Duración</th>
                    <th className="border border-gray-300 p-2 font-bold">Indicaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rx.map((p: any) => (
                    <tr key={p.id}>
                      <td className="border border-gray-300 p-2">{p.medication_name}</td>
                      <td className="border border-gray-300 p-2">{p.dosage}</td>
                      <td className="border border-gray-300 p-2">
                        {[p.frequency, p.duration].filter(Boolean).join(' · ')}
                      </td>
                      <td className="border border-gray-300 p-2 text-xs">{p.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Firma */}
          <div className="mt-20 flex flex-col items-center justify-center">
            <div className="w-64 border-t border-gray-800 pt-2 text-center">
              <p className="font-bold text-sm">Firma y Sello del Médico</p>
              <p className="text-xs text-gray-600">Especialista en {a.specialty}</p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Este documento es una receta médica oficial generada por el sistema del Hospital Unheval.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="code">Código de cita</label>
        <input id="code" name="code" className="input font-mono uppercase" placeholder="UNH-XXXX-XXXX" required />
      </div>
      <div>
        <label className="label" htmlFor="phone">Teléfono registrado</label>
        <input id="phone" name="phone" type="tel" className="input" required />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Consultar
      </button>
    </form>
  )
}
'use client'
import { useState } from 'react'
import { Download, Search, Calendar, Phone, Mail } from 'lucide-react'

export function AdminAppointmentsTable({ appointments }: { appointments: any[] }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = appointments.filter(a => {
    const matchesSearch = a.patient_name.toLowerCase().includes(search.toLowerCase()) || a.access_code.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus
    return matchesSearch && matchesStatus
  })

  function exportCSV() {
    const headers = ['Código', 'Paciente', 'Teléfono', 'Especialidad', 'Fecha', 'Hora', 'Estado']
    const rows = filtered.map(a => [
      a.access_code, a.patient_name, a.phone, a.specialty, a.appointment_date, a.appointment_time, a.status
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `citas_unheval_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            placeholder="Buscar por paciente o código..." 
            className="input pl-9" 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="input w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <button onClick={exportCSV} className="btn-secondary bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Fecha / Hora</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-xs">{a.access_code}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{a.patient_name}</td>
                <td className="px-4 py-3 text-slate-500 text-xs space-y-1">
                  <p className="flex items-center gap-1"><Phone className="h-3 w-3"/> {a.phone}</p>
                  {a.email && <p className="flex items-center gap-1"><Mail className="h-3 w-3"/> {a.email}</p>}
                </td>
                <td className="px-4 py-3">{a.specialty}</td>
                <td className="px-4 py-3 text-slate-500">
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {a.appointment_date}</p>
                  <p className="text-xs">{a.appointment_time?.slice(0,5)}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${
                    a.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    a.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    a.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {a.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-10 text-slate-500">No se encontraron citas con esos filtros.</p>}
      </div>
    </div>
  )
}
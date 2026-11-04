'use client'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from 'recharts'
import { Users, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export function AdminStats({ stats }: { stats: any }) {
  const kpis = [
    { label: 'Citas totales', value: stats.total_appointments, icon: Calendar, color: 'text-blue-600' },
    { label: 'Pacientes únicos', value: stats.total_patients, icon: Users, color: 'text-teal-600' },
    { label: 'Pendientes', value: stats.pending, icon: Clock, color: 'text-amber-600' },
    { label: 'Completadas', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Canceladas', value: stats.cancelled, icon: XCircle, color: 'text-red-600' },
  ]

  const statusData = [
    { name: 'Pendientes', value: stats.pending },
    { name: 'Confirmadas', value: stats.confirmed },
    { name: 'Completadas', value: stats.completed },
    { name: 'Canceladas', value: stats.cancelled },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map(k => (
          <div key={k.label} className="card p-4">
            <k.icon className={`h-5 w-5 ${k.color}`} />
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{k.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Citas por especialidad</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.by_specialty}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="specialty" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Estado de citas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Citas por mes</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.by_month}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
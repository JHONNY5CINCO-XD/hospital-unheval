import { PatientPortal } from '@/components/PatientPortal'

export default function ConsultaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Consulta tu cita</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Ingresa el código que recibiste al agendar y tu teléfono.
        </p>
      </div>
      <PatientPortal />
    </div>
  )
}
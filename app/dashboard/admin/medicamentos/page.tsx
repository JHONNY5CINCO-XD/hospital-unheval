import { createClient } from '@/lib/supabase/server'
import { MedicationForm } from '@/components/MedicationForm'
import { MedicationTable } from '@/components/MedicationTable'

export default async function MedicationsPage() {
  const supabase = await createClient()
  const { data: meds } = await supabase.from('medications').select('*').order('name')
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medicamentos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Catálogo disponible para prescripción.</p>
      </div>
      <MedicationForm />
      <MedicationTable medications={meds ?? []} />
    </div>
  )
}
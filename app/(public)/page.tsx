import { CalendarCheck, Stethoscope, HeartPulse, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { AppointmentForm } from '@/components/AppointmentForm'
import { SPECIALTIES } from '@/lib/specialties'
import Image from 'next/image'

const services = [
  { name: 'Medicina General', icon: Stethoscope, desc: 'Consulta integral y preventiva para toda la familia.' },
  { name: 'Psicología', icon: HeartPulse, desc: 'Apoyo emocional y cuidado de tu salud mental.' },
  { name: 'Odontología', icon: ShieldCheck, desc: 'Cuidado dental profesional y estético.' },
  { name: 'Nutrición', icon: Clock, desc: 'Planes alimenticios diseñados a tu medida.' },
]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">
        {/* Adorno de fondo */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10 pointer-events-none" />
        
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Atención 24/7
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl leading-[1.1]">
              Tu salud en manos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">profesionales</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300">
              En el <strong>Hospital Unheval</strong> agenda tu cita en línea con el especialista que necesitas. Rápido, seguro y sin filas.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#cita" className="btn-primary bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                <CalendarCheck className="h-5 w-5" /> Pedir cita ahora
              </a>
              <a href="#servicios" className="btn-secondary group">
                Ver especialidades
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Tarjeta flotante con efecto cristal */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-2xl dark:opacity-30" />
            <div className="relative rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60">
              <div className="flex items-center gap-4 mb-6">
                <Image src="/icon-192.png" alt="Logo Unheval" width={56} height={56} className="rounded-full shadow-md" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Disponibilidad</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">+12 especialistas</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Atención presencial y telemedicina con los mejores profesionales de la región.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <div className="font-semibold text-emerald-700 dark:text-emerald-400">Emergencias</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">24 horas</div>
                </div>
                <div className="rounded-xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <div className="font-semibold text-teal-700 dark:text-teal-400">Consultas</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Lun a Sáb</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="relative bg-white py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Nuestras Especialidades</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Contamos con las principales áreas de atención médica para cuidar de ti y tu familia.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.name} className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500/50">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-900 dark:text-emerald-400 dark:group-hover:bg-emerald-500">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO DE CITA */}
      <section id="cita" className="relative bg-slate-50 py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Solicita tu cita médica</h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">Completa tus datos y te atenderemos en la fecha elegida.</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-10 blur-xl dark:opacity-20 pointer-events-none" />
            <AppointmentForm specialties={[...SPECIALTIES]} />
          </div>
        </div>
      </section>
    </div>
  )
}
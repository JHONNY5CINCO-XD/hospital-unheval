'use client'
import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { CompleteAppointmentModal } from './CompleteAppointmentModal'

export function SpecialistCalendar({ appointments, specialistId }: { appointments: any[], specialistId: string }) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  
  // Estado para manejar la vista inicial de forma responsiva y segura
  const [currentView, setCurrentView] = useState('timeGridWeek')

  // Detectamos el ancho de pantalla una vez que el componente monta en el navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultView = window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek'
      setCurrentView(defaultView)
    }
  }, [])

  // Convertimos las citas de la BD al formato de FullCalendar
  const events = appointments.map(a => {
    let color = '#3b82f6' // Azul (Confirmada)
    if (a.status === 'pending') color = '#f59e0b' // Amarillo (Pendiente)
    if (a.status === 'completed') color = '#10b981' // Verde (Completada)
    if (a.status === 'cancelled') color = '#ef4444' // Rojo (Cancelada)

    return {
      id: a.id,
      title: `${a.patient_name} (${a.status === 'pending' ? 'Pdte' : 'Conf'})`,
      start: `${a.appointment_date}T${a.appointment_time}`,
      backgroundColor: color,
      borderColor: color,
      extendedProps: { ...a }
    }
  })

  function handleEventClick(info: any) {
    const originalAppointment = appointments.find(a => a.id === info.event.id)
    if (originalAppointment) setSelectedAppointment(originalAppointment)
  }

  return (
    <div className="card p-4 md:p-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
      <style>{`
        /* Ajustes para que FullCalendar se vea bien en Modo Oscuro */
        .fc { --fc-border-color: #334155; --fc-page-bg-color: transparent; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #334155; }
        .fc-col-header-cell { background-color: #1e293b; color: #f8fafc; padding: 8px 0; }
        .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 700; text-transform: capitalize; }
        .fc-button-primary { background-color: #3b82f6 !important; border-color: #3b82f6 !important; }
        .fc-button-primary:hover { background-color: #2563eb !important; }
        .fc-button-active { background-color: #1d4ed8 !important; }
        .fc-daygrid-day-number, .fc-timegrid-axis-cushion, .fc-timegrid-slot-label-cushion { color: #94a3b8; }
        .dark .fc-day-today { background-color: rgba(59, 130, 246, 0.1) !important; }
        
        /* Ocular botones de texto largos en móviles para que no se desborde la barra */
        @media (max-width: 767px) {
          .fc-toolbar { flex-direction: column; gap: 8px; }
        }
      `}</style>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        // Usamos una 'key' dinámica vinculada a la vista para forzar el redibujado correcto en el cliente
        key={currentView} 
        initialView={currentView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale={esLocale}
        events={events}
        eventClick={handleEventClick}
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        height="auto"
        aspectRatio={1.5}
        eventContent={(eventInfo) => (
          <div className="p-1 text-xs overflow-hidden whitespace-nowrap font-medium">
            {eventInfo.timeText} - {eventInfo.event.title}
          </div>
        )}
      />

      {selectedAppointment && (
        <CompleteAppointmentModal
          appointment={selectedAppointment}
          specialistId={specialistId}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  )
}
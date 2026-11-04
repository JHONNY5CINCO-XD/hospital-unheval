import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { to, patientName, code, type, date, specialty, prescriptions } = await req.json()

    if (!to) return NextResponse.json({ error: 'Falta el correo' }, { status: 400 })

    let subject = ''
    let html = ''

    if (type === 'created') {
      subject = '🩺 Cita Solicitada - Hospital Unheval'
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10b981;">¡Hola ${patientName}!</h2>
          <p>Tu solicitud de cita para <strong>${specialty}</strong> ha sido recibida con éxito.</p>
          <p>Fecha tentativa: <strong>${date}</strong></p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Tu código de consulta es:</p>
            <h1 style="margin: 5px 0; color: #1d4ed8; letter-spacing: 2px;">${code}</h1>
          </div>
          <p>Puedes revisar el estado de tu cita en cualquier momento ingresando a nuestro portal web con este código.</p>
          <p>¡Te esperamos!</p>
        </div>
      `
    } else if (type === 'followup') {
      subject = '📅 Cita de Seguimiento Agendada - Hospital Unheval'
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #3b82f6;">¡Hola ${patientName}!</h2>
          <p>Tu médico especialista ha agendado una **cita de seguimiento** para tu atención en <strong>${specialty}</strong>.</p>
          <p>Fecha y hora programada: <strong>${date}</strong></p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Puedes consultar los detalles con tu código:</p>
            <h1 style="margin: 5px 0; color: #1d4ed8; letter-spacing: 2px;">${code}</h1>
          </div>
          <p>Por favor, preséntate 10 minutos antes de tu cita. ¡Te esperamos!</p>
        </div>
      `
    } else if (type === 'completed') {
      subject = '📋 Tu Receta Médica - Hospital Unheval'
      const rxList = prescriptions.map((p: any) => `<li>${p.medication_name} - ${p.dosage} (${p.frequency})</li>`).join('')
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #3b82f6;">Atención Completada</h2>
          <p>Hola ${patientName}, tu consulta de <strong>${specialty}</strong> ha finalizado.</p>
          <p>El doctor ha dejado la siguiente prescripción médica:</p>
          <ul style="background: #f8fafc; padding: 20px; border-radius: 8px; line-height: 1.6;">
            ${rxList}
          </ul>
          <p>Puedes ingresar a la web con tu código <strong>${code}</strong> para ver los detalles completos y descargar tu receta en PDF.</p>
        </div>
      `
    }

    await resend.emails.send({
      from: 'Hospital Unheval <onboarding@resend.dev>', // Este dominio es de prueba de Resend
      to: [to],
      subject,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

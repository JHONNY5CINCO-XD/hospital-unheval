export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Política y Privacidad</h1>
      <p className="mt-2 text-sm text-slate-500">Última actualización: 26/10/2026</p>

      <div className="prose prose-slate mt-8 max-w-none">
        <h2 className="mt-8 text-xl font-semibold">1. Datos que recopilamos</h2>
        <p>Recopilamos tu nombre, teléfono, peso, talla, especialidad, fecha y hora de cita únicamente con fines de atención médica.</p>

        <h2 className="mt-8 text-xl font-semibold">2. Uso de la información</h2>
        <p>Los datos son visibles solo para el personal autorizado del Hospital Unheval (especialistas y administradores) a través de un portal privado.</p>

        <h2 className="mt-8 text-xl font-semibold">3. Almacenamiento y seguridad</h2>
        <p>La información se almacena cifrada en Supabase y se protege con políticas de acceso por rol. Nadie sin autorización puede leerla.</p>

        <h2 className="mt-8 text-xl font-semibold">4. Derechos del paciente</h2>
        <p>Puedes solicitar la rectificación o eliminación de tus datos escribiendo a <a className="text-blue-600 underline" href="mailto:privacidad@hospitalunheval.pe">privacidad@hospitalunheval.pe</a>.</p>

        <h2 className="mt-8 text-xl font-semibold">5. Cookies</h2>
        <p>Usamos cookies estrictamente necesarias para mantener tu sesión en el portal de personal.</p>
      </div>
    </article>
  )
}
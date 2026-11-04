import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', status: 401 } as const
  
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
    
  if (profile?.role !== 'admin') return { error: 'No autorizado', status: 403 } as const
  return { ok: true as const }
}

export async function POST(req: NextRequest) {
  const check = await assertAdmin()
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status })

  try {
    const { email, password, full_name, specialty, phone } = await req.json()
    if (!email || !password || !full_name || !specialty) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.createUser({
      email, 
      password, 
      email_confirm: true,
      user_metadata: { full_name, role: 'specialist', specialty, phone },
    })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, id: data.user?.id })
    
  } catch (err: any) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
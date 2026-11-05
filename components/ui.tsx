'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
      }}
      /* Modificamos el padding (p-2) para móvil y md:px-4 para pantallas más grandes */
      className="btn-secondary flex items-center gap-2 p-2 md:px-4 md:py-2"
    >
      <LogOut className="h-4 w-4" /> 
      {/* Oculta la palabra 'Salir' en móviles y la muestra a partir de tablets/PC (md) */}
      <span className="hidden md:inline">Salir</span>
    </button>
  )
}

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
        router.push('/login'); router.refresh()
      }}
      className="btn-secondary"
    >
      <LogOut className="h-4 w-4" /> Salir
    </button>
  )
}
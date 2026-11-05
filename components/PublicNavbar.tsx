'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <Image src="/icon-192.png" alt="Logo" width={32} height={32} className="rounded-full" />
          Hospital Unheval
        </Link>

        {/* Menú de Escritorio */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/consulta" className="hover:text-blue-600 dark:hover:text-blue-400">Mi cita</Link>
          <Link href="/#servicios" className="hover:text-blue-600 dark:hover:text-blue-400">Servicios</Link>
          <Link href="/#cita" className="hover:text-blue-600 dark:hover:text-blue-400">Pedir cita</Link>
          <Link href="/privacidad" className="hover:text-blue-600 dark:hover:text-blue-400">Política y Privacidad</Link>
          <ThemeToggle />
          <Link href="/login" className="btn-primary">Portal de personal</Link>
        </nav>

        {/* Controles Móviles */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/consulta" className="text-sm font-semibold text-blue-600 dark:text-blue-400">Mi cita</Link>
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-300">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/#servicios" onClick={() => setIsOpen(false)}>Servicios</Link>
            <Link href="/#cita" onClick={() => setIsOpen(false)}>Pedir cita</Link>
            <Link href="/privacidad" onClick={() => setIsOpen(false)}>Política y Privacidad</Link>
            <Link href="/login" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Portal de personal</Link>
          </div>
        </div>
      )}
    </header>
  )
}
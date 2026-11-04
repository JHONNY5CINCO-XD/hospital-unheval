import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Image src="/icon-192.png" alt="Logo" width={32} height={32} className="rounded-full" />
            Hospital Unheval
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <Link href="/consulta" className="hover:text-blue-600 dark:hover:text-blue-400">Mi cita</Link>
            <Link href="/#servicios" className="hover:text-blue-600 dark:hover:text-blue-400">Servicios</Link>
            <Link href="/#cita" className="hover:text-blue-600 dark:hover:text-blue-400">Pedir cita</Link>
            <Link href="/privacidad" className="hover:text-blue-600 dark:hover:text-blue-400">Política y Privacidad</Link>
            <ThemeToggle />
            <Link href="/login" className="btn-primary">Portal de personal</Link>
          </nav>
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <Link href="/login" className="btn-primary">Personal</Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 dark:text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} Hospital Unheval. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-blue-600 dark:hover:text-blue-400">Política y Privacidad</Link>
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Portal de personal</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
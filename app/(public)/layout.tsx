import Link from 'next/link'
import { PublicNavbar } from '@/components/PublicNavbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
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
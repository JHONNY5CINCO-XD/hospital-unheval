import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
          <Image src="/icon-192.png" alt="Logo Unheval" width={40} height={40} className="rounded-full shadow-sm" />
          Hospital Unheval
        </Link>
        <div className="card p-6 md:p-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Portal de personal</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Solo especialistas y administradores autorizados.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
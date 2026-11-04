'use client'
import { createContext, useContext, useState } from 'react'

const TabsContext = createContext<{ value: string, setValue: (v: string) => void } | null>(null)

export function Tabs({ defaultValue, children }: { defaultValue: string, children: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsContext.Provider value={{ value, setValue }}><div className="space-y-6">{children}</div></TabsContext.Provider>
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-px">{children}</div>
}

export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  const isActive = ctx.value === value
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
        isActive 
          ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string, children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  if (ctx.value !== value) return null
  return <div className="pt-4">{children}</div>
}
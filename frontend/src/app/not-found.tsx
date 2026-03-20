// src/app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="bg-muted rounded-full p-6">
        <FileQuestion className="text-muted-foreground h-10 w-10" />
      </div>
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Button asChild>
        <Link href="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  )
}

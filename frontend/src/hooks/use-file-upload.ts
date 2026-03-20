// src/hooks/use-file-upload.ts
import { useState, useRef } from 'react'
const MAX_SIZE = 50 * 1024 * 1024
const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/3gpp',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]
export function useFileUpload(allowedMime = ALLOWED_MIME) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const validate = (f: File) => {
    if (f.size > MAX_SIZE) {
      setError('File melebihi batas 50MB')
      return false
    }
    if (!allowedMime.includes(f.type)) {
      setError('Tipe file tidak diizinkan')
      return false
    }
    return true
  }
  const handleFile = (f: File) => {
    setError(null)
    if (validate(f)) setFile(f)
  }
  const clear = () => {
    setFile(null)
    setError(null)
  }
  return { file, error, inputRef, handleFile, clear }
}

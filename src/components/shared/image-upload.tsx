'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploaderProps {
  image: string | null
  onChange: (image: string, imageBinary: any) => void
}

export function ImageUploader({ image, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Formato de archivo no válido. Usa JPG, PNG, GIF o WEBP.')
      return null
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('El tamaño máximo permitido es de 5MB.')
      return null
    }

    setIsUploading(true)

    try {
      return URL.createObjectURL(file)
    } catch (error) {
      console.error('Error al cargar imagen:', error)
      toast.error('Error al cargar la imagen.')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const imageUrl = await uploadImage(file)
    console.log({ file, imageUrl })
    if (imageUrl) {
      onChange(imageUrl, file)
    }

    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      {image
        ? (
        <Card className="relative group overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={image || '/placeholder.svg'}
              alt="Imagen del producto"
              className="h-full w-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onChange('', null)}
              aria-label="Eliminar imagen"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
          )
        : (
        <Card className="border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
          <label className="flex flex-col items-center justify-center w-full h-full aspect-square cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Haz clic para subir</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              aria-label="Subir imagen"
            />
          </label>
        </Card>
          )}

      {!image && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading
              ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Subiendo...
              </>
                )
              : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Subir imagen
              </>
                )}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB.
      </p>
    </div>
  )
}

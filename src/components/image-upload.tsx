//  <ImageUpload onUploadComplete={(file) => setImageBinary(file)} />
import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImagePlusIcon } from 'lucide-react'
import { Input } from './ui/input'

interface ImageUploadProps {
  onUploadComplete?: (image: File | null) => void
  imageUrl?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, imageUrl }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null
  )

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0]
      void handleImageUpload(image)
    }
  }

  const handleImageUpload = async (image: File) => {
    if (!image) return
    setLoading(true)
    onUploadComplete && onUploadComplete(image)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const image = acceptedFiles[0]
      void handleImageUpload(image)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  useEffect(() => {
    if (imageUrl) {
      setUploadedImagePath(imageUrl)
    }
  }, [imageUrl])

  return (
    <div className="space-y-3 h-fit relative">
      <div {...getRootProps()} className="h-fit relative">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center border-2 border-dashed rounded-lg cursor-pointer  dark:hover:bg-dark-border hover:bg-light-border w-full visually-hidden-focusable h-fit overflow-hidden"
        >
          {/* {loading && (
            <div className="text-center flex flex-col justify-center items-center p-4 gap-2">
              <Loading />
              <div
                className="bg-light-action dark:bg-dark-action text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary text-center p-0.5 leading-none rounded-full"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
              <p className="text-sm font-semibold">Subiendo imagen ...</p>
              <p className="text-xs text-gray-400">
                No actualice ni realice ninguna otra acción mientras la imagen esté
                siendo subido
              </p>
            </div>
          )} */}

          {!loading && !uploadedImagePath && (
            <div className="text-center flex flex-col justify-center items-center gap-2 p-2 text-light-text-secondary dark:text-dark-text-secondary">
              <ImagePlusIcon size="4rem" />

              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Arrastra una imagen</span>
              </p> */}
              <p className="text-sm">
                Seleccione una imagen o arrástrela aquí para cargarla directamente
              </p>
            </div>
          )}

          {uploadedImagePath && !loading && (
            <div className="text-center h-full">
              <img
                width={1000}
                height={1000}
                src={uploadedImagePath}
                className="w-full h-full object-cover aspect-square"
                alt="uploaded image"
              />
              <div className="absolute opacity-0 hover:opacity-100 flex h-full z-10 bottom-0 items-end justify-center px-4 pb-1">
                <p className="text-xs text-light-text-primary dark:text-dark-text-primary drop-shadow-xl">
                  Haga clic aquí para subir otra imagen
                </p>
              </div>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg, image/jpg"
          type="file"
          className="hidden"
          disabled={loading || uploadedImagePath !== null}
          onChange={handleImageChange}
        />
      </div>

      {/* {!!uploadedImagePath && (
        <div className="flex items-center justify-between w-full">
          <Button
            onClick={removeSelectedImage}
            type="button"
            variant="destructive"
            className='w-full'
          >
            {uploadedImagePath ? 'Quitar imagen' : 'Cerrar'}
          </Button>
        </div>
      )} */}
    </div>
  )
}

export default ImageUpload

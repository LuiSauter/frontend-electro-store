/* eslint-disable multiline-ternary */
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PrivateRoutes } from '@/models/routes.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type Category } from '@/modules/inventory/model/category.model'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { useCreateResource, useGetAllResource, useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { ImageUploader } from '@/components/shared/image-upload'
import { type Product } from '@/modules/inventory/model/product.model'

const formSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(3, 'Mínimo 3 caracteres')
    .max(100),
  minimum_stock: z
    .number({ required_error: 'El stock mínimo es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El stock mínimo es requerido'),
  stock: z
    .number({ required_error: 'El stock es requerido' })
    .int('Debe ser un número entero')
    .min(0, 'El stock es requerido'),
  purchase_price: z
    .number({ required_error: 'El precio de compra es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El precio de compra es requerido'),
  sale_price: z
    .number({ required_error: 'El precio de venta es requerido' })
    .int('Debe ser un número entero')
    .positive('Debe ser positivo')
    .min(1, 'El precio de venta es requerido'),
  categoryId: z
    .string()
    .min(1, 'La categoría es requerida'),
  image: z
    .custom<File | null>()
    .refine((value) => value instanceof File || value === null, {
      message: 'La imagen es requerida'
    })
})

const ProductFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Producto', path: PrivateRoutes.PRODUCT },
    { label: title }
  ])
  const { id } = useParams()
  const navigate = useNavigate()
  const { createResource: createProduct, isMutating } = useCreateResource({ endpoint: '/api/product', isImage: true })
  const { updateResource: updateProduct, isMutating: isMutatingUpdate } = useUpdateResource({ endpoint: `/api/product/${id}`, isImage: true })
  const { allResource: categories, mutate, isLoading } = useGetAllResource<Category>({ endpoint: '/api/category', isPagination: false })
  const { resource: product } = useGetResource<Product>({ endpoint: `/api/product/${id}` })
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      minimum_stock: product?.minimum_stock ?? 0,
      stock: product?.stock ?? 0,
      purchase_price: product?.purchase_price ?? 0,
      sale_price: product?.sale_price ?? 0,
      categoryId: product?.category?.id ?? '',
      image: {} as unknown as File
    }
  })
  type FormData = z.infer<typeof formSchema>

  const onSubmit = (data: FormData) => {
    if (id) {
      toast.promise(updateProduct(data), {
        loading: 'Actualizando producto...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.PRODUCT, { replace: true })
          }, 1000)
          return 'Producto actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar el producto'
        }
      })
    } else {
      if (!data.image) {
        toast.error('La imagen es requerida')
        form.setError('image', {
          type: 'custom',
          message: 'La imagen es requerida'
        })
        return
      }
      console.log(data)
      toast.promise(createProduct(data), {
        loading: 'Creando producto...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.PRODUCT, { replace: true })
          }, 1000)
          return 'Producto creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el producto'
        }
      })
      return true
    }
  }

  const handleImageChange = (image: string, imageBinary: File | null) => {
    setImageUrl(image)
    form.setValue('image', imageBinary)
    form.clearErrors('image')
    if (!imageBinary) {
      form.setError('image', {
        type: 'custom',
        message: 'La imagen es requerida'
      })
    }
  }

  useEffect(() => {
    if (product?.image_url) {
      setImageUrl(product?.image_url)
      form.clearErrors('image')
      const file = new File([product?.image_url], 'image.jpg', { type: 'image/jpeg' })
      form.setValue('image', file)
    }
  }, [product?.image_url])

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full flex flex-col gap-4 lg:gap-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  navigate(PrivateRoutes.PRODUCT)
                }}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={() => {
                    navigate(PrivateRoutes.PRODUCT)
                  }}
                  variant="outline"
                  size="sm"
                >
                  Descartar
                </Button>
                <Button type="submit" size="sm" disabled={isMutating}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
            <Card className="w-full md:col-span-2">
              <CardHeader>
                <CardTitle>Datos del Producto</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el nombre del producto"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name='photo_url'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen Url</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa la Url de tu imagen"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="minimum_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Minimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="purchase_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio de Compra</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sale_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio de Venta</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe una descripción"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="w-full md:col-span-1">
              <CardHeader>
                <CardTitle>Asignación</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => {
                    const { createResource: createCategory } = useCreateResource({ endpoint: '/api/category' })
                    const [open, setOpen] = useState(false)
                    const [newCategoryName, setNewCategoryName] = useState('')

                    const handleCreate = () => {
                      toast.promise(
                        createCategory({
                          name: newCategoryName
                        }),
                        {
                          loading: 'Creando...',
                          success: () => {
                            void mutate()
                            setOpen(false)
                            return 'Categoría creada'
                          },
                          error: 'No se pudo crear la categoría'
                        }
                      )
                    }

                    return (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoading ? (
                                <SelectItem key="0" disabled value='loading'>
                                  <span>Cargando...</span>
                                </SelectItem>
                              ) : categories.length === 0 ? (
                                <SelectItem key="0" disabled value='empty'>
                                  <span>No hay categorías</span>
                                </SelectItem>
                              ) : categories.map((category: Category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                  className="flex items-center justify-between"
                                >
                                  <span>{category.name}</span>
                                </SelectItem>
                              ))}
                              <div className="px-2 py-1.5 border-t mt-1">
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      + Crear nueva categoría
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Nueva Categoría</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label>Nombre</Label>
                                        <Input
                                          placeholder="Ej. Electrónica"
                                          value={newCategoryName}
                                          onChange={(e) =>
                                            setNewCategoryName(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter className="gap-2 sm:justify-end">
                                      <DialogClose asChild>
                                        <Button variant="outline">
                                          Cancelar
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        onClick={handleCreate}
                                        disabled={!newCategoryName.trim()}
                                      >
                                        Crear
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <CardTitle>Imagen del Producto</CardTitle>
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader image={imageUrl} onChange={handleImageChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(PrivateRoutes.PRODUCT)
              }}
            >
              Descartar
            </Button>
            <Button type="submit" size="sm" disabled={isMutating ?? isMutatingUpdate}>
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default ProductFormPage

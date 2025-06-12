import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ListFilter, PlusCircle, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useHeader } from '@/hooks'
import useDebounce from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'
import { useCreateResource, useGetAllResource } from '@/hooks/useApiResource'
import { Input } from '@/components/ui/input'
import { type Provider, type Buy } from '../models/buy.model'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { type Product } from '@/modules/inventory/model/product.model'

const FormSchema = z.object({
  totalAmount: z.number().min(0, { message: 'El monto total debe ser mayor o igual a 0' }),
  providerId: z.string().min(1, { message: 'El proveedor es requerido' }),
  details: z.array(z.object({
    productId: z.string().min(1, { message: 'El producto es requerido' }),
    amount: z.number().min(1, { message: 'La cantidad debe ser mayor a 0' }),
    price: z.number().min(0, { message: 'El precio debe ser mayor o igual a 0' }),
    subTotal: z.number().min(0, { message: 'El subtotal debe ser mayor o igual a 0' })

  }))
})

const BuysPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Compras' }
  ])
  const navigate = useNavigate()
  const { allResource: buys, isLoading, countData, filterOptions, setOffset, prevPage, newPage, search, mutate } = useGetAllResource<Buy>({ endpoint: '/api/buy', isPagination: true })
  const { allResource: providers } = useGetAllResource<Provider>({ endpoint: '/api/providers/all', isPagination: false })
  const { allResource: products } = useGetAllResource<Product>({ endpoint: '/api/product', isPagination: false })
  const [searchProduct, setSearchProduct] = useState('')
  const debounceSearchProduct = useDebounce(searchProduct, 1000)
  const { createResource: buyProducts } = useCreateResource({ endpoint: '/api/buy' })

  useEffect(() => {
    search('name', debounceSearchProduct)
  }, [debounceSearchProduct])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'details'
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.promise(
      buyProducts(data),
      {
        loading: 'Guardando compra...',
        success: () => {
          form.reset()
          append({ productId: '', amount: 1, price: 0, subTotal: 0 })
          newPage(countData ?? 0)
          void mutate()
          return 'Compra guardada correctamente'
        },
        error: (error) => {
          console.error(error)
          return 'Error al guardar la compra'
        }
      }
    )
  }

  return (
    <section className='grid gap-4 overflow-hidden w-full relative'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              onChange={(e) => { setSearchProduct(e.target.value) }}
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='ml-auto'>
            <Button variant="outline" size="sm" className="h-8 gap-1"><ListFilter className="h-3.5 w-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Rol</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>Agregar Compra</AlertDialogTitle>
                </AlertDialogHeader>
                <FormField
                  control={form.control}
                  name="providerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un proveedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent >
                          {providers.map(provider => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-5 gap-4 items-end border p-4 rounded-md">
                      {/* Producto */}
                      <FormField
                        control={form.control}
                        name={`details.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Producto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                const selectedProduct = products.find(p => p.id === value)
                                if (selectedProduct) {
                                  const amount = form.watch(`details.${index}.amount`) || 1
                                  form.setValue(`details.${index}.price`, selectedProduct.purchase_price)
                                  form.setValue(`details.${index}.subTotal`, amount * selectedProduct.purchase_price)
                                  form.setValue('totalAmount', (form.watch('totalAmount') || 0) + (amount * selectedProduct.purchase_price))
                                }
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un producto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products?.map(product => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Cantidad */}
                      <FormField
                        control={form.control}
                        name={`details.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  field.onChange(value)
                                  const price = form.watch(`details.${index}.price`) || 0
                                  form.setValue(`details.${index}.subTotal`, value * price)
                                  form.setValue('totalAmount', (form.watch('details').reduce((sum: number, item) => sum + (item.subTotal || 0), 0)))
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Precio */}
                      <FormField
                        control={form.control}
                        name={`details.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                disabled
                                {...field}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  field.onChange(value)
                                  const amount = form.getValues(`details.${index}.amount`) || 0
                                  form.setValue(`details.${index}.subTotal`, amount * value)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Subtotal */}
                      <FormField
                        control={form.control}
                        name={`details.${index}.subTotal`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtotal</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Eliminar */}
                      <Button type="button" variant="destructive" onClick={() => {
                        remove(index)
                        const totalAmount = form.watch('details').reduce((sum: number, item) => sum + (item.subTotal || 0), 0)
                        form.setValue('totalAmount', totalAmount)
                      }}>Eliminar</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => {
                    append({ productId: '', amount: 1, price: 0, subTotal: 0 })
                  }}>
                    Agregar producto
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {form.watch('totalAmount') > 0
                    ? (
                      <Badge className="text-lg font-bold">
                        Total: {form.watch('totalAmount').toFixed(2)} Bs.
                      </Badge>)
                    : (
                      <Badge className="text-lg font-bold text-red-500">
                        Total: 0 Bs.
                      </Badge>)}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <span>Cancelar</span>
                  </AlertDialogCancel>
                  <AlertDialogAction type='submit'>
                    <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Guardar</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Compras</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cantidad Prod.</TableHead>
                  <TableHead>Total (Bs.)</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Información del proveedor</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={filterOptions.limit} columns={8} />
                  : buys?.map((item: Buy) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.buyDetails.length}</TableCell>
                      <TableCell>{item.totalAmount}</TableCell>
                      <TableCell>{item.provider.name}</TableCell>
                      <TableCell>{item.provider.detail}</TableCell>
                      <TableCell>
                        <div className='flex flex-col items-center gap-2'>
                          {item.user.name}
                          {item.user.phone}
                        </div>
                      </TableCell>
                      <TableCell>{item.date + ' ' + item.time}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={buys?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => { newPage(countData ?? 0) }}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => { }}
            params={true}
          />
        </CardFooter>
      </Card>
    </section >
  )
}

export default BuysPage

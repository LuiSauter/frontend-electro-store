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
import { useCreateResource, useGetAllResource } from '@/hooks/useApiResource'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { type Product } from '@/modules/inventory/model/product.model'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'

const FormSchema = z.object({
  reason: z.string().min(1, { message: 'El motivo es requerido' }),
  destination: z.string().min(1, { message: 'El destino es requerido' }),
  additionalNotes: z.string().optional(),
  details: z.array(z.object({
    productId: z.string().min(1, { message: 'El producto es requerido' }),
    amount: z.number().min(1, { message: 'La cantidad debe ser mayor a 0' })
  }))
})

const OutputPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Salidas' }
  ])
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user)
  const { allResource: outputs, isLoading, countData, filterOptions, setOffset, prevPage, newPage, search, mutate } = useGetAllResource<any>({ endpoint: '/api/output', isPagination: true })
  const { allResource: products } = useGetAllResource<Product>({ endpoint: '/api/product', isPagination: false })
  const [searchProduct, setSearchProduct] = useState('')
  const debounceSearchProduct = useDebounce(searchProduct, 1000)
  const { createResource: createOutput } = useCreateResource({ endpoint: '/api/output' })

  useEffect(() => {
    search('reason', debounceSearchProduct)
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
      createOutput({ ...data, userId: user?.id }),
      {
        loading: 'Guardando salida...',
        success: () => {
          form.reset()
          append({ productId: '', amount: 1 })
          newPage(countData ?? 0)
          void mutate()
          return 'Salida guardada correctamente'
        },
        error: (error) => {
          console.error(error)
          return 'Error al guardar la salida'
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
            <DropdownMenuCheckboxItem checked>Motivo</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Destino</DropdownMenuCheckboxItem>
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
                  <AlertDialogTitle>Agregar Salida</AlertDialogTitle>
                </AlertDialogHeader>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo</FormLabel>
                      <FormControl>
                        <Input placeholder="Motivo de la salida" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino</FormLabel>
                      <FormControl>
                        <Input placeholder="Destino" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas adicionales</FormLabel>
                      <FormControl>
                        <Input placeholder="Notas adicionales" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-4 gap-4 items-end border p-4 rounded-md">
                      {/* Producto */}
                      <FormField
                        control={form.control}
                        name={`details.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Producto</FormLabel>
                            <Select
                              onValueChange={field.onChange}
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
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Eliminar */}
                      <Button type="button" variant="destructive" onClick={() => {
                        remove(index)
                      }}>Eliminar</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => {
                    append({ productId: '', amount: 1 })
                  }}>
                    Agregar producto
                  </Button>
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
          <CardTitle>Salida de productos</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Cantidad Prod.</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={filterOptions.limit} columns={7} />
                  : outputs?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date + ' ' + item.time}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.destination}</TableCell>
                      <TableCell>{item.additionalNotes}</TableCell>
                      <TableCell>
                        {item.productOutput.reduce((acc: number, curr: any) => acc + curr.amount, 0)}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col items-center gap-2'>
                          {item.user?.name}-
                          {item.user?.phone}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={outputs?.length ?? 0}
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

export default OutputPage

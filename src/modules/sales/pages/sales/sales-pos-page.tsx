// PosPage.tsx
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGetAllResource, useCreateResource } from '@/hooks/useApiResource'
import { toast } from 'sonner'
import { type User } from '@/modules/users/models/user.model'
import { type Product } from '@/modules/inventory/model/product.model'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// — Esquema de validación:
const SaleSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  nit: z.string().optional(),
  details: z.array(z.object({
    productId: z.string(),
    amount: z.number().min(1),
    price: z.number().nonnegative(),
    subTotal: z.number().nonnegative()
  })).min(1),
  amountPaid: z.number().nonnegative(),
  amountReceivable: z.number().min(0),
  amountReturned: z.number().nonnegative()
})
type SaleForm = z.infer<typeof SaleSchema>

export default function PosPage() {
  const { allResource: clients } = useGetAllResource<User>({ endpoint: '/api/user' })
  const { allResource: products } = useGetAllResource<Product>({ endpoint: '/api/product' })
  // const { createResource: createCustomer } = useCreateResource({ endpoint: '/api/user' })
  const { createResource: createSale } = useCreateResource({ endpoint: '/api/sale-note' })
  const user = useSelector((state: RootState) => state.user)

  const form = useForm<SaleForm>({
    resolver: zodResolver(SaleSchema),
    defaultValues: {
      details: [],
      amountPaid: 0,
      amountReceivable: 0,
      amountReturned: 0
    }
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'details' })

  // Calcular totales
  useEffect(() => {
    const details = form.watch('details')
    const amountPaid = details.reduce((a, d) => a + d.subTotal, 0)
    const amountReceivable = form.watch('amountReceivable') || 0
    form.setValue('amountPaid', amountPaid)
    form.setValue('amountReturned', amountReceivable - amountPaid)
  }, [form.watch('details'), form.watch('amountReceivable')])

  // Enviar venta
  async function onSubmit(data: SaleForm) {
    toast.promise(async () => {
      const customerId = data.customerId
      // if (!customerId) {
      //   const newClient = await createCustomer({
      //     name: data.customerName!,
      //     nit: data.nit,
      //     role: 'client'
      //   })
      //   // customerId = newClient.id
      // }
      return await createSale({
        sellerId: user.id,
        customerId,
        customerName: data.customerName,
        nit: data.nit,
        amountPaid: data.amountPaid,
        amountReceivable: data.amountReceivable,
        amountReturned: data.amountReturned,
        discount: 0,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        details: data.details
      })
    }, {
      loading: 'Procesando venta...',
      success: 'Venta registrada con éxito',
      error: 'Error al procesar venta'
    })
  }

  console.log(form.formState.errors)

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Punto de Venta</h1>

      {/* 🎯 Cliente */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clientes</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {clients?.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Crear cliente si no existe */}
          {!form.watch('customerId') && (
            <div className="grid grid-cols-2 gap-4">
              <FormField name="customerName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre cliente</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="nit" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* 📦 Detalles de productos */}
          <div className="space-y-4">
            {fields.map((item, i) => (
              <div key={item.id} className="grid grid-cols-5 gap-2 items-end">
                <FormField
                  name={`details.${i}.productId`}
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>Producto</FormLabel>
                      <Select onValueChange={v => {
                        const p = products.find(x => x.id === v)
                        const amount = form.getValues(`details.${i}.amount`) || 1
                        form.setValue(`details.${i}.productId`, v)
                        form.setValue(`details.${i}.price`, p?.sale_price ?? 0)
                        form.setValue(`details.${i}.subTotal`, amount * (p?.sale_price ?? 0))
                        form.setValue('amountPaid', form.watch('details').reduce((a: number, d) => a + d.subTotal, 0))
                      }} defaultValue={item.productId}
                      >
                        <FormControl><SelectTrigger><SelectValue placeholder="Elegir producto" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {products?.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — {p.sale_price} Bs.
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>)}
                />

                <FormField name={`details.${i}.amount`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl><Input type="number" min={1}{...field}
                      onChange={e => {
                        const v = Number(e.target.value)
                        field.onChange(v)
                        const price = form.getValues(`details.${i}.price`)
                        form.setValue(`details.${i}.subTotal`, price * v)
                        form.setValue('amountPaid', form.watch('details').reduce((a: number, d) => a + d.subTotal, 0))
                      }}
                    /></FormControl>
                  </FormItem>
                )} />

                {/* Precio */}
                <FormField name={`details.${i}.price`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl><Input {...field} disabled /></FormControl>
                  </FormItem>
                )} />
                <FormField name={`details.${i}.subTotal`} control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtotal</FormLabel>
                    <FormControl><Input {...field} disabled /></FormControl>
                  </FormItem>
                )} />
                <Button variant="destructive" onClick={() => remove(i)}>Eliminar</Button>
              </div>
            ))}
            <Button type='button' onClick={() => append({ productId: '', amount: 1, price: 0, subTotal: 0 })}>
              Agregar Producto
            </Button>
          </div>

          {/* 💰 Totales y cobro */}
          <div className="flex flex-col items-end space-y-2">
            <Badge>Total: {form.watch('amountPaid').toFixed(2)} Bs.</Badge>
            <FormField name="amountReceivable" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Monto entregado</FormLabel>
                <FormControl>
                  <Input type="number" min={0}
                  onChange={e => {
                    const v = Number(e.target.value)
                    field.onChange(v)
                    form.setValue('amountReturned', v - form.watch('amountPaid'))
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Badge color={form.watch('amountReturned') < 0 ? 'destructive' : 'secondary'}>
              Cambio: {form.watch('amountReturned').toFixed(2)} Bs.
            </Badge>
          </div>

          <Button type='submit' size="lg" className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Registrar Venta
          </Button>
        </form>
      </Form>
    </section >
  )
}

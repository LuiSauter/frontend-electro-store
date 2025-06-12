import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useGetAllProduct } from '../../hooks/useProduct'
import { useCreateCustomer } from '@/modules/users/hooks/useCustomer'
import { useValidateOpenCash } from '../../hooks/useCash'
import { useCreateSale } from '../../hooks/useSale'
import Skeleton from '@/components/shared/skeleton'
import { useEffect, useRef, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models'
import { useNavigate } from 'react-router-dom'
import { type Product } from '../../../inventory/model/product.model'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type User } from '@/modules/users/models/user.model'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useGetAllResource } from '@/hooks/useApiResource'
import { type Customer } from '@/modules/users/models/customer.model'
import { useSidebar } from '@/context/sidebarContext'
import { useReactToPrint } from '@/hooks/usePrint'
import { AppConfig } from '@/config'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { Search } from 'lucide-react'

const formSchema = z.object({
  customer: z.string(),
  cash_register: z.string(),
  nit: z.string().optional(),
  details: z.array(
    z.object({
      product: z.string().min(1, { message: 'El producto es requerido' }),
      quantity: z.number().min(1, { message: 'La cantidad es requerida' }),
      price: z.number().min(1, { message: 'El subtotal es requerido' })
    })
  )
})

interface PrintTicket {
  code: string
  date: Date
  total: number
  items: Array<{ name: string, price: number, quantity: number, subtotal: number, id: string }>
  customer?: string
  nit?: string
  cashier: User
  paid?: number
}

const SalePage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Vender' }
  ])
  const navigate = useNavigate()
  const { allProducts, isLoading: isLoadingProducts, search } = useGetAllProduct()
  // codigo pele
  // const { allCustomers, isLoading: isLoadingCustomers, mutate  } = useGetAllCustomer()
  // codigo good
  const { allResource: allCustomers, isLoading: isLoadingCustomers, mutate } = useGetAllResource<Customer>(
    { endpoint: '/api/customers/', isPagination: false }
  )
  const { createSale } = useCreateSale()
  const { cash } = useValidateOpenCash()
  const [cart, setCart] = useState<Array<{ product: string, quantity: number, price: number }>>([])

  const [saleCompleted, setSaleCompleted] = useState<PrintTicket | null>(null)
  const [open, setOpen] = useState(false)
  const [searchProduct, setSearchProduct] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paid, setPaid] = useState(0)
  // const [isPrint, setIsPrint] = useState(false)
  const user = useSelector((state: RootState) => state.user)
  const ticketRef = useRef(null)
  let isPrint = false
  const handlePrint = useReactToPrint({
    content: () => ticketRef.current
  })

  const debounceSearchProduct = useDebounce(searchProduct, 1000)
  useEffect(() => {
    search('name', debounceSearchProduct)
  }, [debounceSearchProduct])
  const { toggleContract } = useSidebar()

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product === product.id)
      if (existingProduct) {
        return prevCart.map((item) =>
          item.product === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { product: product.id, quantity: 1, price: product.sale_price }]
      }
    })
  }

  const handlePlusCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product === product.id)
      if (existingProduct) {
        return prevCart.map((item) =>
          item.product === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { product: product.id, quantity: 1, price: product.sale_price }]
      }
    }
    )
  }

  const handleMinusCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product === product.id)
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          return prevCart.map((item) =>
            item.product === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        } else {
          return prevCart.filter((item) => item.product !== product.id)
        }
      }
      return prevCart
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      customer: '',
      cash_register: cash?.id ?? '',
      nit: '',
      details: []
    }
  })

  type FormData = z.infer<typeof formSchema>

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    const saleDetails = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price
    }))

    const formData = {
      ...data,
      details: saleDetails
    }

    setSaleCompleted({
      code: '000000000001',
      date: new Date(),
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      items: cart.map((item) => ({
        name: allProducts.find((product: Product) => product.id === item.product)?.name ?? '',
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        id: item.product
      })),
      customer: allCustomers.find((customer: Customer) => customer.id === data.customer)?.name,
      nit: data.nit,
      cashier: user,
      paid
    })

    toast.promise(createSale(formData), {
      loading: 'Creando venta...',
      success: (data: any) => {
        setSaleCompleted((prev: any) => ({
          ...prev,
          code: String(data.data.code)
        }))
        console.log({ isPrint })
        if (isPrint) {
          setTimeout(() => {
            void handlePrint()
            setSaleCompleted(null)
            // setIsPrint(false)
            isPrint = false
          }, 500)
        }
        setCart([])
        form.reset()
        isPrint = false
        setIsSubmitting(false)
        return 'Venta creada con éxito'
      },
      error(error) {
        return error.errorMessages[0] ?? 'Error al crear la venta'
      }
    })
  }

  useEffect(() => {
    if (form.watch('customer')) {
      const customer = allCustomers.find((customer: Customer) => customer.id === form.watch('customer'))
      if (customer) {
        form.setValue('nit', String(customer?.ci) ?? '')
      }
    }
  }, [form.watch('customer')])

  useEffect(() => {
    toggleContract()
  }, [])

  if (!cash?.validate) {
    return (
      <section className="grid gap-4 overflow-hidden w-full relative">
        <Card>
          <CardHeader>
            <CardTitle>
              Caja cerrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>La caja no está abierta, por favor abra la caja para realizar una venta.</p>
            <Button
              variant="outline"
              onClick={() => {
                navigate('/')
              }}
              className="mt-4"
              type='button'
            >
              Ir a Caja
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="grid gap-4 overflow-hidden w-full relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full flex flex-col gap-4 lg:gap-6"
        >
          {/* <div className="inline-flex items-center flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                navigate(PrivateRoutes.SALE)
              }}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Button>
            <div
              className="py-1"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar"
                  className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
                  onChange={(e) => {
                    setSearchProduct(e.target.value)
                  }}
                />
              </div>
            </div>
          </div> */}
          <div className="grid gap-4 lg:gap-6 md:grid-cols-3">
            <Card className="w-full md:col-span-2 h-fit">
              <CardHeader>
                <CardTitle>Todos los productos</CardTitle>
                <div
                  className="py-1"
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                >
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar"
                      className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
                      onChange={(e) => {
                        setSearchProduct(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className='grid gap-4 mb-4 grid-cols-[repeat(auto-fill,minmax(170px,1fr))]'>
                {isLoadingProducts
                  ? <Skeleton rows={3} columns={2} />
                  : allProducts?.map((product: Product) => (
                    <Card key={product.id} className="">
                      <CardHeader>
                        <img
                          src={product?.image_url || '/path/to/default-image.jpg'}
                          alt={product.name}
                          className="w-full h-28 object-cover bg-gray-200"
                        />
                      </CardHeader>
                      <CardContent>
                        <CardTitle className='text-base'>{product.name}</CardTitle>
                        <p className='text-base text-light-text-secondary dark:text-dark-text-secondary'>Bs. {product.sale_price}</p>
                        <div className="flex justify-center items-center mt-4">
                          <Button
                            type='button'
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            title={
                              `Descripción: ${product.description}
Stock: ${product.stock}`}
                          >
                            {product.stock === 0 ? 'Agotado' : 'Agregar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>))}
              </CardContent>
            </Card>
            <div className='flex flex-col gap-4'>
              <Card className="w-full md:col-span-1">
                <CardHeader>
                  <CardTitle>Carrito de venta</CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0
                    ? <p>No hay productos en el carrito.</p>
                    : cart.map((item) => {
                      const product: Product = allProducts.find((p: Product) => p.id === item.product)
                      return product
                        ? <div key={item.product} className="flex justify-between items-center mb-2">
                          <div className='flex flex-col'>
                            <span>
                              {product.name.length > 20
                                ? `${product.name.slice(0, 20)}...`
                                : product.name}
                            </span>
                            <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>Bs. {item.price} x {item.quantity}</span>
                          </div>
                          <div className='flex flex-row items-center gap-2'>
                            <Button size='icon' variant='outline' type='button' onClick={() => handleMinusCart(product)}>
                              -
                            </Button>
                            <span className='px-2'>{item.quantity}</span>
                            <Button size='icon' variant='outline' type='button' onClick={() => handlePlusCart(product)}>
                              +
                            </Button>
                          </div>
                        </div>
                        : null
                    })
                  }
                </CardContent>
              </Card>
              <Card className='pt-4'>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => {
                      const { createCustomer, isMutating } = useCreateCustomer()
                      const [newCustomer, setNewCustomer] = useState({
                        ci: 0,
                        name: '',
                        phone: 0,
                        email: '',
                        password: crypto.randomUUID(),
                        role: 'customer'
                      })
                      const handleCreate = async () => {
                        toast.promise(createCustomer(newCustomer), {
                          loading: 'Creando cliente...',
                          success: () => {
                            void mutate()
                            setOpen(false)
                            return 'Cliente creado exitosamente'
                          },
                          error(error) {
                            return error.errorMessages[0] ?? 'Error al crear el cliente'
                          }
                        })
                      }

                      return (
                        <FormItem>
                          <FormLabel>Cliente</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field?.onChange || (() => { })}
                              value={field ? field.value : ''}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un cliente" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingCustomers
                                  ? <SelectItem value="loading" disabled>
                                    Cargando clientes...
                                  </SelectItem>
                                  : allCustomers?.map((customer: any) => (
                                    <SelectItem
                                      key={customer.id}
                                      value={customer.id}
                                      className="flex items-center justify-between"
                                    >
                                      <span>{customer.name}</span>
                                    </SelectItem>
                                  ))}
                                <div className="px-2 py-1.5 border-t mt-1">
                                  <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full"
                                      >
                                        + Nuevo cliente
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Crear cliente</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                                        <Label className='flex flex-col gap-2'>
                                          <span>Nombre</span>
                                          <Input
                                            placeholder="Ingresa el nombre del cliente"
                                            onChange={(e) => {
                                              setNewCustomer((prev) => ({
                                                ...prev,
                                                name: e.target.value
                                              }))
                                            }}
                                          />
                                        </Label>
                                        <Label className='flex flex-col gap-2'>
                                          <span>Carnet de Identidad</span>
                                          <Input
                                            type="number"
                                            placeholder="10360074..."
                                            onChange={(e) => {
                                              setNewCustomer((prev) => ({
                                                ...prev,
                                                ci: Number(e.target.value)
                                              }))
                                            }}
                                          />
                                        </Label>
                                      </div>
                                      <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                                        <Label className='flex flex-col gap-2'>
                                          <span>Correo electrónico</span>
                                          <Input
                                            placeholder="customer@example.com"
                                            onChange={(e) => {
                                              setNewCustomer((prev) => ({
                                                ...prev,
                                                email: e.target.value
                                              }))
                                            }}
                                          />
                                        </Label>
                                        <Label className='flex flex-col gap-2'>
                                          <span>Teléfono</span>
                                          <Input
                                            placeholder="77112200..."
                                            type='number'
                                            onChange={(e) => {
                                              setNewCustomer((prev) => ({
                                                ...prev,
                                                phone: Number(e.target.value)
                                              }))
                                            }}
                                          />
                                        </Label>
                                      </div>
                                      <DialogFooter className="gap-2 sm:justify-end">
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Cancelar
                                          </Button>
                                        </DialogClose>
                                        <Button
                                          onClick={handleCreate}
                                          // disabled={!newCategoryName.trim()}
                                          disabled={isMutating}
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
                  <FormField
                    control={form.control}
                    name="nit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIT</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="NIT del cliente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className='flex flex-col gap-2 w-full'>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">Total:</span>
                      <span className="text-lg font-semibold">Bs. {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">Pagado:</span>
                      <Input
                        type="text"
                        placeholder="0.00"
                        className="w-1/2 text-right text-base"
                        value={paid}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setPaid(value)
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-light-text-secondary dark:text-dark-text-secondary">Cambio:</span>
                      <span className="text-lg font-semibold">Bs. {(paid - cart.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    type='submit'
                    className="w-full mt-3"
                    disabled={cart.length === 0 || isSubmitting}
                  >
                    Vender
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className="w-full"
                    disabled={cart.length === 0 || isSubmitting}
                    onClick={() => {
                      console.log('submit print')
                      // setIsPrint(true)
                      isPrint = true
                      void onSubmit(form.getValues())
                    }}
                  >
                    Vender e imprimir
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      <div style={{ display: 'none' }}>
        {saleCompleted && (
          <div ref={ticketRef}>
            <TicketVenta sale={saleCompleted} />
          </div>
        )}
      </div>
    </section>
  )
}

export default SalePage

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date instanceof Date ? date : new Date(date))
}

function TicketVenta({ sale }: { sale: PrintTicket }) {
  return (
    <div className="p-4 max-w-md mx-auto" style={{ fontFamily: 'monospace' }}>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">{AppConfig.APP_TITLE}</h2>
        <p>NIT: 9807687</p>
        <p>Av. Principal 123</p>
        <p>Tel: 78010833</p>
        <p>Vendedor: {sale.cashier.name}</p>
      </div>

      <div className="border-t border-b py-2 my-2 text-center">
        <h3 className="font-bold">NOTA DE VETA</h3>
        <p>Nro: {sale.code}</p>
        <p>Fecha: {formatDate(sale.date)}</p>
        <p>Cliente: {sale.customer}</p>
        <p>NIT: {sale.nit}</p>
      </div>

      <div className="my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Cant.</th>
              <th className="text-left py-1">Descripción</th>
              <th className="text-right py-1">P.Unit</th>
              <th className="text-right py-1">Importe</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b border-dotted">
                <td className="py-1">{item.quantity}</td>
                <td className="py-1">{item.name}</td>
                <td className="text-right py-1 pl-2">{Number(item.price).toFixed(2)}</td>
                <td className="text-right py-1 pl-2">{Number(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right">
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>Bs. {Number(sale.total).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>PAGADO:</span>
          <span>Bs. {Number(sale.paid).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>CAMBIO:</span>
          <span>Bs. {Number((sale?.paid ?? 0) - sale.total).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        <p>¡Gracias por su compra!</p>
        <p>Vuelva pronto</p>
      </div>
    </div>
  )
}

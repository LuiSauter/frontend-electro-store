import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { useCreateCash, useCloseCash, useValidateOpenCash } from '@/modules/sales/hooks/useCash'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const formSchema = z.object({
  initial_balance: z
    .number({ required_error: 'El monto inicial es requerido' }),
  observations: z
    .string()
    .max(255, 'Las observaciones no pueden exceder los 255 caracteres')
    .optional()
})

const CashControlPage = (): JSX.Element => {
  const { createCash, isMutating: isMutatingOpen } = useCreateCash()
  const { closeCash, isMutating: isMutatingClose } = useCloseCash()
  const { cash, mutate } = useValidateOpenCash()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      initial_balance: 0,
      observations: ''
    }
  })

  type FormData = z.infer<typeof formSchema>

  const handleAction = (data: FormData) => {
    if (cash?.validate) {
      toast.promise(closeCash().then(() => mutate()), {
        loading: 'Cerrando caja...',
        success: () => {
          return 'Caja cerrada con éxito'
        },
        error: (err) => {
          return err.message
        }
      })
    } else {
      toast.promise(
        createCash({ ...data }).then(() => mutate()),
        {
          loading: 'Abriendo caja...',
          success: () => {
            return 'Caja abierta con éxito'
          },
          error: (err) => {
            return err.message
          }
        }
      )
    }
  }

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Control de Cajas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAction)}>
                <Card>
                  <CardHeader>
                    <p className="text-sm text-muted-foreground mt-1">
                      {cash?.validate
                        ? 'Para terminar su turno, debe cerrar la caja.'
                        : 'La caja está cerrada. Debes abrirla para realizar ventas.'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!cash?.validate && (
                      <div>
                        <FormField
                          control={form.control}
                          name="initial_balance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monto Inicial</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Monto inicial"
                                  type="number"
                                  value={field.value}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value))
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="observations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Observaciones</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Observaciones"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full"
                      disabled={isMutatingOpen || isMutatingClose}
                    >
                      {cash?.validate ? 'Cerrar Caja' : 'Abrir Caja'}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CashControlPage

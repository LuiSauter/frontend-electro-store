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
import { useGetUser } from '@/modules/users/hooks/useUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { useCreateResource, useUpdateResource } from '@/hooks/useApiResource'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const baseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().optional(),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\d+$/, 'El teléfono solo puede contener números')
    .max(8, 'El teléfono debe tener 8 dígitos'),
  country_code: z.string().optional(),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('El correo electrónico no es válido'),
  role: z.string()
    .min(1, 'El rol es requerido')
    .refine((value) => Object.values(PERMISSION).includes(value as PERMISSION), {
      message: 'El rol no es válido'
    }),
  password: z
    .string()
    .min(6, 'Mínimo 6 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .optional()
})

const UserFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Cajero', path: PrivateRoutes.USER },
    { label: title }
  ])
  const { id } = useParams()
  const navigate = useNavigate()
  // const { createUser, isMutating } = useCreateUser()
  // const { updateUser } = useUpdateUser()
  const { createResource: createUser, isMutating } = useCreateResource({ endpoint: '/api/user' })
  const { updateResource: updateUser } = useUpdateResource({ endpoint: '/api/user' })
  const { user } = useGetUser(id)

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: user?.name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ? String(user.phone) : '',
      email: user?.email ?? '',
      role: user?.role ?? PERMISSION.CASHIER,
      password: id ? undefined : ''
    }
  })

  const onSubmit = (data: z.infer<typeof baseSchema>) => {
    const payload = { ...data, phone: Number(data.phone) }
    if (id) {
      toast.promise(updateUser({ id, ...payload }), {
        loading: 'Actualizando Usuario...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.USER, { replace: true })
          }, 1000)
          return 'Usuario actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar el cajero'
        }
      })
    } else {
      toast.promise(createUser(payload), {
        loading: 'Creando Usuario...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.USER, { replace: true })
          }, 1000)
          return 'Usuario creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el cajero'
        }
      })
    }
  }

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
                  navigate(PrivateRoutes.USER)
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
                    navigate(PrivateRoutes.USER)
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
          <div className="grid gap-4 lg:gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Datos personales</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el nombre del cajero"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el apellido del cajero"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={PERMISSION.CASHIER}
                                className="flex items-center justify-between"
                              >
                                <span>Cajero</span>
                              </SelectItem>
                              <SelectItem
                                value={PERMISSION.ADMIN}
                                className="flex items-center justify-between"
                              >
                                <span>
                                  Administrador
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de país</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+591"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="77112200..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!id && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="************"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(PrivateRoutes.USER)
              }}
            >
              Descartar
            </Button>
            <Button type="submit" size="sm" disabled={isMutating}>
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default UserFormPage

import { Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import Loading from '@/components/shared/loading'
import { AppConfig } from '@/config'

const formSchema = z.object({
  email: z
    .string({ message: 'El correo electrónico es requerido' })
    .min(2, 'El correo electrónico debe tener al menos 2 caracteres')
    .max(50, 'El correo electrónico debe tener menos de 50 caracteres'),
  password: z.string().min(1, 'La contraseña es requerida')
})
const LoginPage = (): JSX.Element => {
  const { signWithEmailPassword, isMutating, error } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: any) => {
    void signWithEmailPassword({
      email: data.email,
      password: data.password
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">{AppConfig.APP_TITLE}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Panel administrativo</p>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <div className="grid gap-2">
                    <FormItem>
                      <FormLabel>Correo electronico</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ejemplo@gmail.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <div className="grid gap-2">
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          required
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </>
              )}
            />
            <Button
              type="submit"
              disabled={isMutating}
              className="w-full mt-4"
            >
              {isMutating ? <Loading /> : 'Iniciar sesión'}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground">
          <p>Credenciales de prueba:</p>
          <p className="font-medium">admin@ejemplo.com / admin123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

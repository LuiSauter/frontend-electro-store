import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowUp, ArrowDown, UserRoundCheck, DollarSign, HandCoins, MonitorSmartphone } from 'lucide-react'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { useGetAllResource } from '@/hooks/useApiResource'
import { PERMISSION } from '../auth/utils/permissions.constants'
import { type User } from '../users/models/user.model'

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.user)
  const { allResource: users } = useGetAllResource<User>({ endpoint: '/api/user', isPagination: false })
  const { allResource: products } = useGetAllResource<User>({ endpoint: '/api/product', isPagination: false })
  // const { allResource: users } = useGetAllResource({ endpoint: '/api/role', isPagination: false })
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    openCashier: 0,
    totalSales: 0,
    revenue: 0,
    totalProducts: 0
  })
  const [statsPercent, setStatsPercent] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalSales: 0,
    openCashier: 0,
    revenue: 0
  })

  useEffect(() => {
    // let isMounted = true

    if (users && products) {
      setStats({
        totalUsers: users.filter((user: User) => [PERMISSION.ADMIN, PERMISSION.CASHIER].includes(user.role)).length,
        totalClients: users.filter((user: User) => user.role === PERMISSION.CLIENT).length,
        totalSales: 0,
        openCashier: 0,
        revenue: 0,
        totalProducts: products.length
      })
      setStatsPercent({
        // calcular el porcentaje de usuarios nuevos hoy con el createdAt
        totalUsers: users.filter((user: User) => [PERMISSION.ADMIN, PERMISSION.CASHIER].includes(user.role)).filter((user: User) => {
          const createdAt = new Date(user.created_at)
          const today = new Date()
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getFullYear() === today.getFullYear()
          )
        }).length,
        totalClients: users.filter((user: User) => user.role === PERMISSION.CLIENT).filter((user: User) => {
          const createdAt = new Date(user.created_at)
          const today = new Date()
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getFullYear() === today.getFullYear()
          )
        }).length,
        totalSales: 3,
        openCashier: 0,
        revenue: 0
      })
    }

    return () => {
      // isMounted = false
    }
  }, [users, products])

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, <span className="font-medium text-primary">{user?.name}</span>. Aquí tienes un resumen del
          sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className={`mt-2 flex items-center text-xs ${
              statsPercent.totalUsers > 0 ? 'text-success' : 'text-light-text-secondary'
            } `}>
              {statsPercent.totalUsers > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              <span>
                {statsPercent.totalUsers} nuevos hoy
                {statsPercent.totalUsers > 0 && (
                  <span className="text-success">
                    {' '}
                    ({Math.round((statsPercent.totalUsers / stats.totalUsers) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <div className={`rounded-full bg-success/10 p-2 ${
              statsPercent.totalClients > 0 ? 'text-success' : 'text-light-text-secondary'
            }`}>
              <UserRoundCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClients}</div>
            <div className={`mt-2 flex items-center text-xs ${
              statsPercent.totalClients > 0 ? 'text-success' : 'text-light-text-secondary'
            } `}>
              {statsPercent.totalClients > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              <span>
                {statsPercent.totalClients} nuevos hoy
                {statsPercent.totalClients > 0 && (
                  <span className="text-success">
                    {' '}
                    ({Math.round((statsPercent.totalClients / stats.totalClients) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <div className="rounded-full bg-accent/10 p-2 text-accent">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSales}</div>
            <div className="mt-2 flex items-center text-xs text-destructive">
              <ArrowDown className="mr-1 h-3 w-3" />
              <span>Aún no hay ventas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cajas abiertas</CardTitle>
            <div className="rounded-full bg-secondary/10 p-2 text-secondary">
              <HandCoins className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openCashier}</div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span>Cajas abiertas en el sistema</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <div className="rounded-full bg-secondary/10 p-2 text-secondary">
              <MonitorSmartphone className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span>Productos disponibles</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2 shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-primary/5 p-6">
              <p className="mb-4">
                Este es un sistema de administración web moderno con autenticación y gestión de usuarios. Utiliza datos
                estáticos en formato JSON para simular una base de datos.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-accent/10 p-2 text-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Funcionalidades:</span>
                </div>
                <ul className="grid gap-3 pl-12">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Autenticación con email y contraseña</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Gestión de usuarios (listar, crear, editar, eliminar)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Asignación de roles a usuarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Interfaz moderna y responsiva</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}

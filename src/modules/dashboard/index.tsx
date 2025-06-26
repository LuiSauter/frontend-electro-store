import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowUp, ArrowDown, UserRoundCheck, DollarSign, HandCoins, MonitorSmartphone } from 'lucide-react'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { useGetAllResource } from '@/hooks/useApiResource'
import { PERMISSION } from '../auth/utils/permissions.constants'
import { type User } from '../users/models/user.model'
import { type Sale } from '../sales/models/sale.model'
import { type Product } from '../inventory/model/product.model'
import { type Buy } from '../buy/models/buy.model'

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.user)
  const { allResource: users } = useGetAllResource<User>({ endpoint: '/api/user', isPagination: false })
  const { allResource: products } = useGetAllResource<Product>({ endpoint: '/api/product', isPagination: false })
  const { allResource: sales } = useGetAllResource<Sale>({ endpoint: '/api/sale-note', isPagination: false })
  const { allResource: buyNotes } = useGetAllResource<Buy>({ endpoint: '/api/buy', isPagination: false })

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    openCashier: 0,
    totalSales: 0,
    revenue: 0,
    totalProducts: 0,
    stock: 0,
    profit: 0,
    investment: 0
  })
  const [statsPercent, setStatsPercent] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalSales: 0,
    openCashier: 0,
    revenue: 0,
    stock: 0,
    profit: 0,
    investment: 0
  })

  useEffect(() => {
    // let isMounted = true

    if (users && products && sales && buyNotes) {
      setStats({
        totalUsers: users.filter((user: User) => [PERMISSION.ADMIN, PERMISSION.CASHIER].includes(user.role)).length,
        totalClients: users.filter((user: User) => user.role === PERMISSION.CLIENT).length,
        totalSales: sales.length,
        openCashier: 1,
        revenue: sales.reduce((acc, sale) => acc + sale.amountPaid, 0),
        totalProducts: products.length,
        stock: products.reduce((acc, product) => acc + (product.stock || 0), 0),
        profit: sales.reduce((acc, sale) => acc + (sale.amountPaid || 0), 0) - buyNotes.reduce((acc, buy) => acc + (buy.totalAmount || 0), 0),
        investment: buyNotes.reduce((acc, buy) => acc + (buy.totalAmount || 0), 0)
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
        totalSales: sales.filter((sale: Sale) => {
          const createdAt = new Date(sale.created_at)
          const today = new Date()
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getFullYear() === today.getFullYear()
          )
        }).length,
        openCashier: 0,
        revenue: sales.filter((sale: Sale) => {
          const createdAt = new Date(sale.created_at)
          const today = new Date()
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getFullYear() === today.getFullYear()
          )
        }).reduce((acc, sale) => acc + sale.amountPaid, 0),
        stock: products.filter((product: Product) => product.stock > 0).length,
        profit: sales.reduce((acc, sale) => acc + (sale.amountPaid || 0), 0) - buyNotes.reduce((acc, buy) => acc + (buy.totalAmount || 0), 0),
        investment: buyNotes.filter((buy: Buy) => {
          const createdAt = new Date(buy.created_at)
          const today = new Date()
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getFullYear() === today.getFullYear()
          )
        }).reduce((acc, buy) => acc + (buy.totalAmount || 0), 0)
      })
    }

    return () => {
      // isMounted = false
    }
  }, [users, products, sales, buyNotes])

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
            <div className={`mt-2 flex items-center text-xs ${statsPercent.totalUsers > 0 ? 'text-success' : 'text-light-text-secondary'
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
            <div className={`rounded-full bg-success/10 p-2 ${statsPercent.totalClients > 0 ? 'text-success' : 'text-light-text-secondary'
              }`}>
              <UserRoundCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClients}</div>
            <div className={`mt-2 flex items-center text-xs ${statsPercent.totalClients > 0 ? 'text-success' : 'text-light-text-secondary'
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
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <div className="rounded-full bg-accent/10 p-2 text-accent">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSales}</div>
            <div className={`mt-2 flex items-center text-xs ${statsPercent.totalSales > 0 ? 'text-success' : 'text-light-text-secondary'
              } `}>
              {statsPercent.totalSales > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              <span>
                {statsPercent.totalSales} ventas hoy
                {statsPercent.totalSales > 0 && (
                  <span className="text-success">
                    {' '}
                    ({Math.round((statsPercent.totalSales / stats.totalSales) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={`hover-scale shadow-card hover:shadow-card-hover card-gradient ${stats.investment >= 0 ? 'bg-success/10' : 'bg-red-500/10'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversión</CardTitle>
            <div className={`rounded-full p-2 ${stats.investment >= 0 ? 'text-success' : 'text-red-500'}`}>
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.investment.toFixed(2)}</div>
            <div className={`mt-2 flex items-center text-xs ${stats.investment >= 0 ? 'text-success' : 'text-red-500'
              } `}>
              {stats.investment >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              <span>
                {stats.investment >= 0 ? 'Inversión hoy' : 'Pérdida de inversión hoy'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <div className="rounded-full bg-secondary/10 p-2 text-secondary">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.revenue.toFixed(2)}</div>
            <div className={`mt-2 flex items-center text-xs ${statsPercent.revenue > 0 ? 'text-success' : 'text-light-text-secondary'
              } `}>
              {statsPercent.revenue > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              <span>
                {statsPercent.revenue} ingresos hoy
                {statsPercent.revenue > 0 && (
                  <span className="text-success">
                    {' '}
                    ({Math.round((statsPercent.revenue / stats.revenue) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`hover-scale shadow-card hover:shadow-card-hover card-gradient ${stats.profit >= 0 ? 'bg-success/10' : 'bg-red-500/10'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias</CardTitle>
            <div className={`rounded-full p-2 ${stats.profit >= 0 ? 'text-success' : 'text-red-500'}`}>
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.profit.toFixed(2)}</div>
            <div className={`mt-2 flex items-center text-xs ${stats.profit >= 0 ? 'text-success' : 'text-red-500'
              } `}>
              {stats.profit >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              <span>
                {stats.profit >= 0 ? 'Ganancias hoy' : 'Pérdidas hoy'}
              </span>
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
        <Card className="hover-scale shadow-card hover:shadow-card-hover card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <div className="rounded-full bg-secondary/10 p-2 text-secondary">
              <MonitorSmartphone className="h-5 w-5" />
              <span className="sr-only">Stock Total</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.stock}</div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <span>Productos en stock</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

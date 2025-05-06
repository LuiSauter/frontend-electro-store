import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { BoxIcon, ListFilter, MonitorSmartphone, User, UserCogIcon, UsersIcon } from 'lucide-react'
import { createElement } from 'react'

export interface MenuHeaderRoute {
  path?: string
  label: string
  icon?: JSX.Element
  children?: MenuHeaderRoute[]
  permissions?: PERMISSION[]
}

export const MenuSideBar: MenuHeaderRoute[] = [
  {
    label: 'Gestion de Usuarios',
    icon: createElement(UserCogIcon, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[],
    children: [
      {
        label: 'Usuarios',
        icon: createElement(User, { width: 20, height: 20 }),
        path: PrivateRoutes.USER,
        permissions: [PERMISSION.ADMIN] as PERMISSION[]
      },
      {
        label: 'Clientes',
        icon: createElement(UsersIcon, { width: 20, height: 20 }),
        path: PrivateRoutes.CUSTOMER,
        permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Iventario',
    icon: createElement(BoxIcon, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[],
    children: [
      {
        label: 'Categorias',
        icon: createElement(ListFilter, { width: 20, height: 20 }),
        path: PrivateRoutes.PRODUCT_CATEGORY,
        permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
      },
      {
        label: 'Productos',
        icon: createElement(MonitorSmartphone, { width: 20, height: 20 }),
        path: PrivateRoutes.PRODUCT,
        permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
      }
    ]
  }
  // {
  //   label: 'Gestion de Ventas',
  //   icon: createElement(CircleDollarSignIcon, { width: 20, height: 20 }),
  //   permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[],
  //   children: [
  //     {
  //       label: 'Productos',
  //       icon: createElement(ShoppingBagIcon, { width: 20, height: 20 }),
  //       path: PrivateRoutes.PRODUCT,
  //       permissions: [PERMISSION.ADMIN] as PERMISSION[]
  //     },
  //     {
  //       label: 'Historial de cajas',
  //       icon: createElement(BoxIcon, { width: 20, height: 20 }),
  //       path: PrivateRoutes.CASH,
  //       permissions: [PERMISSION.ADMIN] as PERMISSION[]
  //     },
  //     // {
  //     //   label: 'Control de Cajas',
  //     //   icon: createElement(BoxIcon, { width: 20, height: 20 }),
  //     //   path: PrivateRoutes.CASH_CONTROL,
  //     //   permissions: [PERMISSION.CASHIER] as PERMISSION[]
  //     // },
  //     {
  //       label: 'Vender',
  //       icon: createElement(ShoppingCartIcon, { width: 20, height: 20 }),
  //       path: PrivateRoutes.SALE_CREATE,
  //       permissions: [PERMISSION.CASHIER] as PERMISSION[]
  //     },
  //     {
  //       label: 'Historial de Ventas',
  //       icon: createElement(HandCoins, { width: 20, height: 20 }),
  //       path: PrivateRoutes.SALE,
  //       permissions: [PERMISSION.ADMIN] as PERMISSION[]
  //     }
  //   ]
  // }
]

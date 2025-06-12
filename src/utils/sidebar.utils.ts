import { PrivateRoutes } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { BoxIcon, CircleDollarSignIcon, HandCoins, ListFilter, MonitorSmartphone, ScrollText, Shield, ShoppingBagIcon, ShoppingCartIcon, User, UserCogIcon, UsersIcon } from 'lucide-react'
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
  },
  {
    label: 'Gestion de Ventas',
    icon: createElement(CircleDollarSignIcon, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[],
    children: [
      {
        label: 'Vender (POS)',
        icon: createElement(ShoppingCartIcon, { width: 20, height: 20 }),
        path: PrivateRoutes.SALE_CREATE,
        permissions: [PERMISSION.CASHIER, PERMISSION.ADMIN] as PERMISSION[]
      },
      {
        label: 'Historial de cajas',
        icon: createElement(BoxIcon, { width: 20, height: 20 }),
        path: PrivateRoutes.CASH,
        permissions: [PERMISSION.ADMIN] as PERMISSION[]
      },
      {
        label: 'Historial de Ventas',
        icon: createElement(HandCoins, { width: 20, height: 20 }),
        path: PrivateRoutes.SALE,
        permissions: [PERMISSION.ADMIN] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Compras',
    icon: createElement(CircleDollarSignIcon, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[],
    children: [
      {
        label: 'Proveedores',
        icon: createElement(UserCogIcon, { width: 20, height: 20 }),
        path: PrivateRoutes.PROVIDER,
        permissions: [PERMISSION.CASHIER, PERMISSION.ADMIN] as PERMISSION[]
      },
      {
        label: 'Compras',
        icon: createElement(ShoppingBagIcon, { width: 20, height: 20 }),
        path: PrivateRoutes.BUY,
        permissions: [PERMISSION.ADMIN] as PERMISSION[]
      }
    ]
  },
  {
    label: 'Administración',
    icon: createElement(Shield, { width: 20, height: 20 }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[],
    children: [
      {
        label: 'Bitácora',
        icon: createElement(ScrollText, { width: 20, height: 20 }),
        path: PrivateRoutes.BINNACLE,
        permissions: [PERMISSION.ADMIN] as PERMISSION[]
      }
    ]
  }
]

import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

export enum PublicRoutes {
  LOGIN = '/login',
  RESET_PASSWORD = '/reset-password',
}

export enum PrivateRoutes {
  DASHBOARD = '/',
  // users
  USER = '/usuarios',
  USER_CREATE = '/usuarios/crear',
  USER_EDIT = '/usuarios/:id',

  // cashiers
  CASHIER = '/cajeros',
  CASHIER_CREATE = '/cajeros/crear',
  CASHIER_EDIT = '/cajeros/:id',

  // customers
  CUSTOMER = '/clientes',
  CUSTOMER_CREATE = '/clientes/crear',
  CUSTOMER_EDIT = '/clientes/:id',

  // products
  PRODUCT = '/productos',
  PRODUCT_CREATE = '/productos/crear',
  PRODUCT_EDIT = '/productos/:id',
  PRODUCT_CATEGORY = '/productos/categorias',

  // cashes
  CASH = '/cajas',
  CASH_CONTROL = '/cajas/control',

  // sales
  SALE = '/ventas',
  SALE_CREATE = '/ventas/crear',
}

export interface Route {
  path: PrivateRoutes | PublicRoutes | '/*'
  element: JSX.Element | JSX.Element[]
  permissions?: PERMISSION[]
}

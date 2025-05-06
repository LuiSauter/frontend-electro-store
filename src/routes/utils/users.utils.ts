import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const UserPage = lazy(() => import('@modules/users/pages/users'))
const UserFormPage = lazy(() => import('@modules/users/pages/users/components/user-form'))
const CustomerPage = lazy(() => import('@modules/users/pages/customers'))
const CustomerFormPage = lazy(() => import('@modules/users/pages/customers/components/customer-form'))

export const userRoutes: Route[] = [
  {
    path: PrivateRoutes.USER,
    element: createElement(UserPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.USER_CREATE,
    element: createElement(UserFormPage, { buttonText: 'Guardar Cajero', title: 'Crear Cajero' }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.USER_EDIT,
    element: createElement(UserFormPage, { buttonText: 'Editar Cajero', title: 'Actualizar Cajero' }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.CUSTOMER,
    element: createElement(CustomerPage),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
  },
  {
    path: PrivateRoutes.CUSTOMER_CREATE,
    element: createElement(CustomerFormPage, { title: 'Crear Cliente', buttonText: 'Guardar Cliente' }),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
  },
  {
    path: PrivateRoutes.CUSTOMER_EDIT,
    element: createElement(CustomerFormPage, { title: 'Actualizar Cliente', buttonText: 'Guardar Cliente' }),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
  }
]

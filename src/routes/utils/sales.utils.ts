import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const BuyPage = lazy(() => import('@modules/buy/pages/buys-page'))
const ProvidersPage = lazy(() => import('@modules/buy/pages/providers-page'))

export const salesRoutes: Route[] = [
  {
    path: PrivateRoutes.BUY,
    element: createElement(BuyPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROVIDER,
    element: createElement(ProvidersPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  }
]

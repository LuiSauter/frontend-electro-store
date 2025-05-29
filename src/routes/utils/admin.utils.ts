import { PrivateRoutes, type Route } from '@/models'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { createElement, lazy } from 'react'

const BinnaclePage = lazy(() => import('@modules/admin/pages/binnacle'))

export const adminRoutes: Route[] = [
  {
    element: createElement(BinnaclePage),
    path: PrivateRoutes.BINNACLE,
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  }
]

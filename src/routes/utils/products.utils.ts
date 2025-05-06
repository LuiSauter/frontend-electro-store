import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { PERMISSION } from '@/modules/auth/utils/permissions.constants'

const ProductPage = lazy(() => import('@modules/inventory/pages/products'))
const CategoryPage = lazy(() => import('@modules/inventory/pages/category/categoryPage'))
const ProductFormPage = lazy(() => import('@modules/inventory/pages/products/components/product-form'))
const CashPage = lazy(() => import('@modules/sales/pages/cashes'))
const CashControlPage = lazy(() => import('@modules/sales/pages/cashes/components/cash-control'))
const SalePage = lazy(() => import('@modules/sales/pages/sales'))
const SalesPage = lazy(() => import('@modules/sales/pages/sales/sales-page'))

export const productRoutes: Route[] = [
  {
    path: PrivateRoutes.PRODUCT,
    element: createElement(ProductPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PRODUCT_CREATE,
    element: createElement(ProductFormPage, { buttonText: 'Guardar Producto', title: 'Crear Producto' }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PRODUCT_EDIT,
    element: createElement(ProductFormPage, { buttonText: 'Actualizar Producto', title: 'Editar Producto' }),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PRODUCT_CATEGORY,
    element: createElement(CategoryPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.CASH,
    element: createElement(CashPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  },
  {
    path: PrivateRoutes.CASH_CONTROL,
    element: createElement(CashControlPage),
    permissions: [PERMISSION.CASHIER] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SALE_CREATE,
    element: createElement(SalePage),
    permissions: [PERMISSION.ADMIN, PERMISSION.CASHIER] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SALE,
    element: createElement(SalesPage),
    permissions: [PERMISSION.ADMIN] as PERMISSION[]
  }
]

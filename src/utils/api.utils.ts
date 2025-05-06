import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  API: '/api',
  LOGIN: '/api/login',
  CHECK_TOKEN: '/api/checkToken',
  // users
  USER: '/api/users/',

  // customers
  CUSTOMER: '/api/customers/',

  // product
  PRODUCT: '/api/products/',

  // category
  CATEGORY: '/api/categories/',

  // cash
  CASH: '/api/cash_registers/',
  CASH_VALIDATE: '/api/cash_registers/validate_user_cash_register/',
  CASH_CLOSE: '/api/cash_registers/close_current_register/',

  // sale
  SALE: '/api/sales/'
}

export const API_BASEURL = AppConfig.API_URL

export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}

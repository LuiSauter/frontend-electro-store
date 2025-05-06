import { type ApiBase } from '@/models'
import { type User } from '@/modules/users/models/user.model'
import { type Cash } from './cash.model'
import { type CreateDetailSale, type DetailSale } from './detail-sale.model'

export interface Sale extends ApiBase {
  code: string
  paid_amount: number
  nit: string
  customer: User
  cash_register: Cash
  details: DetailSale[]
}

export interface CreateSale extends Partial<Omit<Sale, 'code' | 'customer' | 'cash_register' | 'details'>> {
  customer: string
  cash_register: string
  details: CreateDetailSale[]
}

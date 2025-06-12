import { type ApiBase } from '@/models'
import { type User } from '@/modules/users/models/user.model'
import { type CreateDetailSale, type DetailSale } from './detail-sale.model'

export interface Sale extends ApiBase {
  code: number
  amountPaid: number
  amountReceivable: number
  amountReturned: number
  date: string
  time: string
  discount: number
  seller: User
  customer: User
  saleDetails: DetailSale[]
}

export interface CreateSale extends Partial<Omit<Sale, 'code' | 'customer' | 'cash_register' | 'details'>> {
  customer: string
  cash_register: string
  details: CreateDetailSale[]
}

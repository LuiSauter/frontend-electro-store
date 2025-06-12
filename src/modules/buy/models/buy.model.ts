import { type ApiBase } from '@/models'
import { type User } from '@/modules/users/models/user.model'

export interface Provider extends ApiBase {
  name: string
  phone: string
  email: string
  address: string
  nit: string
  detail: string
  is_active: boolean
}

export interface BuyDetail extends ApiBase {
  amount: number
  price: number
  subTotal: number
}

export interface Buy extends ApiBase {
  totalAmount: number
  date: string
  time: string
  provider: Provider
  user: User
  buyDetails: BuyDetail[]
  code: string
}

import { type ApiBase } from '@/models'
import { type User } from '@/modules/users/models/user.model'

export interface Cash extends ApiBase {
  opening: Date
  closing: Date
  initial_balance: number
  sales_total: number
  purchases_total: number
  total: number
  user: User
}

export interface CreateCash {
  initial_balance: number
  observations?: string
}

export interface ValidateCash {
  id: string
  validate: boolean
}

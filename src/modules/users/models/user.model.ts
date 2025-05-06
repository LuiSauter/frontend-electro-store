import { type ApiBase } from '@/models'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

export interface User extends ApiBase {
  name: string
  last_name: string
  photo_url: string
  phone: number
  email: string
  password?: string
  country_code: string
  role: PERMISSION
  is_suspended: boolean
}

export interface CreateUser extends Partial<Omit<User, 'password'>> {
  password: string
}

export interface FormUser extends Partial<Omit<User, 'password'>> {
  password: string
}

export enum Role {
  ADMIN = 'administrator',
  CASHIER = 'cashier',
}
export interface UpdateUser extends CreateUser { }

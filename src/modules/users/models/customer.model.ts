import { type ApiBase } from '@/models'

export interface Customer extends ApiBase {
  ci: number
  name: string
  phone: number
  email: string
  password: string
  role: string
  is_active: boolean
}
export interface CreateCustomer extends Partial<Omit<Customer, 'password'>> {
  password: string
}

export interface FormCustomer extends Partial<Omit<Customer, 'password'>> {
  password: string
}

export enum Role {
  ADMIN = 'administrator',
  CASHIER = 'cashier',
}
export interface UpdateCustomer extends CreateCustomer { }

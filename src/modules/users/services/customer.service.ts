import { fetchData } from '@/utils'
import { type Customer, type CreateCustomer, type UpdateCustomer } from '../models/customer.model'
import { type ApiResponse } from '@/models'

const createCustomer = async (url: string, { arg }: { arg: CreateCustomer }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getCustomer = async (url: string): Promise<Customer> => {
  const response = await fetchData(url)
  return response.data
}

const updateCustomer = async (url: string, { arg }: { arg: UpdateCustomer }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      ci: arg?.ci,
      name: arg?.name,
      email: arg?.email,
      phone: arg?.phone,
      role: arg?.role
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}
const getAllCustomer = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Customer[], countData: response.countData }
}

export { createCustomer, getAllCustomer, getCustomer, updateCustomer }

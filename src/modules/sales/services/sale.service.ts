import { fetchData } from '@/utils'
import { type Sale, type CreateSale } from '../models/sale.model'
import { type ApiResponse } from '@/models'

const createSale = async (url: string, { arg }: { arg: CreateSale }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getSale = async (url: string): Promise<Sale> => {
  const response = await fetchData(url)
  return response.data
}

const getAllSale = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Sale[], countData: response.countData }
}

export { createSale, getAllSale, getSale }

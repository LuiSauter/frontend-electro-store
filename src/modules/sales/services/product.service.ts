import { fetchData } from '@/utils'
import { type Product, type CreateProduct, type UpdateProduct } from '../../inventory/model/product.model'
import { type ApiResponse } from '@/models'

const createProduct = async (url: string, { arg }: { arg: CreateProduct }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getProduct = async (url: string): Promise<Product> => {
  const response = await fetchData(url)
  return response.data
}

const updateProduct = async (url: string, { arg }: { arg: UpdateProduct }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify({
      name: arg?.name,
      description: arg?.description,
      stock_minimum: arg?.minimum_stock,
      stock: arg?.stock,
      purchase_price: arg?.purchase_price,
      sale_price: arg?.sale_price,
      is_active: arg?.is_active
    })
  }
  await fetchData(`${url}${arg.id}/`, options)
}
const getAllProduct = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Product[], countData: response.countData }
}

const deleteProduct = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createProduct, getAllProduct, getProduct, updateProduct, deleteProduct }

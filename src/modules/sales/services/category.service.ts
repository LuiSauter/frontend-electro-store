import { fetchData } from '@/utils'
import { type CreateCategory, type Category } from '../../inventory/model/category.model'
import { type ApiResponse } from '@/models'

const createCategory = async (url: string, { arg }: { arg: CreateCategory }): Promise<void> => {
  console.log(arg)
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getAllCategory = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Category[], countData: response.countData }
}

const deleteCategory = async (url: string, { arg }: { arg: string }): Promise<void> => {
  const id = arg
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(`${url}${id}/`, options)
}

export { createCategory, getAllCategory, deleteCategory }

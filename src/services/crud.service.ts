import { convertObjectToFormData, fetchData, fetchDataNoAuth } from '@/utils'

export interface ApiResponse<T = unknown> {
  statusCode?: number
  message?: string | string[]
  error?: string
  data?: T
  countData?: number
}

const getAllResource = async <T>(url: string): Promise<ApiResponse<T[]>> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as T[], countData: response.countData }
}

const getResource = async <T>(url: string): Promise<T> => {
  const response = await fetchData(url)
  return response.data as T
}

const createResource = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const createResourceNoAuth = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchDataNoAuth(url, options)
  return response
}

const createResourceWithImage = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const formData = convertObjectToFormData(arg as Record<string, unknown>)
  const options: RequestInit = {
    method: 'POST',
    body: formData
  }
  const response = await fetchData(url, options)
  return response
}

const updateResource = async <T>(url: string, { arg }: { arg: T }): Promise<void> => {
  const options: RequestInit = {
    method: 'PATCH',
    body: JSON.stringify(arg)
  }

  const id = (arg as Record<string, unknown>).id
  const isValidId = typeof id === 'string' || typeof id === 'number'
  const finalUrl = isValidId ? `${url}/${id}` : url

  const response = await fetchData(finalUrl, options)
  return response
}

const deleteResource = async (url: string): Promise<void> => {
  const options: RequestInit = { method: 'DELETE' }
  await fetchData(url, options)
}

export { getAllResource, createResource, updateResource, getResource, deleteResource, createResourceWithImage, createResourceNoAuth }

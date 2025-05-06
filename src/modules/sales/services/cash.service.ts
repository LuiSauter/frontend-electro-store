import { fetchData } from '@/utils'
import { type ValidateCash, type Cash, type CreateCash } from '../models/cash.model'
import { type ApiResponse } from '@/models'

const createCash = async (url: string, { arg }: { arg: CreateCash }): Promise<void> => {
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(arg)
  }
  const response = await fetchData(url, options)
  return response
}

const getCash = async (url: string): Promise<Cash> => {
  const response = await fetchData(url)
  return response.data
}

const getAllCash = async (url: string): Promise<ApiResponse> => {
  const options: RequestInit = { method: 'GET' }
  const response = await fetchData(url, options)
  return { data: response.data as Cash[], countData: response.countData }
}

const closeCash = async (url: string): Promise<void> => {
  const options: RequestInit = {
    method: 'GET'
  }
  await fetchData(url, options)
}

const validateOpenCash = async (url: string): Promise<ValidateCash> => {
  const options: RequestInit = {
    method: 'GET'
  }
  const response = await fetchData(url, options)
  return response.data
}

export { createCash, getAllCash, getCash, closeCash, validateOpenCash }

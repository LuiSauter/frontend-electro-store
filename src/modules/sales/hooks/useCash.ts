import useSWRMutation from 'swr/mutation'
import { createCash, getAllCash, getCash, closeCash, validateOpenCash } from '../services/cash.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type ValidateCash, type Cash, type CreateCash } from '../models/cash.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateCash = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateCash>(API_BASEURL + ENDPOINTS.CASH, createCash)
  return { createCash: trigger, isMutating, error }
}

const useGetCash = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<Cash, ResponseError>(id ? API_BASEURL + ENDPOINTS.CASH + `${id}/` : null, getCash)
  return { cash: data, isLoading, error, isValidating }
}

const useGetAllCash = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.CASH}?${queryParams}`, getAllCash)
  return { allCashs: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useCloseCash = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError>(API_BASEURL + ENDPOINTS.CASH_CLOSE, closeCash)
  return { closeCash: trigger, isMutating, error }
}

const useValidateOpenCash = () => {
  const { data, error, isLoading, mutate } = useSWR<ValidateCash, ResponseError>(API_BASEURL + ENDPOINTS.CASH_VALIDATE, validateOpenCash)
  return { cash: data, error, isLoading, mutate }
}

export { useCreateCash, useGetAllCash, useGetCash, useCloseCash, useValidateOpenCash }

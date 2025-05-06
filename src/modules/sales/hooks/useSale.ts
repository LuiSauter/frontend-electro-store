import useSWRMutation from 'swr/mutation'
import { createSale, getAllSale, getSale } from '../services/sale.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type CreateSale, type Sale } from '../models/sale.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateSale = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateSale>(API_BASEURL + ENDPOINTS.SALE, createSale)
  return { createSale: trigger, isMutating, error }
}

const useGetSale = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<Sale, ResponseError>(id ? API_BASEURL + ENDPOINTS.SALE + `${id}/` : null, getSale)
  return { sale: data, isLoading, error, isValidating }
}

const useGetAllSale = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.SALE}?${queryParams}`, getAllSale)
  return { allSales: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

export { useCreateSale, useGetAllSale, useGetSale }

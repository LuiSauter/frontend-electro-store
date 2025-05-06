import useSWRMutation from 'swr/mutation'
import { createCustomer, getAllCustomer, getCustomer, updateCustomer } from '../services/customer.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type FormCustomer, type CreateCustomer, type UpdateCustomer } from '../models/customer.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateCustomer = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateCustomer>(API_BASEURL + ENDPOINTS.CUSTOMER, createCustomer)
  return { createCustomer: trigger, isMutating, error }
}
const useGetCustomer = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<FormCustomer, ResponseError>(id ? API_BASEURL + ENDPOINTS.CUSTOMER + `${id}/` : null, getCustomer)
  return { customer: data, isLoading, error, isValidating }
}
const useGetAllCustomer = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.CUSTOMER}?${queryParams}`, getAllCustomer)
  return { allCustomers: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}
const useUpdateCustomer = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateCustomer>(API_BASEURL + ENDPOINTS.CUSTOMER, updateCustomer)
  return { updateCustomer: trigger, isMutating, error }
}
export { useCreateCustomer, useGetAllCustomer, useGetCustomer, useUpdateCustomer }

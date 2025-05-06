import useSWRMutation from 'swr/mutation'
import { createProduct, deleteProduct, getAllProduct, getProduct, updateProduct } from '../services/product.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type CreateProduct, type UpdateProduct, type Product } from '../../inventory/model/product.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateProduct = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateProduct>(API_BASEURL + ENDPOINTS.PRODUCT, createProduct)
  return { createProduct: trigger, isMutating, error }
}

const useGetProduct = (id?: string) => {
  const { data, isLoading, error, isValidating } = useSWR<Product, ResponseError>(id ? API_BASEURL + ENDPOINTS.PRODUCT + `${id}/` : null, getProduct)
  return { product: data, isLoading, error, isValidating }
}

const useGetAllProduct = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.PRODUCT}?${queryParams}`, getAllProduct)
  return { allProducts: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdateProduct = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, UpdateProduct>(API_BASEURL + ENDPOINTS.PRODUCT, updateProduct)
  return { updateProduct: trigger, isMutating, error }
}

const useDeleteProduct = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.PRODUCT, deleteProduct)
  return { deleteProduct: trigger, error, isMutating }
}

export { useCreateProduct, useGetAllProduct, useGetProduct, useUpdateProduct, useDeleteProduct }

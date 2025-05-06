import useSWRMutation from 'swr/mutation'
import { createCategory, deleteCategory, getAllCategory } from '../services/category.service'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { type CreateCategory } from '../../inventory/model/category.model'
import useSWR from 'swr'
import { filterStateDefault, useFilterData } from '@/hooks/useFilterData'
import { type ApiResponse } from '@/models'

const useCreateCategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, CreateCategory>(API_BASEURL + ENDPOINTS.CATEGORY, createCategory)
  return { createCategory: trigger, isMutating, error }
}

const useGetAllCategory = () => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(`${API_BASEURL + ENDPOINTS.CATEGORY}?${queryParams}`, getAllCategory)
  return { allCategories: data?.data ?? [], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useDeleteCategory = () => {
  const { trigger, error, isMutating } = useSWRMutation<Promise<void>, ResponseError, string, string>(API_BASEURL + ENDPOINTS.CATEGORY, deleteCategory)
  return { deleteCategory: trigger, error, isMutating }
}

export { useCreateCategory, useGetAllCategory, useDeleteCategory }

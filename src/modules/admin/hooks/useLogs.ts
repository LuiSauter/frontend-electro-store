import { useState } from 'react'
import { type Log, type LogListParams } from '../models/log.model'
import { useGetAllResource } from '@/hooks/useApiResource'

export const useLogs = () => {
  const [queryParams, setQueryParams] = useState<LogListParams>({
    page: 1,
    limit: 50
  })

  const { allResource: data, isLoading, mutate, countData, filterOptions, newPage, prevPage, setFilterOptions, search, setOffset } = useGetAllResource<Log>({ endpoint: '/api/logs', isPagination: true })

  // const { data, isLoading, refetch } = useQuery<{ data?: Log[], countData?: number }>({
  //   queryKey: ['logs', queryParams],
  //   queryFn: async () => {
  //     try {
  //       const response = await getLogs(queryParams)
  //       return {
  //         data: response.data ?? [],
  //         countData: response.countData ?? 0
  //       }
  //     } catch (error) {
  //       toast.error('Error al cargar la bitácora')
  //       return { data: [], countData: 0 }
  //     }
  //   }
  // })

  const handleSearch = (word: string) => {
    // setQueryParams(prev => ({ ...prev, search, page: 1 }))
    setFilterOptions(prev => ({ ...prev, word, page: 1 }))
    setOffset(0)
    setQueryParams(prev => ({ ...prev, page: 1 }))
    // search && mutate({ search, page: 1, limit: queryParams.limit })
  }

  const handleDateFilter = (fromDate?: string, toDate?: string) => {
    setQueryParams(prev => ({ ...prev, fromDate, toDate, page: 1 }))
    setFilterOptions(prev => ({ ...prev, fromDate, toDate, page: 1 }))
    setOffset(0)
  }

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }))
    setFilterOptions(prev => ({ ...prev, page }))
    setOffset((page - 1) * filterOptions.limit)
  }

  return {
    logs: data,
    totalLogs: countData,
    isLoading,
    queryParams,
    handleSearch,
    handleDateFilter,
    handlePageChange,
    refetch: mutate,
    filterOptions,
    mutate,
    countData,
    newPage,
    prevPage,
    setFilterOptions,
    search,
    setOffset
  }
}

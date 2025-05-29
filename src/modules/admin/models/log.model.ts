export interface Log {
  id: string
  user: string
  ip: string
  action: string
  timestamp: string
  createdAt?: string // Mantener para compatibilidad
}

export interface LogListParams {
  page?: number
  limit?: number
  search?: string
  fromDate?: string
  toDate?: string
}

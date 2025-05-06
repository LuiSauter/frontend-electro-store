export interface FilterOptions {
  offset: number
  limit: number
  order?: string
  attr?: string
  value?: string
  branch?: string
}

export interface GetAllProps {
  isGetAll?: boolean
}

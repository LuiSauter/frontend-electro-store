import { type ApiBase } from '@/models'

export interface Category extends ApiBase {
  name: string
  is_active: boolean
}

export interface CreateCategory extends Partial<Omit<Category, 'id'>> {}

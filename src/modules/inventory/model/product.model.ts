import { type ApiBase } from '@/models'
import { type Category } from './category.model'

export interface Product extends ApiBase {
  name: string
  description: string
  minimum_stock: number
  stock: number
  purchase_price: number
  sale_price: number
  is_active: boolean
  category: Category
  image_url: string
  code: string
}

export interface CreateProduct extends Partial<Omit<Product, 'category'>> {
  category_id: string
}

export interface FormProduct extends Partial<Omit<Product, 'category'>> {
  category: string
}

export interface UpdateProduct extends Product { }

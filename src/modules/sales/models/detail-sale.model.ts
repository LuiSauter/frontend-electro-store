import { type ApiBase } from '@/models'
import { type Product } from '../../inventory/model/product.model'

export interface DetailSale extends ApiBase {
  product: Product
  quantity: number
  price: number
  discount: number
  subtotal: number
}

export interface CreateDetailSale extends Partial<Omit<DetailSale, 'product'>> {
  product: string
}

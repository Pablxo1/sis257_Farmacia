import type { Cliente } from './cliente'
import type { ItemVenta } from './item-venta'

export interface Venta {
  id: number
  idCliente: number
  fecha: string
  total: number
  efectivo: number
  cambio: number
  cliente: Cliente
  itemVentas: ItemVenta[]
}

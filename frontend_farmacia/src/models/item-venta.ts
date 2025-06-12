import type { Producto } from './producto'
import type { Venta } from './venta'

export interface ItemVenta {
  id: number
  idVenta: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  producto: Producto
  venta: Venta
}

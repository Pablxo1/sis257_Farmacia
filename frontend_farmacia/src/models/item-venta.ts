import type { Producto } from './producto'
import type { Venta } from './venta'
import type { Inventario } from './inventario'
export interface ItemVenta {
  id: number
  idVenta: number
  idProducto: number
  idInventario: number
  cantidad: number
  precioUnitario: number
  producto: Producto
  venta: Venta
  inventario: Inventario
}

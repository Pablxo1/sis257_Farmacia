import type { Cliente } from './cliente'
import type { ItemVenta } from './item-venta'
import type { Usuario } from './usuario'
export interface Venta {
  id: number
  idCliente: number
  fecha: string
  total: number
  efectivo: number
  cambio: number
  cliente: {
    id: number
    nombre: string
    apellido: string
    ci: string
  }
  usuario?: {
    id: number
    usuario: string
  }
  itemVentas: {
    id: number
    idVenta: number
    idProducto: number
    cantidad: number
    precioUnitario: number
    producto: {
      id: number
      nombre: string
      descripcion: string
      presentacion: string
      concentracion: string
      precioVenta: number
      precioCompra: number
    }
    Cliente: Cliente
    Usuario: Usuario
    ItemVenta: ItemVenta
    venta: any
  }[]
}

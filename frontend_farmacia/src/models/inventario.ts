import type { Producto } from './producto';
import type { Distribuidora } from './distribuidora';
export interface Inventario{
  id: number;
  idProducto: number;
  idDistribuidora: number;
  cantidad: number;
  fechaIngresoAlmacen: Date;
  fechaVencimiento: Date;
  producto : Producto;
  distribuidora: Distribuidora;
}

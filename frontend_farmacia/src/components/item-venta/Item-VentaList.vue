<script setup lang="ts">
import type { ItemVenta } from '@/models/item-venta'
defineProps<{ items: ItemVenta[] }>()
</script>

<template>
  <div>
    <h4>Detalle de Productos Vendidos</h4>
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.producto?.nombre ?? 'Sin producto' }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ (item.precioUnitario ?? 0).toFixed(2) }}</td>
          <td>{{ (item.cantidad * (item.precioUnitario ?? 0)).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

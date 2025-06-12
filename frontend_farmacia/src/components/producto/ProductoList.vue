<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

const productosFiltrados = computed(() => {
  return productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.presentacion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.concentracion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.precioVenta.toString().toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.precioCompra.toString().toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Presentacion</th>
          <th>Concentracion</th>
          <th>Precio de Venta</th>
          <th>Precio de Compra</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.descripcion }}</td>
          <td>{{ producto.presentacion }}</td>
          <td>{{ producto.concentracion }}</td>
          <td>{{ Number(producto.precioVenta).toFixed(2) }}</td>
          <td>{{ Number(producto.precioCompra).toFixed(2) }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(producto)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(producto)"
            />
          </td>
        </tr>
        <tr v-if="productosFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>

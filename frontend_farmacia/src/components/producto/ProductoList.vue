<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText, DataTable, Column } from 'primevue'
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
  try {
    await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
    obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'No se pudo eliminar el producto.')
  }
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-2">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, descripción, presentación, etc."
        />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="productosFiltrados"
        paginator
        scrollable
        scrollHeight="flex"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 60rem"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
        class="mt-3"
      >
        <Column field="nombre" header="Nombre">
          <template #body="{ data }">
            <span style="font-weight: 700; color: black">
              {{ data.nombre }}
            </span>
          </template>
        </Column>
        <Column field="descripcion" header="Descripción"></Column>
        <Column field="presentacion" header="Presentación"></Column>
        <Column field="concentracion" header="Concentración"></Column>
        <Column field="precioVenta" header="Precio de Venta">
          <template #body="{ data }">
            {{ Number(data.precioVenta).toFixed(2) }}
          </template>
        </Column>
        <Column field="precioCompra" header="Precio de Compra">
          <template #body="{ data }">
            {{ Number(data.precioCompra).toFixed(2) }}
          </template>
        </Column>
        <Column header="Acciones" style="width: 120px">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="❗ Confirmar Eliminación"
      :style="{ width: '28rem', maxWidth: '98vw' }"
      modal
    >
      <div class="eliminar-dialog-content">
        <div class="icono-advertencia">
          <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem; color: #e53935"></i>
        </div>
        <div class="mensaje-advertencia">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem">
            ¿Estás seguro de que deseas eliminar el producto
            <span style="font-weight: bold; color: #1976d2">
              {{ productoDelete?.nombre }}
            </span>
            ?
          </p>
          <p style="color: #e53935; font-size: 0.95rem">Esta acción no se puede deshacer.</p>
        </div>
        <div class="flex justify-end gap-2 mt-3">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="mostrarConfirmDialog = false"
          />
          <Button
            type="button"
            label="Eliminar"
            icon="pi pi-trash"
            severity="danger"
            @click="eliminar"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.eliminar-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.7rem 0.2rem 0.2rem 0.2rem;
}
.icono-advertencia {
  margin-bottom: 0.5rem;
}
.mensaje-advertencia {
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>

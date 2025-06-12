<script setup lang="ts">
import type { Inventario } from '@/models/inventario'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'inventarios'
const inventarios = ref<Inventario[]>([])
const emit = defineEmits(['edit'])
const inventarioDelete = ref<Inventario | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  inventarios.value = await http.get(ENDPOINT).then((response) => response.data)
}

const inventariosFiltrados = computed(() => {
  return inventarios.value.filter(
    (inventario) =>
      inventario.cantidad.toString().toLowerCase().includes(busqueda.value.toLowerCase()) ||
      inventario.fechaIngresoAlmacen
        .toString()
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()) ||
      inventario.fechaVencimiento.toString().toLowerCase().includes(busqueda.value.toLowerCase()) ||
      inventario.producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      inventario.producto.presentacion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      inventario.producto.concentracion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      inventario.producto.precioCompra
        .toString()
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()) ||
      inventario.producto.precioVenta
        .toString()
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()) ||
      inventario.distribuidora.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(inventario: Inventario) {
  emit('edit', inventario)
}

function mostrarEliminarConfirm(inventario: Inventario) {
  inventarioDelete.value = inventario
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${inventarioDelete.value?.id}`)
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
    <div class="col-7 pl-0 mt-2">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar" />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="inventariosFiltrados"
        paginator
        scrollable
        scrollHeight="flex"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 60rem"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
      >
        <Column
          field="producto.nombre"
          header="Producto"
          sortable
          style="min-width: 120px"
        ></Column>
        <Column
          field="producto.presentacion"
          header="Presentación"
          style="min-width: 100px"
        ></Column>
        <Column
          field="producto.concentracion"
          header="Concentración"
          style="min-width: 100px"
        ></Column>
        <Column field="producto.precioCompra" header="Precio de Compra" style="min-width: 100px">
          <template #body="{ data }">
            {{ isNaN(Number(data.producto.precioCompra)) ? '' : Number(data.producto.precioCompra).toFixed(2) }}
          </template>
        </Column>
        <Column field="producto.precioVenta" header="Precio de Venta" style="min-width: 100px">
          <template #body="{ data }">
            {{ isNaN(Number(data.producto.precioVenta)) ? '' : Number(data.producto.precioVenta).toFixed(2) }}
          </template>
        </Column>
        <Column
          field="distribuidora.nombre"
          header="Distribuidora"
          sortable
          style="min-width: 120px"
        ></Column>
        <Column field="cantidad" header="Cantidad" style="min-width: 80px"></Column>
        <Column field="fechaIngresoAlmacen" header="Fecha de Ingreso" style="min-width: 120px">
          <template #body="{ data }">
            {{ new Date(data.fechaIngresoAlmacen).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="fechaVencimiento" header="Fecha de Vencimiento" style="min-width: 120px">
          <template #body="{ data }">
            {{ new Date(data.fechaVencimiento).toLocaleDateString() }}
          </template>
        </Column>
        <Column header="Acciones" frozen alignFrozen="right" style="min-width: 120px">
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

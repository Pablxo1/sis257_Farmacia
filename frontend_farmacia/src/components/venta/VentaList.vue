<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText, DataTable, Column } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'ventas'
const ventas = ref<Venta[]>([])
const emit = defineEmits(['edit'])
const ventaDelete = ref<Venta | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  ventas.value = await http.get(ENDPOINT).then((response) => response.data)
}

const ventasFiltradas = computed(() => {
  return ventas.value.filter(
    (venta) =>
      (
        (venta.cliente?.nombre?.toLowerCase() || '') +
        ' ' +
        (venta.cliente?.apellido?.toLowerCase() || '')
      ).includes(busqueda.value.toLowerCase()) ||
      (venta.fecha && venta.fecha.toLowerCase().includes(busqueda.value.toLowerCase())) ||
      (venta.total !== undefined && venta.total.toString().includes(busqueda.value)),
  )
})

function emitirEdicion(venta: Venta) {
  emit('edit', venta)
}

function mostrarEliminarConfirm(venta: Venta) {
  ventaDelete.value = venta
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${ventaDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por cliente, fecha o total" />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="ventasFiltradas"
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
        <Column header="Cliente">
          <template #body="{ data }">
            {{ data.cliente?.nombre }} {{ data.cliente?.apellido }}
          </template>
        </Column>
        <Column field="fecha" header="Fecha">
          <template #body="{ data }">
            {{ data.fecha ? new Date(data.fecha).toLocaleDateString('es-BO') : '' }}
          </template></Column
        >
        <Column field="total" header="Total">
          <template #body="{ data }">
            {{ Number(data.total).toFixed(2) }}
          </template>
        </Column>
        <Column field="efectivo" header="Efectivo">
          <template #body="{ data }">
            {{
              data.efectivo !== null && data.efectivo !== undefined
                ? Number(data.efectivo).toFixed(2)
                : ''
            }}
          </template>
        </Column>
        <Column field="cambio" header="Cambio">
          <template #body="{ data }">
            {{
              data.cambio !== null && data.cambio !== undefined
                ? Number(data.cambio).toFixed(2)
                : ''
            }}
          </template>
        </Column>
        <Column header="Acciones" style="width: 100px">
          <template #body="{ data }">
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
      <p>¿Estás seguro de que deseas eliminar esta venta?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>

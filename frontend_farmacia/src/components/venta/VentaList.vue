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

const mostrarDetalleDialog = ref(false)
const ventaDetalle = ref<Venta | null>(null)

function verDetalle(venta: Venta) {
  ventaDetalle.value = venta
  mostrarDetalleDialog.value = true
}

function emitirEdicion(venta: Venta) {
  emit('edit', venta)
}

function mostrarEliminarConfirm(venta: Venta) {
  ventaDelete.value = venta
  mostrarConfirmDialog.value = true
}

function formatFecha(fecha: string) {
  if (!fecha) return ''
  const d = new Date(fecha)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const anio = String(d.getFullYear()).slice(-2)
  const horas = String(d.getHours()).padStart(2, '0')
  const minutos = String(d.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`
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
            <span style="font-weight: 700; color: black">
              {{ data.cliente?.nombre }} {{ data.cliente?.apellido }}
            </span>
          </template>
        </Column>
        <Column field="fecha" header="Fecha">
          <template #body="{ data }">
            {{ formatFecha(data.fecha) }}
          </template>
        </Column>
        <Column field="usuario" header="Usuario">
          <template #body="{ data }">
            {{ data.usuario?.usuario ?? 'N/A' }}
          </template>
        </Column>
        <Column header="Detalle de Venta" style="width: 100px">
          <template #body="{ data }">
            <Button icon="pi pi-eye" aria-label="Ver Detalle" text @click="verDetalle(data)" />
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
    <Dialog
      v-model:visible="mostrarDetalleDialog"
      header="🧾 Detalle de Venta"
      :style="{ width: '45rem', maxWidth: '98vw' }"
      modal
    >
      <div class="venta-detalle-container">
        <div class="detalle-section">
          <div class="detalle-row">
            <span class="detalle-label">Cliente:</span>
            <span class="detalle-value"
              >{{ (ventaDetalle && ventaDetalle.cliente && ventaDetalle.cliente.nombre) || '' }}
              {{
                (ventaDetalle && ventaDetalle.cliente && ventaDetalle.cliente.apellido) || ''
              }}</span
            >
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Fecha:</span>
            <span class="detalle-value">{{
              formatFecha(ventaDetalle && ventaDetalle.fecha ? ventaDetalle.fecha : '')
            }}</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Registrado por:</span>
            <span class="detalle-value">{{
              (ventaDetalle && ventaDetalle.usuario && ventaDetalle.usuario.usuario) || 'N/A'
            }}</span>
          </div>
          <div class="detalle-row"></div>
        </div>

        <div class="detalle-section mt-3">
          <h4 style="color: #1976d2"><i class="pi pi-list mr-2"></i>Productos vendidos</h4>
          <table class="productos-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Presentación</th>
                <th>Concentración</th>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Precio Unitario</th>
                <th class="text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in ventaDetalle && ventaDetalle.itemVentas
                  ? ventaDetalle.itemVentas
                  : []"
                :key="item.id"
                style="transition: background 0.2s"
                :style="{ background: '#f4faff' }"
              >
                <td>
                  <span style="font-weight: 500; color: #1976d2">
                    {{ item.producto?.nombre || 'Sin producto' }}
                  </span>
                </td>
                <td>
                  {{ item.producto?.presentacion || '-' }}
                </td>
                <td>
                  {{ item.producto?.concentracion || '-' }}
                </td>
                <td class="text-center">
                  <span
                    style="
                      background: #e3f2fd;
                      border-radius: 6px;
                      padding: 0.2rem 0.7rem;
                      font-weight: 600;
                    "
                  >
                    {{ item.cantidad }}
                  </span>
                </td>
                <td class="text-center">
                  <span style="color: #388e3c; font-weight: 500">
                    {{ Number(item.precioUnitario).toFixed(2) }}
                  </span>
                </td>
                <td class="text-center">
                  <span style="font-weight: bold; color: #1565c0">
                    {{ (item.cantidad * item.precioUnitario).toFixed(2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end mt-2">
            <span
              style="
                font-weight: bold;
                color: #1565c0;
                font-size: 1.3rem;
                background: #e3f2fd;
                padding: 0.5rem 1.2rem;
                border-radius: 8px;
                box-shadow: 0 1px 6px rgba(25, 118, 210, 0.1);
              "
            >
              Total: {{ Number((ventaDetalle && ventaDetalle.total) || 0).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.venta-detalle-container {
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(25, 118, 210, 0.08);
}

.detalle-section {
  background: #e3f2fd;
  border-radius: 10px;
  padding: 1rem 0.7rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.04);
}

.detalle-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.detalle-label {
  font-weight: 600;
  color: #1976d2;
}

.detalle-value {
  font-weight: 500;
  color: #222;
}

.productos-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5rem;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(25, 118, 210, 0.07);
}

.productos-table th,
.productos-table td {
  padding: 0.7rem 0.7rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}

.productos-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  font-size: 1rem;
}

.productos-table td.text-center,
.productos-table th.text-center {
  text-align: center;
}
</style>

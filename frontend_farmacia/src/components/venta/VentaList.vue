<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
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
        venta.cliente?.nombre?.toLowerCase() +
        ' ' +
        venta.cliente?.apellido?.toLowerCase()
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
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por cliente, fecha o total" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Efectivo</th>
          <th>Cambio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventasFiltradas" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ venta.cliente?.nombre }} {{ venta.cliente?.apellido }}</td>
          <td>{{ venta.fecha }}</td>
          <td>{{ Number(venta.total).toFixed(2) }}</td>
          <td>
            {{
              venta.efectivo !== null && venta.efectivo !== undefined
                ? Number(venta.efectivo).toFixed(2)
                : ''
            }}
          </td>
          <td>
            {{
              venta.cambio !== null && venta.cambio !== undefined
                ? Number(venta.cambio).toFixed(2)
                : ''
            }}
          </td>
          <td>
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(venta)"
            />
          </td>
        </tr>
        <tr v-if="ventasFiltradas.length === 0">
          <td colspan="7">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

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
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>

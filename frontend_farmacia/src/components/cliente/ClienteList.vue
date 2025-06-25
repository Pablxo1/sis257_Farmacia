<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import { DataTable, Column, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { ref, computed, onMounted } from 'vue'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref(false)
const busqueda = ref('')

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

const clientesFiltrados = computed(() => {
  return clientes.value.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      cliente.ci.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
    obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'No se pudo eliminar el cliente.')
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, apellido o CI" />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="clientesFiltrados"
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
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column field="apellido" header="Apellido" sortable></Column>
        <Column field="ci" header="Cedula de Identidad"></Column>
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
            ¿Estás seguro de que deseas eliminar el cliente
            <span style="font-weight: bold; color: #1976d2">
              {{ clienteDelete?.nombre }} {{ clienteDelete?.apellido }}
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

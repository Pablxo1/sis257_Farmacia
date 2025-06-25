<script setup lang="ts">
import type { Distribuidora } from '@/models/distribuidora'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText, DataTable, Column } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'distribuidoras'
const distribuidoras = ref<Distribuidora[]>([])
const emit = defineEmits(['edit'])
const distribuidoraDelete = ref<Distribuidora | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  distribuidoras.value = await http.get(ENDPOINT).then((response) => response.data)
}

const distribuidorasFiltradas = computed(() => {
  return distribuidoras.value.filter(
    (distribuidora) =>
      distribuidora.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      distribuidora.direccion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      distribuidora.telefono.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      distribuidora.email.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(distribuidora: Distribuidora) {
  emit('edit', distribuidora)
}

function mostrarEliminarConfirm(distribuidora: Distribuidora) {
  distribuidoraDelete.value = distribuidora
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  try {
    await http.delete(`${ENDPOINT}/${distribuidoraDelete.value?.id}`)
    obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'No se pudo eliminar la distribuidora.')
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
          placeholder="Buscar por nombre, dirección, teléfono o email"
        />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="distribuidorasFiltradas"
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
        <Column field="nombre" header="Nombre"></Column>
        <Column field="direccion" header="Dirección"></Column>
        <Column field="telefono" header="Teléfono"></Column>
        <Column field="email" header="Email"></Column>
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
            ¿Estás seguro de que deseas eliminar la distribuidora
            <span style="font-weight: bold; color: #1976d2">
              {{ distribuidoraDelete?.nombre }}
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

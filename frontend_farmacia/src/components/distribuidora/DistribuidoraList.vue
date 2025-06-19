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
  await http.delete(`${ENDPOINT}/${distribuidoraDelete.value?.id}`)
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
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar esta distribuidora?</p>
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

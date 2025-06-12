<script setup lang="ts">
import type { Distribuidora } from '@/models/distribuidora'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
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
      distribuidora.telefono.toLowerCase().includes(busqueda.value.toLowerCase())||
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
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, dirección o teléfono" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(distribuidora, index) in distribuidorasFiltradas" :key="distribuidora.id">
          <td>{{ index + 1 }}</td>
          <td>{{ distribuidora.nombre }}</td>
          <td>{{ distribuidora.direccion }}</td>
          <td>{{ distribuidora.telefono }}</td>
          <td>{{ distribuidora.email }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(distribuidora)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(distribuidora)"
            />
          </td>
        </tr>
        <tr v-if="distribuidorasFiltradas.length === 0">
          <td colspan="5">No se encontraron resultados.</td>
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

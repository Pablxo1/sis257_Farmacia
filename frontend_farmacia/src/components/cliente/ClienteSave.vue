<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'clientes'
const props = defineProps({
  mostrar: Boolean,
  cliente: {
    type: Object as () => Cliente,
    default: () => ({}) as Cliente,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const cliente = ref<Cliente>({ ...props.cliente })
watch(
  () => props.cliente,
  (newVal) => {
    cliente.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: cliente.value.nombre,
      apellido: cliente.value.apellido,
      ci: cliente.value.ci,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${cliente.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    cliente.value = {} as Cliente
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'"
      style="width: 25rem"
    >
      <form @submit.prevent="handleSave">
        <div class="flex flex-column gap-3">
          <label for="nombre" class="font-semibold">Nombre</label>
          <InputText id="nombre" v-model="cliente.nombre" class="w-full" required />

          <label for="apellido" class="font-semibold">Apellido</label>
          <InputText id="apellido" v-model="cliente.apellido" class="w-full" required />

          <label for="ci" class="font-semibold">Carnet de Identidad</label>
          <InputText id="ci" v-model="cliente.ci" class="w-full" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="dialogVisible = false"
          ></Button>
          <Button
            type="submit"
            :label="props.modoEdicion ? 'Actualizar' : 'Guardar'"
            icon="pi pi-save"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped></style>

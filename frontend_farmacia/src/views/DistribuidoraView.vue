<script setup lang="ts">
import DistribuidoraList from '@/components/distribuidora/DistribuidoraList.vue'
import DistribuidoraSave from '@/components/distribuidora/DistribuidoraSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const distribuidoraListRef = ref<typeof DistribuidoraList | null>(null)
const distribuidoraEdit = ref<any>(null)

function handleCreate() {
  distribuidoraEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(distribuidora: any) {
  distribuidoraEdit.value = distribuidora
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  distribuidoraListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-7 fade-in">
    <h2>Distribuidoras</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <DistribuidoraList ref="distribuidoraListRef" @edit="handleEdit" />
    <DistribuidoraSave
      :mostrar="mostrarDialog"
      :distribuidora="distribuidoraEdit"
      :modoEdicion="!!distribuidoraEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>

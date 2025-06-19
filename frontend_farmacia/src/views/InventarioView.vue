<script setup lang="ts">
import InventarioList from '@/components/inventario/InventarioList.vue'
import InventarioSave from '@/components/inventario/InventarioSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const inventarioListRef = ref<typeof InventarioList | null>(null)
const inventarioEdit = ref<any>(null)

function handleCreate() {
  inventarioEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(inventario: any) {
  inventarioEdit.value = inventario
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  inventarioListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-7 fade-in">
    <h2>Inventarios</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <InventarioList ref="inventarioListRef" @edit="handleEdit" />
    <InventarioSave
      :mostrar="mostrarDialog"
      :inventario="inventarioEdit"
      :modoEdicion="!!inventarioEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>

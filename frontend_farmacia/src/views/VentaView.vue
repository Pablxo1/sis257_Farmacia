<script setup lang="ts">
import { ref } from 'vue'
import VentaList from '@/components/venta/VentaList.vue'
import VentaSave from '@/components/venta/VentaSave.vue'
import Button from 'primevue/button'

const mostrarDialog = ref(false)
const ventaListRef = ref<InstanceType<typeof VentaList> | null>(null)

function handleCreate() {
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  ventaListRef.value?.obtenerLista()
  mostrarDialog.value = false
}
</script>

<template>
  <div class="m-7 fade-in">
    <h2>Ventas</h2>
    <div class="mb-3 flex justify-end">
      <Button label="Registrar Venta" icon="pi pi-plus" @click="handleCreate" />
    </div>
    <VentaList ref="ventaListRef" />
    <VentaSave :mostrar="mostrarDialog" @guardar="handleGuardar" @close="handleCloseDialog" />
  </div>
</template>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}
.m-7 {
  margin: 2rem;
}
</style>

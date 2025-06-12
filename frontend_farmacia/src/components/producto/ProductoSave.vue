<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
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

const producto = ref<Producto>({ ...props.producto })
const precioVentaString = ref(producto.value.precioVenta !== undefined ? String(producto.value.precioVenta) : '')
const precioCompraString = ref(producto.value.precioCompra !== undefined ? String(producto.value.precioCompra) : '')

watch(
  () => props.producto,
  (newVal) => {
    producto.value = { ...newVal }
    precioVentaString.value = newVal.precioVenta !== undefined ? String(newVal.precioVenta) : ''
    precioCompraString.value = newVal.precioCompra !== undefined ? String(newVal.precioCompra) : ''
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      presentacion: producto.value.presentacion,
      concentracion: producto.value.concentracion,
      precioVenta: precioVentaString.value ? Number(precioVentaString.value) : undefined,
      precioCompra: precioCompraString.value ? Number(precioCompraString.value) : undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    precioVentaString.value = ''
    precioCompraString.value = ''
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
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="producto.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="descripcion" class="font-semibold w-3">Descripcion</label>
        <InputText
          id="descripcion"
          v-model="producto.descripcion"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="presentacion" class="font-semibold w-3">Presentacion</label>
        <InputText
          id="presentacion"
          v-model="producto.presentacion"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="concentracion" class="font-semibold w-3">Concentracion</label>
        <InputText
          id="concentracion"
          v-model="producto.concentracion"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precioVenta" class="font-semibold w-3">Precio de Venta</label>
        <InputText
          id="precioVenta"
          v-model="precioVentaString"
          class="flex-auto"
          autocomplete="off"
          type="number"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precioCompra" class="font-semibold w-3">Precio de Compra</label>
        <InputText
          id="precioCompra"
          v-model="precioCompraString"
          class="flex-auto"
          autocomplete="off"
          type="number"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import type { Inventario } from '@/models/inventario'
import type { Producto } from '@/models/producto'
import type { Distribuidora } from '@/models/distribuidora'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'inventarios'
const props = defineProps({
  mostrar: Boolean,
  inventario: {
    type: Object as () => Inventario,
    default: () => ({}) as Inventario,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const productos = ref<Producto[]>([])
const distribuidoras = ref<Distribuidora[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const inventario = ref<Inventario>({ ...props.inventario })
const cantidadString = ref(
  inventario.value.cantidad !== undefined ? String(inventario.value.cantidad) : '',
)
const minFechaVencimiento = ref(new Date())

async function obtenerProductos() {
  productos.value = await http.get('productos').then((response) => response.data)
}

async function obtenerDistribuidoras() {
  distribuidoras.value = await http.get('distribuidoras').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idProducto: inventario.value.idProducto,
      idDistribuidora: inventario.value.idDistribuidora,
      cantidad: cantidadString.value ? Number(cantidadString.value) : undefined,
      fechaIngresoAlmacen: inventario.value.fechaIngresoAlmacen
        ? new Date(inventario.value.fechaIngresoAlmacen).toISOString().slice(0, 10)
        : undefined,
      fechaVencimiento: inventario.value.fechaVencimiento
        ? new Date(inventario.value.fechaVencimiento).toISOString().slice(0, 10)
        : undefined,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${inventario.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    inventario.value = {} as Inventario
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (nuevoValor) {
      await obtenerProductos()
      await obtenerDistribuidoras()
      if (props.inventario?.id) {
        inventario.value = {
          ...props.inventario,
          idProducto: props.inventario.idProducto ?? props.inventario.producto?.id ?? null,
          idDistribuidora:
            props.inventario.idDistribuidora ?? props.inventario.distribuidora?.id ?? null,
        }
        cantidadString.value =
          inventario.value.cantidad !== undefined ? String(inventario.value.cantidad) : ''
      } else {
        inventario.value = {} as Inventario
        cantidadString.value = ''
        inventario.value.fechaIngresoAlmacen = new Date()
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Inventario'"
      style="width: 28rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="producto" class="font-semibold w-3">Producto</label>
        <Dropdown
          id="producto"
          v-model="inventario.idProducto"
          :options="productos"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          placeholder="Seleccione un producto"
          filter
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="distribuidora" class="font-semibold w-3">Distribuidora</label>
        <Dropdown
          id="distribuidora"
          v-model="inventario.idDistribuidora"
          :options="distribuidoras"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          placeholder="Seleccione una distribuidora"
          filter
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="cantidad" class="font-semibold w-3">Cantidad</label>
        <InputText
          id="cantidad"
          v-model="cantidadString"
          class="flex-auto"
          autocomplete="off"
          type="number"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaIngresoAlmacen" class="font-semibold w-3"
          >Fecha de ingreso a Almacen</label
        >
        <Calendar
          id="fechaIngresoAlmacen"
          v-model="inventario.fechaIngresoAlmacen"
          class="flex-auto"
          dateFormat="yy-mm-dd"
          showIcon
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaVencimiento" class="font-semibold w-3">Fecha de Vencimiento</label>
        <Calendar
          id="fechaVencimiento"
          v-model="inventario.fechaVencimiento"
          class="flex-auto"
          dateFormat="yy-mm-dd"
          showIcon
          :minDate="minFechaVencimiento"
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

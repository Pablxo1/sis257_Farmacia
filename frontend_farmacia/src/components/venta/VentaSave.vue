<script setup lang="ts">
import type { Venta } from '@/models/venta'
import type { ItemVenta } from '@/models/item-venta'
import type { Cliente } from '@/models/cliente'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  mostrar: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])
type ItemVentaWithString = ItemVenta & { cantidadString?: string; precioUnitarioString?: string }
const items = ref<ItemVentaWithString[]>([])
const idCliente = ref<number | null>(null)
const fecha = ref(new Date().toISOString().slice(0, 10))
const efectivoString = ref<string>('')

function limpiarFormulario() {
  idCliente.value = null
  fecha.value = new Date().toISOString().slice(0, 10)
  efectivoString.value = '0'
  items.value = []
}

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) {
      limpiarFormulario()
      emit('close')
    }
  },
})

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0),
)
const cambio = computed(() => Number(efectivoString.value) - total.value)

async function cargarClientes() {
  clientes.value = await http.get('clientes').then((res) => res.data)
}
async function cargarProductos() {
  productos.value = await http.get('productos').then((res) => res.data)
}
function agregarItem() {
  items.value.push({
    id: 0,
    idVenta: 0,
    idProducto: 0,
    cantidad: 1,
    precioUnitario: 0,
    cantidadString: '1',
    precioUnitarioString: '0',
    producto: {
      id: 0,
      nombre: '',
      descripcion: '',
      presentacion: '',
      concentracion: '',
      precioVenta: 0,
      precioCompra: 0,
    },
    venta: {
      id: 0,
      idCliente: 0,
      fecha: '',
      total: 0,
      efectivo: 0,
      cambio: 0,
      cliente: {
        id: 0,
        nombre: '',
        apellido: '',
        ci: '',
      },
      itemVentas: [],
    },
  })
}
function eliminarItem(idx: number) {
  items.value.splice(idx, 1)
}

watch(
  items,
  (nuevosItems) => {
    nuevosItems.forEach((item) => {
      if (item.idProducto && productos.value.length > 0) {
        const prod = productos.value.find((p) => p.id === item.idProducto)
        if (prod && item.precioUnitario !== prod.precioVenta) {
          item.precioUnitario = Number(Number(prod.precioVenta).toFixed(2))
        }
      }
    })
  },
  { deep: true },
)

async function handleSave() {
  try {
    const efectivo = Number(efectivoString.value)
    if (isNaN(efectivo) || efectivo <= 0) {
      alert('Debes ingresar un monto en efectivo válido.')
      return
    }

    for (const item of items.value) {
      if (!item.idProducto || item.idProducto === 0) {
        alert('Selecciona un producto para cada item.')
        return
      }
      if (!item.cantidad || isNaN(item.cantidad) || item.cantidad <= 0) {
        alert('La cantidad debe ser mayor a 0 para cada producto.')
        return
      }
      if (
        item.precioUnitario === undefined ||
        item.precioUnitario === null ||
        isNaN(item.precioUnitario) ||
        item.precioUnitario < 0
      ) {
        alert('El precio unitario debe ser válido y mayor o igual a 0.')
        return
      }
    }

    await http.post('ventas', {
      venta: {
        idCliente: idCliente.value,
        fecha: fecha.value,
        total: total.value,
        efectivo: efectivo,
        cambio: cambio.value,
      },
      items: items.value.map((item) => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: Number(item.precioUnitario.toFixed(2)),
      })),
    })

    emit('guardar')
    limpiarFormulario()
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar la venta')
    limpiarFormulario()
    dialogVisible.value = false
  }
}

watch(
  () => props.mostrar,
  async (mostrar) => {
    limpiarFormulario()
    if (mostrar) {
      await cargarClientes()
      await cargarProductos()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" header="Registrar Venta" style="width: 40rem">
      <div class="flex items-center gap-4 mb-4">
        <label for="cliente" class="font-semibold w-3">Cliente</label>
        <Dropdown
          id="cliente"
          v-model="idCliente"
          :options="clientes"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          placeholder="Seleccione un cliente"
        />
        <label for="fecha" class="font-semibold w-3 ml-4">Fecha</label>
        <InputText id="fecha" v-model="fecha" type="date" class="flex-auto" />
      </div>
      <div class="mb-3">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in items" :key="idx">
              <td>
                <Dropdown
                  v-model="item.idProducto"
                  :options="productos"
                  optionLabel="nombre"
                  optionValue="id"
                  placeholder="Producto"
                  class="w-12rem"
                />
              </td>
              <td>
                <InputText
                  v-model="item.cantidadString"
                  type="number"
                  min="1"
                  class="w-6rem"
                  @input="item.cantidad = Number(item.cantidadString)"
                />
              </td>
              <td>
                <span class="w-8rem block text-right">{{ item.precioUnitario.toFixed(2) }}</span>
              </td>
              <td>{{ (item.cantidad * item.precioUnitario).toFixed(2) }}</td>
              <td>
                <Button icon="pi pi-trash" severity="danger" text @click="eliminarItem(idx)" />
              </td>
            </tr>
          </tbody>
        </table>
        <Button icon="pi pi-plus" label="Agregar Producto" class="mt-2" @click="agregarItem" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label class="font-semibold">Total:</label>
        <span>{{ total.toFixed(2) }}</span>
        <label class="font-semibold ml-4">Efectivo:</label>
        <InputText v-model="efectivoString" type="number" min="0" step="0.01" class="w-8rem" />
        <label class="font-semibold ml-4">Cambio:</label>
        <span>{{ cambio.toFixed(2) }}</span>
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="
            () => {
              dialogVisible = false
              limpiarFormulario()
            }
          "
        />
        <Button
          type="button"
          label="Guardar"
          icon="pi pi-save"
          @click="handleSave"
          :disabled="!idCliente || items.length === 0 || total <= 0"
        />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}
.ml-4 {
  margin-left: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.w-6rem {
  width: 6rem;
}
.w-8rem {
  width: 8rem;
}
.w-12rem {
  width: 12rem;
}
</style>

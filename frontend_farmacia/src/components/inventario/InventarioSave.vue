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

function productoLabel(producto: Producto | undefined) {
  if (!producto) return ''
  return `${producto.nombre} (${producto.presentacion}, ${producto.concentracion})`
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
  <div class="inventario-save-container">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? '✏️ Editar' : '🆕 Nuevo') + ' Inventario'"
      :style="{ width: '32rem', maxWidth: '98vw' }"
      modal
    >
      <form @submit.prevent="handleSave">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="producto" class="form-label">Producto</label>
              <Dropdown
                id="producto"
                v-model="inventario.idProducto"
                :options="productos"
                optionLabel="nombre"
                optionValue="id"
                class="w-full"
                placeholder="Seleccione un producto"
                filter
                required
              >
                <template #option="slotProps">
                  <span>
                    {{ productoLabel(slotProps.option) }}
                  </span>
                </template>
                <template #value="slotProps">
                  <span v-if="slotProps.value">
                    {{ productoLabel(productos.find((p) => p.id === slotProps.value)) }}
                  </span>
                  <span v-else class="p-dropdown-label p-placeholder">Seleccione un producto</span>
                </template>
              </Dropdown>
            </div>
            <div class="form-group">
              <label for="distribuidora" class="form-label">Distribuidora</label>
              <Dropdown
                id="distribuidora"
                v-model="inventario.idDistribuidora"
                :options="distribuidoras"
                optionLabel="nombre"
                optionValue="id"
                class="w-full"
                placeholder="Seleccione una distribuidora"
                filter
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="cantidad" class="form-label">Cantidad</label>
              <InputText
                id="cantidad"
                v-model="cantidadString"
                class="w-full"
                autocomplete="off"
                type="number"
                min="0"
                required
              />
            </div>
            <div class="form-group">
              <label for="fechaIngresoAlmacen" class="form-label">Fecha de Ingreso</label>
              <Calendar
                id="fechaIngresoAlmacen"
                v-model="inventario.fechaIngresoAlmacen"
                class="w-full"
                dateFormat="yy-mm-dd"
                showIcon
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="fechaVencimiento" class="form-label">Fecha de Vencimiento</label>
              <Calendar
                id="fechaVencimiento"
                v-model="inventario.fechaVencimiento"
                class="w-full"
                dateFormat="yy-mm-dd"
                showIcon
                :minDate="minFechaVencimiento"
                required
              />
            </div>
          </div>
        </div>
        <div class="form-actions">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="dialogVisible = false"
          />
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

<style scoped>
.inventario-save-container {
  padding: 1.5rem 0.5rem 0.5rem 0.5rem;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(25, 118, 210, 0.08);
  max-width: 600px;
  margin: 0 auto;
}

.form-section {
  margin: 1.5rem 0 0.5rem 0;
  background: #e3f2fd;
  border-radius: 10px;
  padding: 1rem 0.7rem;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.04);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.form-group {
  margin-bottom: 0.2rem;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #1976d2;
  letter-spacing: 0.5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.p-button {
  font-size: 1rem !important;
  border-radius: 8px !important;
  padding: 0.6rem 1.2rem !important;
}

.p-inputtext,
.p-dropdown,
.p-calendar {
  border-radius: 8px !important;
  font-size: 1rem !important;
  padding: 0.5rem 0.7rem !important;
}

.p-dialog .p-dialog-header {
  border-radius: 16px 16px 0 0;
}

.p-dialog .p-dialog-content {
  border-radius: 0 0 16px 16px;
}

@media (max-width: 700px) {
  .inventario-save-container {
    padding: 0.5rem;
    max-width: 100vw;
  }
  .form-row {
    flex-direction: column;
    gap: 0.7rem;
  }
  .form-group {
    min-width: 100px;
  }
}
</style>

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
const precioVentaString = ref(
  producto.value.precioVenta !== undefined ? String(producto.value.precioVenta) : '',
)
const precioCompraString = ref(
  producto.value.precioCompra !== undefined ? String(producto.value.precioCompra) : '',
)

watch(
  () => props.producto,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      producto.value = { ...newVal }
      precioVentaString.value = newVal.precioVenta !== undefined ? String(newVal.precioVenta) : ''
      precioCompraString.value =
        newVal.precioCompra !== undefined ? String(newVal.precioCompra) : ''
    } else {
      producto.value = {} as Producto
      precioVentaString.value = ''
      precioCompraString.value = ''
    }
  },
  { immediate: true },
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
  <div class="producto-save-container">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? '✏️ Editar Producto' : '🆕 Nuevo Producto'"
      :style="{ width: '32rem', maxWidth: '98vw' }"
      modal
    >
      <form @submit.prevent="handleSave">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre</label>
              <InputText id="nombre" v-model="producto.nombre" class="w-full" required />
            </div>
            <div class="form-group">
              <label for="presentacion" class="form-label">Presentación</label>
              <InputText
                id="presentacion"
                v-model="producto.presentacion"
                class="w-full"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="concentracion" class="form-label">Concentración</label>
              <InputText
                id="concentracion"
                v-model="producto.concentracion"
                class="w-full"
                required
              />
            </div>
            <div class="form-group">
              <label for="descripcion" class="form-label">Descripción</label>
              <InputText id="descripcion" v-model="producto.descripcion" class="w-full" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="precioVenta" class="form-label">Precio de Venta</label>
              <InputText
                id="precioVenta"
                v-model="precioVentaString"
                class="w-full"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div class="form-group">
              <label for="precioCompra" class="form-label">Precio de Compra</label>
              <InputText
                id="precioCompra"
                v-model="precioCompraString"
                class="w-full"
                type="number"
                min="0"
                step="0.01"
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
.producto-save-container {
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
.p-dropdown {
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
  .producto-save-container {
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

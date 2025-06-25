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
import type { Inventario } from '@/models/inventario'

const props = defineProps({
  mostrar: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const clientes = ref<Cliente[]>([])
const clienteSeleccionado = ref<Cliente | null>(null)

const productos = ref<Producto[]>([])
type ItemVentaTemporal = {
  idInventario: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  cantidadString?: string
  precioUnitarioString?: string
  producto: Producto
  inventario: Inventario
}
const items = ref<ItemVentaTemporal[]>([])
const idCliente = ref<number | null>(null)
const fecha = ref(new Date().toISOString())
const efectivoString = ref<string>('')

function limpiarFormulario() {
  idCliente.value = null
  fecha.value = new Date().toISOString()
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

const nuevoItem = ref({
  idProducto: null,
  idInventario: null,
  cantidadString: '1',
  precioUnitarioString: '0',
})

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0),
)

const cambio = computed(() => Number(efectivoString.value) - total.value)

async function cargarClientes() {
  clientes.value = await http.get('clientes').then((res) => res.data)
}

const inventarios = ref<Inventario[]>([])

async function cargarProductos() {
  const res = await http.get('inventarios')
  inventarios.value = res.data
}

const inventariosConStock = computed(() =>
  inventarios.value.filter((inv) => {
    const yaEnItems = items.value
      .filter((i) => i.idInventario === inv.id)
      .reduce((sum, i) => sum + i.cantidad, 0)
    return inv.cantidad - yaEnItems > 0
  }),
)

const stockSeleccionado = computed(() => {
  const inv = inventarios.value.find((i) => i.id === nuevoItem.value.idInventario)
  return inv ? inv.cantidad : 1
})

const clientesConNombreCompleto = computed(() =>
  clientes.value.map((c) => ({
    ...c,
    nombreCompleto: `${c.nombre} ${c.apellido} (${c.ci})`,
  })),
)

function inventarioLabel(inv: Inventario) {
  const yaEnItems = items.value
    .filter((i) => i.idInventario === inv.id)
    .reduce((sum, i) => sum + i.cantidad, 0)
  const disponible = inv.cantidad - yaEnItems
  return inv
    ? `${inv.producto.nombre} (${inv.producto.presentacion}, ${inv.producto.concentracion}) - Stock: ${disponible}`
    : ''
}

function agregarItem() {
  const idInventario = Number(nuevoItem.value.idInventario)
  const cantidad = Number(nuevoItem.value.cantidadString)
  if (!idInventario || cantidad < 1) return

  const inv = inventarios.value.find((i) => i.id === idInventario)
  if (!inv) return

  // suma la cantidad ya agregada de inventario en items
  const yaEnItems = items.value
    .filter((i) => i.idInventario === idInventario)
    .reduce((sum, i) => sum + i.cantidad, 0)

  // stock disponible es el original menos lo que ya esta en items
  const stockDisponible = inv.cantidad - yaEnItems

  if (cantidad > stockDisponible) {
    alert('No hay suficiente stock disponible.')
    return
  }

  const existente = items.value.find((i) => i.idInventario === idInventario)
  if (existente) {
    existente.cantidad += cantidad
    existente.cantidadString = String(existente.cantidad)
  } else {
    items.value.push({
      idInventario,
      idProducto: inv.idProducto ?? inv.producto?.id,
      cantidad,
      precioUnitario: Number(inv.producto.precioVenta),
      cantidadString: String(cantidad),
      precioUnitarioString: String(inv.producto.precioVenta),
      producto: inv.producto,
      inventario: inv,
    })
  }



  nuevoItem.value.idInventario = null
  nuevoItem.value.cantidadString = '1'
}

const mostrarDialogCliente = ref(false)
const clienteNuevo = ref({
  nombre: '',
  apellido: '',
  ci: '',
})
const cargandoCliente = ref(false)

async function guardarCliente() {
  if (!clienteNuevo.value.nombre || !clienteNuevo.value.apellido || !clienteNuevo.value.ci) {
    alert('Todos los campos son obligatorios.')
    return
  }

  const existe = clientes.value.some(
    (c) => c.ci.trim().toLowerCase() === clienteNuevo.value.ci.trim().toLowerCase(),
  )
  if (existe) {
    alert('Ya existe un cliente con ese CI o cédula de identidad.')
    return
  }

  cargandoCliente.value = true
  try {
    const res = await http.post('clientes', {
      nombre: clienteNuevo.value.nombre,
      apellido: clienteNuevo.value.apellido,
      ci: clienteNuevo.value.ci,
    })
    // agrega el nuevo cliente y selecciona
    clientes.value.push(res.data)
    idCliente.value = res.data.id
    mostrarDialogCliente.value = false
    clienteNuevo.value = { nombre: '', apellido: '', ci: '' }
  } catch (e: any) {
    alert(e?.response?.data?.message || 'Error al agregar cliente.')
  } finally {
    cargandoCliente.value = false
  }
}

function eliminarItem(idx: number) {
  const item = items.value[idx]
  const inv = inventarios.value.find((i) => i.id === item.idInventario)
  if (inv) {
    inv.cantidad += item.cantidad
  }
  items.value.splice(idx, 1)
}

watch(
  () => nuevoItem.value.idProducto,
  (idProducto) => {
    const prod = productos.value.find((p) => p.id === Number(idProducto))
    if (prod) {
      nuevoItem.value.precioUnitarioString = String(Number(prod.precioVenta).toFixed(2))
    } else {
      nuevoItem.value.precioUnitarioString = '0'
    }
  },
)

watch(
  () => clienteSeleccionado.value,
  (nuevo) => {
    idCliente.value = nuevo ? nuevo.id : null
  },
)

async function handleSave() {
  try {
    const efectivo = Number(efectivoString.value)
    if (isNaN(efectivo) || efectivo <= 0) {
      alert('Debes ingresar un monto en efectivo válido.')
      return
    }

    if (efectivo < total.value) {
      alert('El efectivo no puede ser menor que el total de la venta.')
      return
    }

    console.log('Items a guardar:', items.value)
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
    console.log('Datos a enviar:', {
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
        idInventario: item.idInventario,
      })),
    })
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
        idInventario: item.idInventario,
      })),
    })

    emit('guardar')
    limpiarFormulario()
    dialogVisible.value = false
  } catch (error: any) {
    console.error('Error al guardar venta:', error)
    alert(error?.response?.data?.message || error?.message || 'Error al guardar la venta')
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

function formatFecha(fecha: string) {
  const d = new Date(fecha)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const anio = d.getFullYear()
  const horas = String(d.getHours()).padStart(2, '0')
  const minutos = String(d.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`
}
</script>

<template>
  <div class="venta-save-container">
    <Dialog
      v-model:visible="dialogVisible"
      header="🧾 Registrar Venta"
      :style="{ width: '50rem', maxWidth: '98vw' }"
      modal
    >
      <form @submit.prevent="handleSave">
        <!-- Cliente y Fecha -->
        <div class="form-section">
          <div class="form-row" style="align-items: flex-end; gap: 0.3rem">
            <div class="form-group" style="flex: 1; margin-bottom: 0">
              <label for="cliente" class="form-label">Cliente</label>
              <Dropdown
                id="cliente"
                v-model="clienteSeleccionado"
                :options="clientesConNombreCompleto"
                optionLabel="nombreCompleto"
                placeholder="Seleccione un cliente"
                class="w-20rem"
                filter
                required
              >
                <template #option="slotProps">
                  <div style="display: flex; flex-direction: column">
                    <span style="font-weight: 600">
                      {{ slotProps.option.nombre }} {{ slotProps.option.apellido }}
                    </span>
                    <span style="font-size: 0.95em; color: #1976d2">
                      CI: {{ slotProps.option.ci }}
                    </span>
                  </div>
                </template>
                <template #value="slotProps">
                  <span v-if="slotProps.value">
                    {{ slotProps.value.nombre }} {{ slotProps.value.apellido }}
                    <span style="color: #1976d2">(CI: {{ slotProps.value.ci }})</span>
                  </span>
                  <span v-else class="p-dropdown-label p-placeholder">Seleccione un cliente</span>
                </template>
              </Dropdown>
            </div>
            <div style="margin-bottom: 0.1rem; margin-right: 5.9rem;">
              <Button
                icon="pi pi-user-plus"
                class="p-button-rounded p-button-success"
                @click="mostrarDialogCliente = true"
                title="Agregar nuevo cliente"
              />
            </div>
            <div class="form-group fecha-fija" style="margin-bottom: 0">
              <label for="fecha" class="form-label">Fecha</label>
              <InputText
                id="fecha"
                :value="formatFecha(fecha)"
                class="w-full"
                readonly
                style="background: #f5f5f5; color: #222; font-weight: 600"
              />
            </div>
          </div>
        </div>

        <hr class="my-4" />

        <!-- agregar Productos -->
        <div class="form-section">
          <h4 class="mb-3" style="color: #08902c">
            <i class="pi pi-shopping-cart mr-2"></i>
            Agregar Productos
          </h4>
          <div
            class="form-row align-items-end mb-3"
            style="justify-content: space-between; gap: 0.5rem"
          >
            <div class="form-group" style="flex: 2; min-width: 220px; max-width: 350px">
              <label class="form-label">Producto</label>
              <Dropdown
                v-model="nuevoItem.idInventario"
                :options="inventariosConStock"
                :optionLabel="inventarioLabel"
                optionValue="id"
                placeholder="Seleccione un producto"
                class="w-full"
                filter
                required
              />
            </div>
            <div
              style="
                display: flex;
                gap: 0.5rem;
                align-items: flex-end;
                flex: 1;
                justify-content: flex-end;
              "
            >
              <div class="form-group" style="min-width: 90px; max-width: 120px">
                <label class="form-label">Cantidad</label>
                <InputText
                  v-model="nuevoItem.cantidadString"
                  type="number"
                  min="1"
                  :max="stockSeleccionado"
                  class="w-5rem text-center"
                  required
                />
              </div>
              <div class="form-group" style="min-width: 90px; max-width: 120px">
                <label class="form-label">Precio</label>
                <InputText
                  v-model="nuevoItem.precioUnitarioString"
                  type="number"
                  class="w-6rem text-center"
                  readonly
                  style="background: #f5f5f5; color: #222; font-weight: 600"
                />
              </div>
              <div class="form-group" style="min-width: 80px">
                <Button
                  icon="pi pi-plus"
                  label="Agregar"
                  class="mt-2"
                  @click.prevent="agregarItem"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Productos agregados -->
        <div class="form-section">
          <h4 class="mb-3" style="color: #1976d2">
            <i class="pi pi-list mr-2"></i>
            Productos en la Venta
          </h4>
          <table class="productos-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Presentación</th>
                <th>Concentración</th>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Precio Unitario</th>
                <th class="text-center">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in items" :key="idx">
                <td>{{ item.producto?.nombre }}</td>
                <td>{{ item.producto?.presentacion }}</td>
                <td>{{ item.producto?.concentracion }}</td>
                <td class="text-center">{{ item.cantidad }}</td>
                <td class="text-center">{{ Number(item.precioUnitario).toFixed(2) }}</td>
                <td class="text-center">{{ (item.cantidad * item.precioUnitario).toFixed(2) }}</td>
                <td>
                  <Button icon="pi pi-trash" severity="danger" text @click="eliminarItem(idx)" />
                </td>
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="7" class="text-center" style="color: #888">
                  No hay productos agregados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total, Efectivo y Cambio -->
        <div class="form-section">
          <div class="form-row mt-3">
            <div class="form-group">
              <label class="form-label">Total:</label>
              <span class="form-value">{{ total.toFixed(2) }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Efectivo:</label>
              <InputText
                v-model="efectivoString"
                type="number"
                min="0"
                step="0.01"
                class="w-8rem"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Cambio:</label>
              <span class="form-value">{{ cambio.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="form-actions">
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
            type="submit"
            label="Guardar"
            icon="pi pi-save"
            :disabled="!idCliente || items.length === 0 || total <= 0"
          />
        </div>
      </form>
    </Dialog>

    <!-- Dialogo para agregar nuevo cliente -->
    <Dialog
      v-model:visible="mostrarDialogCliente"
      header="Nuevo Cliente"
      :style="{ width: '25rem' }"
      modal
    >
      <form @submit.prevent="guardarCliente">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <InputText v-model="clienteNuevo.nombre" class="w-full" required />
        </div>
        <div class="form-group">
          <label class="form-label">Apellido</label>
          <InputText v-model="clienteNuevo.apellido" class="w-full" required />
        </div>
        <div class="form-group">
          <label class="form-label">Cedula de Identidad</label>
          <InputText v-model="clienteNuevo.ci" class="w-full" required />
        </div>
        <div class="form-actions">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="mostrarDialogCliente = false"
          />
          <Button type="submit" label="Guardar" icon="pi pi-save" :loading="cargandoCliente" />
        </div>
      </form>
    </Dialog>
  </div>
</template>
<style scoped>
.venta-save-container {
  padding: 1.5rem 0.5rem 0.5rem 0.5rem;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(25, 118, 210, 0.08);
  max-width: 900px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  min-width: 160px;
  margin-bottom: 0.7rem;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #1976d2;
  letter-spacing: 0.5px;
}

.form-value {
  font-weight: bold;
  font-size: 1.1rem;
  color: #222;
}

.form-section {
  margin: 1.5rem 0 0.5rem 0;
  background: #e3f2fd;
  border-radius: 10px;
  padding: 1rem 0.7rem;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.04);
}

.productos-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5rem;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(25, 118, 210, 0.07);
}

.productos-table th,
.productos-table td {
  padding: 0.7rem 0.7rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}

.productos-table th {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  font-size: 1rem;
}

.productos-table td.text-right,
.productos-table th.text-right {
  text-align: right;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.fecha-fija {
  min-width: 180px;
  max-width: 250px;
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

.p-dropdown {
  min-width: 180px;
}

.p-dialog .p-dialog-header {
  border-radius: 16px 16px 0 0;
}

.p-dialog .p-dialog-content {
  border-radius: 0 0 16px 16px;
}

@media (max-width: 900px) {
  .venta-save-container {
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
  .productos-table th,
  .productos-table td {
    padding: 0.3rem 0.3rem;
    font-size: 0.95rem;
  }
}
</style>

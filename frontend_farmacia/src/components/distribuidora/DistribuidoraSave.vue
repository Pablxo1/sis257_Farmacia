<script setup lang="ts">
import type { Distribuidora } from '@/models/distribuidora'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'distribuidoras'
const props = defineProps({
  mostrar: Boolean,
  distribuidora: {
    type: Object as () => Distribuidora,
    default: () => ({}) as Distribuidora,
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

const distribuidora = ref<Distribuidora>({ ...props.distribuidora })
watch(
  () => props.distribuidora,
  (newVal) => {
    distribuidora.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: distribuidora.value.nombre,
      direccion: distribuidora.value.direccion,
      telefono: distribuidora.value.telefono,
      email: distribuidora.value.email,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${distribuidora.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    distribuidora.value = {} as Distribuidora
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="distribuidora-save-container">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? '✏️ Editar Distribuidora' : '🆕 Nueva Distribuidora'"
      :style="{ width: '32rem', maxWidth: '98vw' }"
      modal
    >
      <form @submit.prevent="handleSave">
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre</label>
              <InputText
                id="nombre"
                v-model="distribuidora.nombre"
                class="w-full"
                autocomplete="off"
                autofocus
                required
              />
            </div>
            <div class="form-group">
              <label for="direccion" class="form-label">Dirección</label>
              <InputText
                id="direccion"
                v-model="distribuidora.direccion"
                class="w-full"
                autocomplete="off"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="telefono" class="form-label">Teléfono</label>
              <InputText
                id="telefono"
                v-model="distribuidora.telefono"
                class="w-full"
                autocomplete="off"
                required
              />
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <InputText
                id="email"
                v-model="distribuidora.email"
                class="w-full"
                autocomplete="off"
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
.distribuidora-save-container {
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
  .distribuidora-save-container {
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

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'
import { useRoute, useRouter } from 'vue-router'

const usuario = ref('')
const clave = ref('')
const error = ref(false)

const route = useRoute()
const router = useRouter()

function onSubmit() {
  const authStore = useAuthStore()
  authStore
    .login(usuario.value, clave.value)
    .then(() => {
      const returnUrl = '/productos'
      router.push(returnUrl as string)
    })
    .catch(() => (error.value = true))
}

function volverHome() {
  window.location.href = '/'
}
</script>

<template>
  <div class="login-bg fade-in">
    <form class="login-card" @submit.prevent="onSubmit">
      <div class="login-header">
        <span class="material-symbols-outlined login-icon">admin_meds</span>
        <h1 class="login-title">Sistema Farmacia</h1>
        <p class="login-subtitle">Iniciar Sesión</p>
      </div>
      <div class="login-group">
        <label class="login-label" for="usuario">Usuario</label>
        <div class="login-input-wrapper">
          <span class="material-symbols-outlined login-input-icon">person</span>
          <input
            v-model="usuario"
            id="usuario"
            type="text"
            class="login-input"
            placeholder="Usuario"
            autofocus
          />
        </div>
      </div>
      <div class="login-group">
        <label class="login-label" for="clave">Contraseña</label>
        <div class="login-input-wrapper">
          <span class="material-symbols-outlined login-input-icon">lock</span>
          <input
            v-model="clave"
            id="clave"
            type="password"
            class="login-input"
            placeholder="Contraseña"
          />
        </div>
      </div>
      <p v-if="error" class="login-error">Usuario y/o contraseña incorrectos</p>
      <button type="submit" class="login-btn">Ingresar</button>
      <div class="volver-home-link">
        <a href="#" @click.prevent="volverHome">
          <span class="material-symbols-outlined" style="vertical-align: middle">arrow_back</span>
          Volver al inicio
        </a>
      </div>
    </form>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(25, 118, 210, 0.1);
  border: 1px solid #bbdefb;
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.login-icon {
  font-size: 3.2rem;
  color: #1976d2;
  margin-bottom: 0.2rem;
}

.login-title {
  color: #1976d2;
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0.2rem 0 0.1rem 0;
  font-size: 1.6rem;
}

.login-subtitle {
  color: #43a047;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.login-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.login-label {
  color: #1976d2;
  font-weight: 600;
  margin-bottom: 0.1rem;
  font-size: 1rem;
}

.login-input-wrapper {
  display: flex;
  align-items: center;
  background: #e3f2fd;
  border-radius: 6px;
  border: 1px solid #bbdefb;
  padding: 0.2rem 0.7rem;
  transition: border 0.2s;
}

.login-input-icon {
  color: #1976d2;
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.login-input {
  border: none;
  background: transparent;
  outline: none;
  color: #1976d2;
  font-size: 1rem;
  flex: 1;
  padding: 0.6rem 0;
}

.login-input:focus {
  outline: none;
}

.login-btn {
  background: linear-gradient(90deg, #43a047 60%, #1976d2 100%);
  border: none;
  border-radius: 2rem;
  color: #fff;
  margin-top: 1.2rem;
  padding: 0.9rem 0;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.07);
}

.login-btn:hover {
  background: linear-gradient(90deg, #388e3c 60%, #1565c0 100%);
}

.login-error {
  color: #e53935;
  margin-top: 0.5rem;
  font-weight: 600;
  text-align: center;
  font-size: 0.98rem;
  letter-spacing: 0.5px;
}
.volver-home-link {
  text-align: center;
  margin-top: 1.2rem;
}
.volver-home-link a {
  color: #1976d2;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.05rem;
  transition: color 0.2s;
}
.volver-home-link a:hover {
  color: #43a047;
  text-decoration: underline;
}
</style>

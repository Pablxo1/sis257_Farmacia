<script setup lang="ts">
import { Button } from 'primevue'
import OverlayPanel from 'primevue/overlaypanel'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const sidebarCollapsed = ref(false)
const op = ref()
const authStore = useAuthStore()

const menuItems = [
  { name: 'home', label: 'Dashboard', path: '/', icon: 'pi pi-home' },
  { name: 'productos', label: 'Productos', path: '/productos', icon: 'pi pi-box' },
  { name: 'clientes', label: 'Clientes', path: '/clientes', icon: 'pi pi-users' },
  { name: 'inventarios', label: 'Inventarios', path: '/inventarios', icon: 'pi pi-warehouse' },
  { name: 'ventas', label: 'Ventas', path: '/ventas', icon: 'pi pi-shopping-cart' },
  { name: 'distribuidoras', label: 'Distribuidoras', path: '/distribuidoras', icon: 'pi pi-truck' },
]

const currentPageTitle = computed(() => {
  const currentItem = menuItems.find((item) => item.name === route.name)
  return currentItem?.label || 'FarmaSystem'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function logout() {
  authStore.logout()
  window.location.href = '/'
}
</script>

<template>
  <div class="app-container flex fade-in">
    <aside :class="['sidebar p-3', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-brand flex flex-column align-items-center mb-4">
        <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #fff">
          admin_meds
        </span>
        <h4
          v-if="!sidebarCollapsed"
          class="m-0 font-bold text-xl"
          style="letter-spacing: 1.5px; color: #fff; text-shadow: 0 2px 8px rgba(25, 118, 210, 0.25);"
        >
          <span style="font-weight: 800;">Sistema</span>
          <span style="font-weight: 900; margin-left: 4px ; text-shadow: 0 2px 8px rgba(255, 214, 0, 0.25);">
            Farmacia
          </span>
        </h4>
      </div>
      <nav class="sidebar-nav flex flex-column gap-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="nav-link flex align-items-center gap-2"
          :class="{ active: $route.name === item.name }"
        >
          <i :class="item.icon"></i>
          <span v-if="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <div class="main-content flex-1 flex flex-column">
      <header class="top-header flex justify-content-between align-items-center px-4 py-2">
        <div class="flex align-items-center gap-3">
          <Button
            icon="pi pi-bars"
            class="p-button-text p-button-rounded p-button-lg"
            @click="toggleSidebar"
            aria-label="Toggle Sidebar"
          />
          <div class="page-title-container flex align-items-center gap-2">
            <i
              :class="menuItems.find((item) => item.name === $route.name)?.icon"
              class="page-title-icon"
              v-if="menuItems.find((item) => item.name === $route.name)"
            ></i>
            <span class="page-title-text">{{ currentPageTitle }}</span>
          </div>
        </div>
        <div>
          <Button icon="pi pi-user" text rounded aria-label="Perfil" @click="(e) => op.toggle(e)" />
          <OverlayPanel ref="op">
            <ul class="user-dropdown-menu">
              <li>
                <a class="dropdown-item" href="#"><i class="pi pi-user me-2"></i>Perfil</a>
              </li>
              <li>
                <a class="dropdown-item" href="#"><i class="pi pi-cog me-2"></i>Configuración</a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout"
                  ><i class="pi pi-sign-out me-2"></i>Cerrar Sesión</a
                >
              </li>
            </ul>
          </OverlayPanel>
        </div>
      </header>

      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #c6ddf4;
}
.sidebar {
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  background: linear-gradient(360deg, var(--primary-color) 1%, #042ee7 150%);
  transition: all 0.3s ease;
  min-height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
  color: #fff;
}
.sidebar.collapsed {
  width: 70px;
  min-width: 70px;
  max-width: 70px;
  background: linear-gradient(360deg, var(--primary-color) 1%, #042ee7 150%);
}
.sidebar-brand {
  text-align: center;
}
.nav-link {
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition:
    background 0.2s,
    color 0.2s;
  font-weight: 500;
  text-decoration: none;
}
.nav-link.active,
.nav-link.router-link-exact-active {
  background: #43a047;
  color: #fff !important;
}
.nav-link:hover {
  background: #2196f3;
  color: #fff !important;
}
.top-header {
  background: #e3f2fd;
  border-bottom: 1px solid #bbdefb;
  min-height: 56px;
}
.user-dropdown-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: 170px;
}
.user-dropdown-menu li {
  margin: 0;
  padding: 0;
}
.user-dropdown-menu a.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #1976d2;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
  font-weight: 500;
}
.user-dropdown-menu a.dropdown-item:hover {
  background: #e3f2fd;
}
.user-dropdown-menu .dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}
.me-2 {
  margin-right: 0.5rem;
}

.page-title-container {
  background: #e3f2fd;
  border-radius: 12px;
  padding: 0.5rem 1.3rem 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  margin-left: 0.5rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  min-width: 220px;
  max-width: 100%;
  align-items: center;
}

.page-title-icon {
  font-size: 2rem !important;
  color: #1976d2;
  margin-right: 0.5rem;
}

.page-title-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1976d2;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(25, 118, 210, 0.07);
}
</style>

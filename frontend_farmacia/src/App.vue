<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

import Principal from './components/Principal.vue'
import LoginView from './views/LoginView.vue'

const route = useRoute()
</script>

<template>
  <RouterView />
</template>

<style></style>

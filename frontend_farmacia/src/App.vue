<script setup lang="ts">
import { useRoute } from 'vue-router'
import Principal from './components/Principal.vue'

const route = useRoute()
</script>

<template>
  <Principal v-if="route.name !== 'login'" />
  <router-view v-else />
</template>
<style scoped></style>

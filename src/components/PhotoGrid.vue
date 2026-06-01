<script setup lang="ts">
import type { Photo } from '../types/photo'
import PhotoCard from './PhotoCard.vue'

defineProps<{ photos: Photo[] }>()
const emit = defineEmits<{ (e: 'photo-click', photo: Photo): void }>()
</script>

<template>
  <div class="photo-grid grid gap-3 sm:gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px]">
    <PhotoCard
      v-for="photo in photos"
      :key="photo.id"
      :photo="photo"
      @click="emit('photo-click', photo)"
    />
  </div>
</template>

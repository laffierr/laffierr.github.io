<script setup lang="ts">
import type { Photo } from '../types/photo'
import PhotoCard from './PhotoCard.vue'

defineProps<{
  photos: Photo[]
}>()

const emit = defineEmits<{
  (e: 'photo-click', photo: Photo): void
}>()
</script>

<template>
  <div
    v-if="photos.length > 0"
    class="photo-grid grid gap-4 sm:gap-5 lg:gap-6"
    style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); grid-auto-rows: 240px;"
  >
    <PhotoCard
      v-for="photo in photos"
      :key="photo.id"
      :photo="photo"
      @click="emit('photo-click', photo)"
    />
  </div>

  <!-- Empty state -->
  <div
    v-else
    class="flex flex-col items-center justify-center py-24 text-center"
  >
    <svg
      class="w-16 h-16 text-gray-300 mb-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
    <p class="text-gray-400 text-sm font-medium">没有找到匹配的照片</p>
    <p class="text-gray-300 text-xs mt-1">试试换一个关键词或筛选条件</p>
  </div>
</template>

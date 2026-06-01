<script setup lang="ts">
import { ref } from 'vue'
import type { Photo } from '../types/photo'
import { CATEGORIES } from '../types/photo'

const props = defineProps<{ photo: Photo }>()
const emit = defineEmits<{ (e: 'click', photo: Photo): void }>()

const isLoaded = ref(false)
</script>

<template>
  <article
    class="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-100 transition-all duration-400 hover:shadow-2xl hover:shadow-black/15 hover:-translate-y-1"
    @click="emit('click', photo)"
  >
    <!-- Image -->
    <img
      :src="photo.thumbnail"
      :alt="photo.title"
      :width="photo.width"
      :height="photo.height"
      loading="lazy"
      class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
      :class="isLoaded ? 'img-loaded' : 'opacity-0'"
      @load="isLoaded = true"
    />

    <!-- Hover overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    <div
      class="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
    >
      <p class="text-sm font-semibold leading-snug">{{ photo.title }}</p>
      <p class="text-xs text-white/60 mt-0.5">{{ photo.location }}</p>
    </div>

    <!-- Category badge -->
    <span
      class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm"
    >
      {{ CATEGORIES[photo.category] }}
    </span>
  </article>
</template>

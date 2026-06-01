<script setup lang="ts">
import { ref } from 'vue'
import type { Photo } from '../types/photo'
import { CATEGORIES } from '../types/photo'

const props = defineProps<{ photo: Photo }>()
const emit = defineEmits<{ (e: 'click', photo: Photo): void }>()

const isLoaded = ref(false)
const isHovered = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}
</script>

<template>
  <article
    class="photo-card group relative cursor-pointer overflow-hidden rounded-2xl bg-white/60 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
    :class="{ 'col-span-2 row-span-2': photo.featured }"
    @click="emit('click', photo)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Skeleton -->
    <div
      v-if="!isLoaded"
      class="skeleton absolute inset-0 rounded-2xl"
    />

    <!-- Image -->
    <img
      :src="photo.thumbnail"
      :alt="photo.title"
      :width="photo.width"
      :height="photo.height"
      loading="lazy"
      class="photo-card-img w-full h-full object-cover transition-transform duration-700 ease-out"
      :class="[
        isLoaded ? 'img-reveal opacity-100' : 'opacity-0',
        isHovered ? 'scale-105' : 'scale-100',
      ]"
      @load="handleLoad"
    />

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />

    <!-- Info overlay (on hover) -->
    <div
      class="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
    >
      <h3 class="text-sm font-semibold leading-tight truncate">{{ photo.title }}</h3>
      <p class="text-xs text-white/70 mt-1 truncate">{{ photo.location }}</p>
    </div>

    <!-- Category tag -->
    <span
      class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm"
    >
      {{ CATEGORIES[photo.category] }}
    </span>
  </article>
</template>

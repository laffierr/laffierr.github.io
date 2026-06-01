<script setup lang="ts">
import { ref } from 'vue'
import type { Photo } from '../types/photo'

defineProps<{ photo: Photo }>()
const emit = defineEmits<{ (e: 'click', photo: Photo): void }>()

const isLoaded = ref(false)
</script>

<template>
  <article
    class="photo-card relative cursor-pointer overflow-hidden rounded-md bg-gray-100 animate-in"
    @click="emit('click', photo)"
  >
    <img
      :src="photo.src"
      :alt="photo.title"
      loading="lazy"
      class="w-full block"
      :class="isLoaded ? '' : 'opacity-0'"
      @load="isLoaded = true"
    />

    <!-- Hover overlay -->
    <div
      class="card-overlay absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-0 transition-opacity duration-300"
    >
      <div class="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div>
          <p class="text-white text-sm font-medium leading-snug">{{ photo.title }}</p>
          <p class="text-white/60 text-xs mt-0.5">{{ photo.location }}</p>
        </div>
        <button
          class="shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
          @click.stop="emit('click', photo)"
          title="下载"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Category } from '../types/photo'

defineProps<{
  activeCategory: Category | null
  categories: { key: Category; label: string }[]
}>()

const emit = defineEmits<{
  (e: 'select-category', category: Category | null): void
}>()
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 flex items-center justify-between h-14">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 shrink-0">
        <svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="4" fill="#111"/>
          <circle cx="9.5" cy="9.5" r="2" stroke="#fff" stroke-width="1.5"/>
          <path d="M27 21l-6-6-9 13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-lg font-bold text-black tracking-tight hidden sm:block">Frames</span>
      </a>

      <!-- Category links -->
      <nav class="flex items-center gap-1 overflow-x-auto">
        <button
          class="shrink-0 px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="activeCategory === null
            ? 'text-black font-medium'
            : 'text-gray-500 hover:text-black'"
          @click="emit('select-category', null)"
        >
          全部
        </button>
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="shrink-0 px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="activeCategory === cat.key
            ? 'text-black font-medium'
            : 'text-gray-500 hover:text-black'"
          @click="emit('select-category', cat.key)"
        >
          {{ cat.label }}
        </button>
      </nav>

      <!-- Right placeholder -->
      <div class="w-20 hidden sm:block" />
    </div>
  </header>
</template>

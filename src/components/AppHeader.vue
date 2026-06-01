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
  <header class="sticky top-0 z-40 glass border-b border-black/5">
    <div class="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2.5 select-none shrink-0">
          <div class="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <span class="text-base font-bold tracking-tight text-black">Frames</span>
        </a>

        <!-- Category pills -->
        <nav class="flex items-center gap-1 overflow-x-auto">
          <button
            class="shrink-0 px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer"
            :class="activeCategory === null
              ? 'bg-black text-white'
              : 'text-gray-500 hover:text-black hover:bg-gray-100'"
            @click="emit('select-category', null)"
          >
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="shrink-0 px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer"
            :class="activeCategory === cat.key
              ? 'bg-black text-white'
              : 'text-gray-500 hover:text-black hover:bg-gray-100'"
            @click="emit('select-category', cat.key)"
          >
            {{ cat.label }}
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

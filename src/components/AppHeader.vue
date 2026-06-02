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
  <header class="sticky top-0 z-40 bg-white border-b border-[#f1f1f1]">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center h-[62px] px-5">
      <!-- Logo (left) -->
      <a href="/" class="flex items-center gap-2 shrink-0 justify-self-start">
        <svg class="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#111"/>
          <circle cx="9" cy="9" r="2" stroke="#fff" stroke-width="1.5"/>
          <path d="M28 22l-7-7-10 14" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-lg font-bold text-black tracking-tight">Frames</span>
      </a>

      <!-- Nav (center, always perfectly centered) -->
      <nav class="flex items-center gap-1 justify-self-center">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap"
          :class="activeCategory === cat.key
            ? 'text-black bg-gray-100 font-medium'
            : 'text-[#767676] hover:text-black hover:bg-gray-50'"
          @click="emit('select-category', activeCategory === cat.key ? null : cat.key)"
        >
          {{ cat.label }}
        </button>
      </nav>

      <!-- Right placeholder (keeps grid balance on mobile too) -->
      <div class="justify-self-end" />
    </div>
  </header>
</template>

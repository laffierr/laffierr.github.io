<script setup lang="ts">
import type { Category } from '../types/photo'

const props = defineProps<{
  activeCategory: Category | null
  categories: { key: Category; label: string }[]
}>()

const emit = defineEmits<{
  (e: 'select-category', category: Category | null): void
}>()
</script>

<template>
  <header class="sticky top-0 z-40 glass border-b border-black/5">
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <!-- Top row: logo -->
      <div class="flex items-center justify-center py-4">
        <a href="/" class="flex items-center gap-2.5 select-none">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0071e3] to-[#40a9ff] flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight text-[#1d1d1f]">Frames</span>
        </a>
      </div>
    </div>

    <!-- Category pills -->
    <div class="border-t border-black/5">
      <div class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
          <button
            class="shrink-0 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
            :class="props.activeCategory === null
              ? 'pill-active bg-[#1d1d1f] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/60'"
            @click="emit('select-category', null)"
          >
            全部
          </button>
          <button
            v-for="cat in props.categories"
            :key="cat.key"
            class="shrink-0 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
            :class="props.activeCategory === cat.key
              ? 'pill-active bg-[#1d1d1f] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/60'"
            @click="emit('select-category', cat.key)"
          >
            {{ cat.label }}
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Hide scrollbar for category pills */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

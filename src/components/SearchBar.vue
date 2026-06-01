<script setup lang="ts">
import { ref } from 'vue'

const query = defineModel<string>({ required: true })
const isFocused = ref(false)
</script>

<template>
  <div
    class="search-wrapper relative flex items-center w-full max-w-xs transition-all duration-300"
    :class="isFocused ? 'scale-105' : ''"
  >
    <svg
      class="absolute left-3.5 w-4 h-4 pointer-events-none transition-colors duration-300"
      :class="isFocused ? 'text-[#0071e3]' : 'text-gray-400'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      v-model="query"
      type="text"
      placeholder="搜索照片..."
      class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-0 bg-white/60 backdrop-blur-md ring-1 ring-black/10 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:bg-white/90"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>

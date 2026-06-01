<script setup lang="ts">
const query = defineModel<string>({ required: true })
</script>

<template>
  <div class="relative w-full max-w-sm">
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      v-model="query"
      type="text"
      placeholder="搜索照片..."
      class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-gray-100 border-0 ring-0 placeholder:text-gray-400 focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-black/10 transition-all duration-200"
    />
  </div>
</template>

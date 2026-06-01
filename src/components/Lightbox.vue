<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import type { Photo } from '../types/photo'

const props = defineProps<{
  photos: Photo[]
  current: Photo | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'navigate', photo: Photo): void
}>()

const loaded = ref(false)
const idx = computed(() => props.current ? props.photos.findIndex(p => p.id === props.current!.id) : -1)

function prev() {
  if (props.photos.length <= 1) return
  loaded.value = false
  const i = idx.value <= 0 ? props.photos.length - 1 : idx.value - 1
  emit('navigate', props.photos[i])
}
function next() {
  if (props.photos.length <= 1) return
  loaded.value = false
  const i = idx.value >= props.photos.length - 1 ? 0 : idx.value + 1
  emit('navigate', props.photos[i])
}
function dl() { if (props.current) window.open(props.current.src, '_blank') }

watch(() => props.isOpen, v => { if (v) loaded.value = false })

const keys = useMagicKeys()
whenever(keys.escape, () => { if (props.isOpen) emit('close') })
whenever(keys.left, () => { if (props.isOpen) prev() })
whenever(keys.right, () => { if (props.isOpen) next() })
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog class="relative z-50" @close="emit('close')">
      <!-- Backdrop -->
      <TransitionChild as="template"
        enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/95" />
      </TransitionChild>

      <!-- Panel -->
      <TransitionChild as="template"
        enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
      >
        <DialogPanel class="fixed inset-0 flex flex-col">
          <!-- Top bar -->
          <div class="flex items-center justify-between h-[60px] px-4 shrink-0">
            <div class="text-white/60 text-sm font-medium">
              {{ idx + 1 }} / {{ photos.length }}
            </div>
            <button
              class="px-4 py-1.5 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
              @click="dl"
            >
              下载原图
            </button>
            <button
              class="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Image -->
          <div class="flex-1 flex items-center justify-center px-4 pb-4 relative min-h-0">
            <img
              v-if="current"
              :key="current.id"
              :src="current.src"
              :alt="current.title"
              class="max-w-full max-h-full object-contain rounded-sm"
              :class="loaded ? '' : 'opacity-0 absolute'"
              @load="loaded = true"
            />

            <!-- Arrows -->
            <template v-if="photos.length > 1">
              <button
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white hover:scale-105 transition-all"
                @click="prev"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white hover:scale-105 transition-all"
                @click="next"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </template>
          </div>

          <!-- Bottom info -->
          <div v-if="current" class="shrink-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-6 pt-10">
            <h2 class="text-white text-lg font-bold">{{ current.title }}</h2>
            <p class="text-white/50 text-sm mt-1">
              {{ current.location }}
              <template v-if="current.camera"> · {{ current.camera }}</template>
            </p>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

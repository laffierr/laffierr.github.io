<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import type { Photo } from '../types/photo'
import { CATEGORIES } from '../types/photo'

const props = defineProps<{
  photos: Photo[]
  current: Photo | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'navigate', photo: Photo): void
}>()

const imageLoaded = ref(false)
const showInfo = ref(true)

const currentIndex = computed(() =>
  props.current ? props.photos.findIndex((p) => p.id === props.current!.id) : -1,
)

const hasPrev = computed(() => props.photos.length > 1)

const prevPhoto = () => {
  if (!hasPrev.value) return
  const idx = currentIndex.value
  const newIdx = idx <= 0 ? props.photos.length - 1 : idx - 1
  imageLoaded.value = false
  emit('navigate', props.photos[newIdx])
}

const nextPhoto = () => {
  if (!hasPrev.value) return
  const idx = currentIndex.value
  const newIdx = idx >= props.photos.length - 1 ? 0 : idx + 1
  imageLoaded.value = false
  emit('navigate', props.photos[newIdx])
}

watch(() => props.isOpen, (open) => {
  if (open) imageLoaded.value = false
})

const handleDownload = () => {
  if (props.current?.src) window.open(props.current.src, '_blank')
}

// Keyboard
const keys = useMagicKeys()
whenever(keys.escape, () => { if (props.isOpen) emit('close') })
whenever(keys.left, () => { if (props.isOpen) prevPhoto() })
whenever(keys.right, () => { if (props.isOpen) nextPhoto() })
whenever(keys.i, () => { if (props.isOpen) showInfo.value = !showInfo.value })
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog class="relative z-50" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0"
      >
        <DialogBackdrop class="fixed inset-0 bg-black/95" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
      >
        <DialogPanel class="fixed inset-0 flex items-center justify-center">
          <!-- Close -->
          <button
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            @click="emit('close')"
            aria-label="关闭"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Info toggle -->
          <button
            class="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors text-xs font-semibold"
            @click="showInfo = !showInfo"
          >
            i
          </button>

          <!-- Image area -->
          <div class="flex w-full h-full max-w-[1600px] mx-auto">
            <div class="flex-1 flex items-center justify-center relative p-8 sm:p-12 lg:p-16">
              <img
                v-if="current"
                :key="current.id"
                :src="current.src"
                :alt="current.title"
                class="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
                :class="imageLoaded ? 'img-loaded' : 'opacity-0 absolute'"
                @load="imageLoaded = true"
                @dblclick="handleDownload"
              />

              <!-- Nav arrows -->
              <template v-if="hasPrev">
                <button
                  class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-110 transition-all"
                  @click.stop="prevPhoto"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button
                  class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-110 transition-all"
                  @click.stop="nextPhoto"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </template>

              <!-- Counter -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white/50 text-xs font-mono">
                {{ currentIndex + 1 }} / {{ photos.length }}
              </div>
            </div>

            <!-- Info sidebar -->
            <aside
              v-if="showInfo && current"
              class="hidden lg:flex w-80 shrink-0 flex-col bg-white/5 border-l border-white/10 text-white overflow-y-auto"
            >
              <div class="p-6">
                <h2 class="text-lg font-bold text-white">{{ current.title }}</h2>
                <p class="text-sm text-white/40 mt-1">{{ current.location }}</p>
                <p v-if="current.description" class="text-sm text-white/60 mt-4 leading-relaxed">{{ current.description }}</p>

                <div class="mt-6 space-y-2 text-sm">
                  <div v-if="current.camera" class="flex justify-between"><span class="text-white/40">相机</span><span class="text-white/70">{{ current.camera }}</span></div>
                  <div v-if="current.lens" class="flex justify-between"><span class="text-white/40">镜头</span><span class="text-white/70">{{ current.lens }}</span></div>
                  <div v-if="current.aperture" class="flex justify-between"><span class="text-white/40">光圈</span><span class="text-white/70 font-mono">{{ current.aperture }}</span></div>
                  <div v-if="current.shutter" class="flex justify-between"><span class="text-white/40">快门</span><span class="text-white/70 font-mono">{{ current.shutter }}</span></div>
                  <div v-if="current.iso" class="flex justify-between"><span class="text-white/40">ISO</span><span class="text-white/70 font-mono">{{ current.iso }}</span></div>
                </div>

                <span class="inline-block mt-4 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{{ CATEGORIES[current.category] }}</span>
              </div>
            </aside>
          </div>

          <!-- Mobile info -->
          <div v-if="showInfo && current" class="lg:hidden absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3">
            <h2 class="text-sm font-bold text-white truncate">{{ current.title }}</h2>
            <p class="text-xs text-white/40 mt-0.5">{{ current.location }} · {{ current.camera }}</p>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

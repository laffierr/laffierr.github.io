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

const imageLoaded = ref(false)

const currentIndex = computed(() =>
  props.current ? props.photos.findIndex(p => p.id === props.current!.id) : -1,
)

const hasPrev = computed(() => props.photos.length > 1)

function goPrev() {
  if (!hasPrev.value) return
  const idx = currentIndex.value
  imageLoaded.value = false
  emit('navigate', props.photos[idx <= 0 ? props.photos.length - 1 : idx - 1])
}

function goNext() {
  if (!hasPrev.value) return
  const idx = currentIndex.value
  imageLoaded.value = false
  emit('navigate', props.photos[idx >= props.photos.length - 1 ? 0 : idx + 1])
}

function download() {
  if (props.current?.src) window.open(props.current.src, '_blank')
}

watch(() => props.isOpen, v => { if (v) imageLoaded.value = false })

const keys = useMagicKeys()
whenever(keys.escape, () => { if (props.isOpen) emit('close') })
whenever(keys.left, () => { if (props.isOpen) goPrev() })
whenever(keys.right, () => { if (props.isOpen) goNext() })
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog class="relative z-50" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/95" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
      >
        <DialogPanel class="fixed inset-0 flex">
          <!-- Close -->
          <button
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Counter -->
          <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-sm text-white/50 font-medium">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </div>

          <!-- Download -->
          <button
            class="absolute top-4 right-20 z-10 px-4 py-2 flex items-center gap-2 rounded-md bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors text-sm"
            @click="download"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下载
          </button>

          <!-- Image -->
          <div class="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20">
            <img
              v-if="current"
              :key="current.id"
              :src="current.src"
              :alt="current.title"
              class="max-w-full max-h-[88vh] object-contain select-none"
              :class="imageLoaded ? 'animate-in' : 'opacity-0 absolute'"
              @load="imageLoaded = true"
            />
          </div>

          <!-- Nav arrows -->
          <template v-if="hasPrev">
            <button
              class="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white hover:scale-105 transition-all"
              @click="goPrev"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              class="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white hover:scale-105 transition-all"
              @click="goNext"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </template>

          <!-- Bottom info bar -->
          <div
            v-if="current"
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6"
          >
            <div class="max-w-[720px] mx-auto flex items-end justify-between">
              <div>
                <h2 class="text-white text-base sm:text-lg font-bold">{{ current.title }}</h2>
                <p class="text-white/50 text-sm mt-0.5">
                  {{ current.location }}
                  <template v-if="current.camera"> · {{ current.camera }}</template>
                </p>
              </div>
              <button
                class="shrink-0 ml-4 px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
                @click="download"
              >
                下载原图
              </button>
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

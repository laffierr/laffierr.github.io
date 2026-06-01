<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
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
const infoTab = ref<'info' | 'exif'>('info')

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

const handleDownload = () => {
  if (!props.current) return
  window.open(props.current.src, '_blank')
}

// 键盘快捷键
const keys = useMagicKeys()

watch(() => props.isOpen, (open) => {
  if (open) {
    imageLoaded.value = false
    nextTick(() => {
      // Focus trap handled by Headless UI Dialog
    })
  }
})

whenever(keys.escape, () => {
  if (props.isOpen) emit('close')
})

whenever(keys.left, () => {
  if (props.isOpen) prevPhoto()
})

whenever(keys.right, () => {
  if (props.isOpen) nextPhoto()
})

whenever(keys.i, () => {
  if (props.isOpen) showInfo.value = !showInfo.value
})

// EXIF 列表
const exifItems = computed(() => {
  const p = props.current
  if (!p) return []
  return [
    { label: '相机', value: p.camera },
    { label: '镜头', value: p.lens },
    { label: '光圈', value: p.aperture },
    { label: '快门', value: p.shutter },
    { label: 'ISO', value: p.iso },
    { label: '焦距', value: p.focalLength },
  ].filter((item) => item.value)
})
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog class="relative z-50" @close="emit('close')">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogBackdrop class="fixed inset-0 bg-black/92 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Panel -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-96"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-96"
      >
        <DialogPanel class="fixed inset-0 flex items-center justify-center">
          <!-- Close button (top right) -->
          <button
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors duration-200"
            @click="emit('close')"
            aria-label="关闭"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Info toggle button -->
          <button
            class="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors duration-200 text-xs font-bold"
            @click="showInfo = !showInfo"
            aria-label="切换信息面板"
          >
            i
          </button>

          <!-- Main content area -->
          <div class="flex w-full h-full max-w-[1600px] mx-auto">
            <!-- Image area -->
            <div
              class="flex-1 flex items-center justify-center relative min-w-0 p-8 sm:p-12 lg:p-16"
              :class="showInfo ? 'lg:pr-0' : ''"
            >
              <!-- Loading skeleton -->
              <div
                v-if="!imageLoaded"
                class="skeleton w-[80vw] max-w-4xl aspect-[3/2] rounded-xl"
              />

              <!-- Current image -->
              <img
                v-if="current"
                :key="current.id"
                :src="current.src"
                :alt="current.title"
                class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
                :class="imageLoaded ? 'img-reveal' : 'opacity-0 absolute'"
                @load="imageLoaded = true"
                @dblclick="handleDownload"
              />

              <!-- Prev / Next buttons -->
              <template v-if="hasPrev">
                <button
                  class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-110 transition-all duration-200"
                  @click.stop="prevPhoto"
                  aria-label="上一张"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-110 transition-all duration-200"
                  @click.stop="nextPhoto"
                  aria-label="下一张"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </template>

              <!-- Counter -->
              <div
                v-if="current && photos.length > 1"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-mono"
              >
                {{ currentIndex + 1 }} / {{ photos.length }}
              </div>
            </div>

            <!-- Info sidebar -->
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="translate-x-full opacity-0"
              enter-to="translate-x-0 opacity-100"
              leave="duration-200 ease-in"
              leave-from="translate-x-0 opacity-100"
              leave-to="translate-x-full opacity-0"
            >
              <aside
                v-if="showInfo && current"
                class="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col glass-dark border-l border-white/10 text-white/90 overflow-y-auto"
              >
                <!-- Photo title & location -->
                <div class="p-6 pb-4">
                  <h2 class="text-xl font-bold text-white">{{ current.title }}</h2>
                  <p class="text-sm text-white/50 mt-1">{{ current.location }}</p>
                  <p v-if="current.date" class="text-xs text-white/40 mt-0.5">{{ current.date }}</p>
                </div>

                <!-- Description -->
                <p
                  v-if="current.description"
                  class="px-6 pb-4 text-sm leading-relaxed text-white/70"
                >
                  {{ current.description }}
                </p>

                <!-- Tab switcher -->
                <div class="flex gap-0 px-6 border-b border-white/10">
                  <button
                    class="pb-3 text-xs font-medium uppercase tracking-wide transition-colors border-b-2 -mb-px"
                    :class="infoTab === 'info'
                      ? 'text-white border-white'
                      : 'text-white/40 border-transparent hover:text-white/70'"
                    @click="infoTab = 'info'"
                  >
                    信息
                  </button>
                  <button
                    class="ml-4 pb-3 text-xs font-medium uppercase tracking-wide transition-colors border-b-2 -mb-px"
                    :class="infoTab === 'exif'
                      ? 'text-white border-white'
                      : 'text-white/40 border-transparent hover:text-white/70'"
                    @click="infoTab = 'exif'"
                  >
                    参数
                  </button>
                </div>

                <!-- Tab content -->
                <div class="p-6">
                  <!-- Info tab -->
                  <div v-if="infoTab === 'info'" class="space-y-4">
                    <div class="flex items-center gap-2">
                      <span class="text-xs px-2 py-0.5 rounded-full bg-white/15 text-white/70">{{ CATEGORIES[current.category] }}</span>
                    </div>
                    <dl class="space-y-3 text-sm">
                      <div v-if="current.camera" class="flex justify-between">
                        <dt class="text-white/40">相机</dt>
                        <dd class="text-white/80">{{ current.camera }}</dd>
                      </div>
                      <div v-if="current.lens" class="flex justify-between">
                        <dt class="text-white/40">镜头</dt>
                        <dd class="text-white/80">{{ current.lens }}</dd>
                      </div>
                    </dl>
                  </div>

                  <!-- EXIF tab -->
                  <div v-if="infoTab === 'exif'">
                    <dl class="space-y-3 text-sm">
                      <div v-for="item in exifItems" :key="item.label" class="flex justify-between">
                        <dt class="text-white/40">{{ item.label }}</dt>
                        <dd class="text-white/80 font-mono">{{ item.value }}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <!-- Download button -->
                <div class="mt-auto p-6">
                  <button
                    class="w-full py-2.5 rounded-xl text-sm font-medium bg-white/15 hover:bg-white/25 text-white transition-colors duration-200 flex items-center justify-center gap-2"
                    @click="handleDownload"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    下载原图
                  </button>
                </div>
              </aside>
            </TransitionChild>
          </div>

          <!-- Mobile info bar (bottom sheet) -->
          <div
            v-if="showInfo && current"
            class="lg:hidden absolute bottom-0 left-0 right-0 glass-dark border-t border-white/10 px-4 py-4 max-h-[40vh] overflow-y-auto"
          >
            <h2 class="text-sm font-bold text-white truncate">{{ current.title }}</h2>
            <p class="text-xs text-white/50 mt-0.5">{{ current.location }}</p>
            <div class="flex items-center gap-3 mt-2 flex-wrap">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/60">{{ CATEGORIES[current.category] }}</span>
              <span v-if="current.camera" class="text-[10px] text-white/40">{{ current.camera }}</span>
              <span v-if="current.aperture" class="text-[10px] text-white/40 font-mono">{{ current.aperture }}</span>
              <span v-if="current.shutter" class="text-[10px] text-white/40 font-mono">{{ current.shutter }}</span>
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

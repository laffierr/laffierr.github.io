<script setup lang="ts">
import { useLightbox } from './composables/useLightbox'
import { usePhotos } from './composables/usePhotos'
import AppHeader from './components/AppHeader.vue'
import Lightbox from './components/Lightbox.vue'
import type { Photo } from './types/photo'

const lightbox = useLightbox()
const { photos, categories, activeCategory, searchQuery, setCategory } = usePhotos()

function openPhoto(p: Photo) { lightbox.open(p) }
function download(p: Photo) { window.open(p.src, '_blank') }
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader
      :active-category="activeCategory"
      :categories="categories"
      @select-category="setCategory"
    />

    <!-- Hero: centered search (Unsplash style) -->
    <div class="max-w-[1320px] mx-auto px-4 sm:px-5">
      <div class="flex flex-col items-center py-12 sm:py-20 md:py-28">
        <h1 class="text-[28px] sm:text-[36px] md:text-[44px] font-bold text-black tracking-tight">
          Frames
        </h1>
        <p class="mt-2 text-[15px] sm:text-[17px] text-[#767676] max-w-md text-center leading-relaxed">
          用镜头捕捉光的形状，每一帧都是不可复制的瞬间。
        </p>

        <!-- Search bar -->
        <div class="mt-6 w-full max-w-[620px] mx-auto">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#767676]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索高分辨率图片"
              class="w-full h-[54px] pl-12 pr-5 text-[15px] bg-[#f5f5f5] hover:bg-[#eee] border-0 rounded-lg text-black placeholder-[#767676] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d1d1d1] transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Active filter indicator -->
      <div v-if="activeCategory" class="flex items-center gap-2 pb-8">
        <span class="text-sm text-[#767676]">分类：</span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-[#f5f5f5] rounded-md">
          {{ categories.find(c => c.key === activeCategory)?.label }}
          <button class="text-[#767676] hover:text-black" @click="setCategory(null)">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </span>
      </div>

      <!-- Search results -->
      <div v-if="searchQuery" class="pb-8">
        <p class="text-[28px] font-bold text-black">{{ searchQuery }}</p>
        <p class="text-[15px] text-[#767676] mt-0.5">{{ photos.length }} 张照片</p>
      </div>
    </div>

    <!-- Masonry grid -->
    <div class="max-w-[1320px] mx-auto px-4 sm:px-5 pb-20">
      <div v-if="photos.length > 0" class="unsplash-grid">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="unsplash-item"
          @click="openPhoto(photo)"
        >
          <img :src="photo.src" :alt="photo.title" loading="lazy" />

          <!-- Hover overlay -->
          <div class="unsplash-overlay">
            <div class="flex flex-col">
              <span class="text-white text-[14px] font-medium leading-tight">{{ photo.title }}</span>
              <span class="text-white/65 text-[12px] mt-0.5">{{ photo.location }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="unsplash-btn" @click.stop="download(photo)" title="下载">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-24">
        <p class="text-[#767676] text-sm">没有找到匹配的照片</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-[#f1f1f1] py-6 text-center">
      <p class="text-xs text-[#aaa]">&copy; {{ new Date().getFullYear() }} Frames</p>
    </footer>

    <!-- Lightbox -->
    <Lightbox
      :photos="photos"
      :current="lightbox.currentPhoto.value"
      :is-open="lightbox.isOpen.value"
      @close="lightbox.close"
      @navigate="lightbox.navigateTo"
    />
  </div>
</template>

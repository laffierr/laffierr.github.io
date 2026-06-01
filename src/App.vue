<script setup lang="ts">
import { useLightbox } from './composables/useLightbox'
import { usePhotos } from './composables/usePhotos'
import AppHeader from './components/AppHeader.vue'
import Lightbox from './components/Lightbox.vue'
import type { Photo } from './types/photo'

const lightbox = useLightbox()
const { photos, categories, activeCategory, searchQuery, setCategory } = usePhotos()

const handlePhotoClick = (photo: Photo) => lightbox.open(photo)
const handleDownload = (photo: Photo) => { window.open(photo.src, '_blank') }
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader
      :active-category="activeCategory"
      :categories="categories"
      @select-category="setCategory"
    />

    <!-- Hero: Unsplash-style centered search -->
    <section
      v-if="!activeCategory && !searchQuery"
      class="py-16 sm:py-24 md:py-32 text-center px-4"
    >
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight leading-tight">
        Frames
      </h1>
      <p class="mt-3 text-lg sm:text-xl text-gray-500 max-w-lg mx-auto">
        每一帧都是时间的切片
      </p>
      <div class="mt-8 max-w-xl mx-auto">
        <div class="relative">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索照片..."
            class="w-full pl-12 pr-4 py-3.5 text-base rounded-md bg-gray-100 border-0 placeholder:text-gray-400 focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors"
          />
        </div>
      </div>
    </section>

    <!-- Category bar (only show when not on "all") -->
    <div
      v-if="activeCategory && !searchQuery"
      class="text-center py-8 px-4"
    >
      <p class="text-sm text-gray-400">
        <button class="hover:text-black transition-colors underline underline-offset-2" @click="setCategory(null)">全部</button>
        <span class="mx-1">/</span>
        <span class="text-black font-medium">{{ categories.find(c => c.key === activeCategory)?.label }}</span>
      </p>
    </div>

    <!-- Search result notice -->
    <div
      v-if="searchQuery"
      class="text-center py-8 px-4"
    >
      <p class="text-sm text-gray-500">
        搜索 "<span class="text-black font-medium">{{ searchQuery }}</span>" —
        <span class="font-medium">{{ photos.length }}</span> 张照片
      </p>
    </div>

    <!-- Masonry grid -->
    <div class="mx-auto max-w-[1320px] px-4 sm:px-6 pb-16">
      <div v-if="photos.length > 0" class="masonry">
        <article
          v-for="photo in photos"
          :key="photo.id"
          class="photo-card relative cursor-pointer overflow-hidden rounded-md bg-gray-100 animate-in"
          @click="handlePhotoClick(photo)"
        >
          <img
            :src="photo.src"
            :alt="photo.title"
            loading="lazy"
            class="w-full block"
          />
          <div
            class="card-overlay absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-0 transition-opacity duration-300"
          >
            <div class="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div>
                <p class="text-white text-sm font-medium leading-snug">{{ photo.title }}</p>
                <p class="text-white/60 text-xs mt-0.5">{{ photo.location }}</p>
              </div>
              <button
                class="shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
                @click.stop="handleDownload(photo)"
                title="下载原图"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="text-center py-24">
        <p class="text-gray-400 text-sm">没有找到匹配的照片</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-gray-100 py-10 text-center">
      <p class="text-xs text-gray-400">&copy; {{ new Date().getFullYear() }} Frames · 用镜头记录世界</p>
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

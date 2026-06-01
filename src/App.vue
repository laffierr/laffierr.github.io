<script setup lang="ts">
import { useLightbox } from './composables/useLightbox'
import { usePhotos } from './composables/usePhotos'
import AppHeader from './components/AppHeader.vue'
import SearchBar from './components/SearchBar.vue'
import PhotoGrid from './components/PhotoGrid.vue'
import Lightbox from './components/Lightbox.vue'
import type { Photo } from './types/photo'

const lightbox = useLightbox()
const {
  photos,
  featuredPhotos,
  categories,
  activeCategory,
  searchQuery,
  setCategory,
} = usePhotos()

const handlePhotoClick = (photo: Photo) => lightbox.open(photo)
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader
      :active-category="activeCategory"
      :categories="categories"
      @select-category="setCategory"
    />

    <main class="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <!-- Hero section -->
      <section
        v-if="featuredPhotos.length > 0 && !activeCategory && !searchQuery"
        class="py-10 sm:py-14 lg:py-20"
      >
        <div class="mb-8 sm:mb-12">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Featured</p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-none">
            光影之间
          </h1>
          <p class="text-base sm:text-lg text-gray-400 mt-3 max-w-lg">
            每一帧都是时间的切片，记录旅途中的光与影。
          </p>
        </div>

        <!-- Featured grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="(photo, i) in featuredPhotos"
            :key="photo.id"
            class="featured-item group relative cursor-pointer overflow-hidden rounded-xl bg-gray-100 transition-all duration-400 hover:shadow-2xl hover:shadow-black/15"
            :class="i === 0 ? 'col-span-2 row-span-2' : ''"
            style="min-height: 200px"
            @click="handlePhotoClick(photo)"
          >
            <img
              :src="photo.src"
              :alt="photo.title"
              class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              style="min-height: 200px"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5" :class="i === 0 ? 'sm:p-6' : ''">
              <h2 class="text-white font-bold tracking-tight" :class="i === 0 ? 'text-lg sm:text-xl' : 'text-sm'">
                {{ photo.title }}
              </h2>
              <p class="text-white/60 text-xs mt-1">{{ photo.location }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery section -->
      <section class="py-8 sm:py-10 lg:py-14 border-t border-gray-100">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold tracking-tight text-black">全部照片</h2>
            <span class="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
              {{ photos.length }}
            </span>
          </div>
          <SearchBar v-model="searchQuery" />
        </div>

        <!-- Grid -->
        <PhotoGrid :photos="photos" @photo-click="handlePhotoClick" />

        <!-- Empty -->
        <div
          v-if="photos.length === 0"
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <p class="text-gray-400 text-sm font-medium">没有找到匹配的照片</p>
          <p class="text-gray-300 text-xs mt-1">试试换一个关键词或筛选条件</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-100 py-10 text-center mt-10">
      <p class="text-xs text-gray-400">&copy; {{ new Date().getFullYear() }} Frames &middot; 用镜头记录世界</p>
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

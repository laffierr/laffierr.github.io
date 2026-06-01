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

const handlePhotoClick = (photo: Photo) => {
  lightbox.open(photo)
}

const handleLightboxNavigate = (photo: Photo) => {
  lightbox.navigateTo(photo)
}

const handleLightboxClose = () => {
  lightbox.close()
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f7]">
    <!-- Header with glass effect -->
    <AppHeader
      :active-category="activeCategory"
      :categories="categories"
      @select-category="setCategory"
    />

    <!-- Main content -->
    <main class="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <!-- Featured section -->
      <section
        v-if="featuredPhotos.length > 0 && !activeCategory && !searchQuery"
        class="mb-12 sm:mb-16"
      >
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-[#0071e3] mb-1">
              精选
            </p>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
              近期佳作
            </h2>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <div
            v-for="photo in featuredPhotos"
            :key="photo.id"
            class="featured-card group relative cursor-pointer overflow-hidden rounded-2xl bg-white/60 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
            :class="featuredPhotos.indexOf(photo) === 0 ? 'sm:col-span-2 sm:row-span-2' : ''"
            style="min-height: 280px"
            @click="handlePhotoClick(photo)"
          >
            <img
              :src="photo.src"
              :alt="photo.title"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style="min-height: 280px"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3 class="text-lg sm:text-xl font-bold text-white tracking-tight">
                {{ photo.title }}
              </h3>
              <p class="text-sm text-white/70 mt-1">
                {{ photo.location }}
              </p>
              <p class="text-xs text-white/50 mt-1 line-clamp-2 max-w-md">
                {{ photo.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Toolbar: search + count -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
      >
        <SearchBar v-model="searchQuery" />
        <p class="text-xs text-gray-400 font-medium shrink-0">
          <template v-if="searchQuery || activeCategory">
            找到 <span class="text-gray-600 font-semibold">{{ photos.length }}</span> 张照片
          </template>
          <template v-else>
            共 <span class="text-gray-600 font-semibold">{{ photos.length }}</span> 张照片
          </template>
        </p>
      </div>

      <!-- Photo grid -->
      <PhotoGrid :photos="photos" @photo-click="handlePhotoClick" />
    </main>

    <!-- Footer -->
    <footer class="border-t border-black/5 py-8 text-center">
      <p class="text-xs text-gray-400">
        &copy; {{ new Date().getFullYear() }} Frames &middot; 用镜头记录世界
      </p>
    </footer>

    <!-- Lightbox -->
    <Lightbox
      :photos="photos"
      :current="lightbox.currentPhoto.value"
      :is-open="lightbox.isOpen.value"
      @close="handleLightboxClose"
      @navigate="handleLightboxNavigate"
    />
  </div>
</template>

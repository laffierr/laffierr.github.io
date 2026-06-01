import { ref, computed } from 'vue'
import type { Photo } from '../types/photo'

const currentPhoto = ref<Photo | null>(null)
const isOpen = ref(false)

export function useLightbox() {
  const open = (photo: Photo) => {
    currentPhoto.value = photo
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    isOpen.value = false
    document.body.style.overflow = ''
    // 等动画播完再清空图片，避免闪烁
    setTimeout(() => {
      currentPhoto.value = null
    }, 300)
  }

  const navigateTo = (photo: Photo | null) => {
    if (photo) {
      currentPhoto.value = photo
    }
  }

  return {
    currentPhoto: computed(() => currentPhoto.value),
    isOpen: computed(() => isOpen.value),
    open,
    close,
    navigateTo,
  }
}

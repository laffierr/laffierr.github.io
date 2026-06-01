import { ref, computed } from 'vue'
import type { Photo, Category } from '../types/photo'
import { CATEGORIES } from '../types/photo'
import { photos as allPhotos } from '../data/photos'

const searchQuery = ref('')
const activeCategory = ref<Category | null>(null)
const sortBy = ref<'date' | 'title'>('date')

export function usePhotos() {
  const categories = computed(() =>
    Object.entries(CATEGORIES).map(([key, label]) => ({
      key: key as Category,
      label,
    })),
  )

  const filteredPhotos = computed<Photo[]>(() => {
    let result = [...allPhotos]

    if (activeCategory.value) {
      result = result.filter((p) => p.category === activeCategory.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          CATEGORIES[p.category].includes(q),
      )
    }

    result.sort((a, b) => {
      if (sortBy.value === 'date') {
        return (b.date || '').localeCompare(a.date || '')
      }
      return (a.title || '').localeCompare(b.title || '')
    })

    return result
  })

  const featuredPhotos = computed(() =>
    allPhotos.filter((p) => p.featured),
  )

  const setCategory = (category: Category | null) => {
    activeCategory.value = category
  }

  const setSearch = (query: string) => {
    searchQuery.value = query
  }

  return {
    photos: filteredPhotos,
    featuredPhotos,
    categories,
    activeCategory: computed(() => activeCategory.value),
    searchQuery,       // 直接返回 writable ref，供 SearchBar v-model
    setCategory,
    setSearch,
  }
}

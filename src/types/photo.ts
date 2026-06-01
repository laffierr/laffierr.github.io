export interface Photo {
  id: string
  src: string
  thumbnail: string
  title: string
  category: Category
  camera?: string
  lens?: string
  aperture?: string
  shutter?: string
  iso?: string
  focalLength?: string
  location?: string
  date?: string
  description?: string
  width: number
  height: number
  featured?: boolean
}

export type Category = 'landscape' | 'portrait' | 'street' | 'nature' | 'architecture'

export const CATEGORIES: Record<Category, string> = {
  landscape: '风光',
  portrait: '人像',
  street: '街拍',
  nature: '自然',
  architecture: '建筑',
}

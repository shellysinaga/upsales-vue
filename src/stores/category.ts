import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type Category from '@/types/category'

export const useCategoryStore = defineStore('category', () => {
  const API_URL = import.meta.env.VITE_API_URL as string

  const categories = ref<Category[]>([])

  async function fetchCategories() {
    try {
      const { data } = await axios.get(`${API_URL}/category?limit=1000`)
      categories.value = data.result.data
    } catch (error) {
      console.error(error)
      categories.value = []
    }
  }

  return { categories, fetchCategories }
})

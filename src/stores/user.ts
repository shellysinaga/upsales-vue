import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type User from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const API_URL = import.meta.env.VITE_API_URL as string

  const user = ref<User>({})

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: 'Bearer ' +  localStorage.getItem('access_token'),
        },
      })
      user.value = data
    } catch (error) {
      console.error(error)
      user.value = {}
    }
  }

  const isLoggedIn = computed(() => {
    return localStorage.getItem('access_token') !== null
  })

  return { user, fetchUser, isLoggedIn }
})

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  import HomeNavbar from '@/components/Layout/HomeNavbar.vue'
  import SignUpHeader from '@/components/Layout/SignUpHeader.vue'

  import { useUserStore } from '@/stores/user'
  import { useCategoryStore } from '@/stores/category'

  import type Register from '@/types/register'

  const API_URL = import.meta.env.VITE_API_URL as string

  const userStore = useUserStore()
  const categoryStore = useCategoryStore()

  const router = useRouter()

  onMounted(() => {
    if (userStore.isLoggedIn) {
      router.push({ name: 'dashboard'})
    }
    if (categoryStore.categories.length === 0) categoryStore.fetchCategories()
  })

  const form = ref<Register>({
    name: '',
    email: '',
    password: '',
    category_id: null,
  })

  async function register(): Promise<void> {
    try {
      const { data } = await axios.post(`${API_URL}/register`, form.value)
      localStorage.setItem('access_token', data.result.access_token)
      userStore.fetchUser()
      router.push({ name: 'add-product' })
    } catch (error) {
      console.error(error)
    }
  }
</script>

<template>
  <main>
    <section class="relative pb-[50px] bg-dark min-h-screen">
      <HomeNavbar />

      <div class="container mt-[60px] relative z-10">
        <div class="grid items-center justify-between gap-8 md:grid-cols-2">
          <SignUpHeader />

          <form @submit.prevent="register" method="POST" action="" class="bg-white rounded-[30px] p-6 md:max-w-[435px] mx-auto w-full flex flex-col shadow-sm">
            <p class="text-dark font-bold text-[26px] mb-5">Sign Up</p>

            <div class="flex flex-col gap-[18px]">
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Company name
                </label>
                <input type="text" name="name" placeholder="Write your company name"
                  class="px-5 py-4 text-base bg-transparent border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark"
                  v-model="form.name"
                  required>
              </div>
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Email address
                </label>
                <!-- Error state class: !border-danger !text-danger -->
                <input type="email" name="email" placeholder="Write your email"
                  class="bg-transparent px-5 py-4 text-base border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark placeholder:font-normal font-medium"
                  v-model="form.email"
                  required>
              </div>
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Password
                </label>
                <input type="password" name="password" placeholder="Secure your strong password"
                  class="px-5 py-4 text-base bg-transparent border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark"
                  v-model="form.password"
                  required>
              </div>
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Category
                </label>
                <select name="category"
                  class="bg-transparent px-5 py-4 text-base border-2 rounded-full outline-none appearance-none border-borderLight focus:border-primary placeholder:text-placeholderText bg-[url('@/assets/svg/ic-chevron-down.svg')] bg-[calc(100%-20px)_center] bg-no-repeat invalid:required:text-placeholderText"
                  v-model="form.category_id"
                  required>
                  <option value="" selected hidden disabled>
                    Select company category
                  </option>
                  <option
                    v-for="category in categoryStore.categories" 
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <button type="submit" :to="{ name: 'add-product' }" class="btn-primary mt-[30px]">
                Continue Create Account
            </button>
          </form>
        </div>
      </div>
      
      <img src="@/assets/svg/half-circular-ornament.svg" class="absolute bottom-0 z-0" alt="">
    <div class="right-triangle"></div>
  </section>
</main></template>
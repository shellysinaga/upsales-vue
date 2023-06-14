<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import HomeNavbar from '@/components/Layout/HomeNavbar.vue'
import SignUpHeader from '@/components/Layout/SignUpHeader.vue'

import { useUserStore } from '@/stores/user'
import { useCategoryStore } from '@/stores/category'

import type Product from '@/types/product'

const API_URL = import.meta.env.VITE_API_URL as string

const userStore = useUserStore()
const categoryStore = useCategoryStore()

const router = useRouter()

onMounted(() => {
  if (!userStore.isLoggedIn) {
      router.push({ name: 'signin'})
    }
  if (categoryStore.categories.length === 0) categoryStore.fetchCategories()
})

const form = ref<Product>({
  name: '',
  sku: '',
  quantity: null,
  price: null,
  category_id: null,
})

async function addProduct(): Promise<void> {
  try {
    const { data } = await axios.post(`${API_URL}/product`, form.value, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
    router.push({ name: 'add-product-photo', params: { id: data.result?.id } })
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

          <form @submit.prevent="addProduct" action="" method="POST" class="bg-white rounded-[30px] p-6 md:max-w-[435px] mx-auto w-full flex flex-col shadow-sm">
            <p class="text-dark font-bold text-[26px] mb-5">Add First Product</p>

            <div class="flex flex-col gap-[18px]">
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Product name
                </label>
                <input v-model="form.name" type="text" name="name" placeholder="Write your product name"
                  class="px-5 py-4 text-base bg-transparent border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark">
              </div>
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Product SKU
                </label>
                <input v-model="form.sku" type="text" name="sku" placeholder="Write your product sku"
                  class="px-5 py-4 text-base font-medium bg-transparent border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark placeholder:font-normal">
              </div>
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Quantity
                </label>
                <input v-model="form.quantity" type="number" name="quantity" placeholder="Write your product quantity"
                  class="px-5 py-4 text-base bg-transparent border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark">
              </div>
              <!-- form group -->
              <div class="flex flex-col gap-2">
                <label for="" class="text-base font-medium text-dark">
                  Price
                </label>
                <input v-model="form.price" type="number" name="price" placeholder="Insert your product price"
                  class="px-5 py-4 text-base bg-transparent border-2 rounded-full outline-none border-borderLight focus:border-primary placeholder:text-placeholderText text-dark">
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
            <button type="submit" class="btn-primary mt-[30px]">
              Save Product
            </button>
          </form>
        </div>
      </div>

      <img src="@/assets/svg/half-circular-ornament.svg" class="absolute bottom-0 z-0" alt="">
      <div class="right-triangle"></div>
    </section>
  </main>
</template>
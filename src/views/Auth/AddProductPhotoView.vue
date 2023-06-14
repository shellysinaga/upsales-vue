<script setup lang="ts">
import HomeNavbar from '@/components/Layout/HomeNavbar.vue'
import SignUpHeader from '@/components/Layout/SignUpHeader.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

import type Product from '@/types/product'

import { useUserStore } from '@/stores/user'

const API_URL = import.meta.env.VITE_API_URL as string

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

const product = ref<Product>({
  name: '',
  sku: '',
  quantity: null,
  price: null,
  category_id: null,
  category: null,
})

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'signin'})
  }
  fetchProduct()
})

async function fetchProduct(): Promise<void> {
  try {
    const { data } = await axios.get(`${API_URL}/product`, {
      params: { id: route.params.id },
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
    product.value = data?.result
  } catch (error) {
    console.error(error)
  }
}

const photos = ref<string[]>([])
const isPhotoUploading = ref<boolean>(false)

function uploadPhotos(e: any) {
  let files = e.target.files

  if (photos.value.length + files.length > 7) {
    alert('A product can only contain 7 photos')
    return false
  }

  for (let i = 0; i < files.length; i++) {
    photos.value.push(URL.createObjectURL(files[i]))
  }
}

async function updateProduct(): Promise<void> {
  isPhotoUploading.value = true

  try {
    await Promise.all(
      photos.value.map(async (photo) => {
        const blob = await fetch(photo).then((p) => p.blob())
        const formData = new FormData()

        formData.append('product_id', route.params.id as string)
        formData.append('photo', blob)

        try {
          await axios.post(`${API_URL}/product/photo`, formData, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            },
          })
          
        } catch (error) {
          console.error(error)
        }
      })
    )
    alert('Photos uploaded successfully')
  } catch (error) {
    console.error(error)
  } finally {
    isPhotoUploading.value = false
    router.replace({ name: 'dashboard' })
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

          <form
            @submit.prevent="updateProduct"
            method="POST"
            action=""
            class="bg-white rounded-[30px] p-6 md:max-w-[435px] min-h-[550px] w-full mx-auto flex flex-col shadow-sm"
            id="formProduct">
            <p class="text-dark font-bold text-[26px] mb-5">Add Photos</p>
            <!-- Product name & category -->
            <div class="flex items-center w-full gap-3">
              <img src="@/assets/svg/default-image.svg" class="w-[60px] h-[60px]" alt="">
              <div class="text-dark">
                <h3 class="text-base font-semibold">
                  {{ product.name }}
                </h3>
                <p class="mt-1 text-xs font-normal">
                  {{ product.category?.name }}
                </p>
              </div>
            </div>

            <!-- Product photos -->
            <div class="grid grid-cols-2 gap-5 mt-5 mb-20 lg:justify-between md:grid-cols-3">
              <input type="file" name="photo" multiple id="photo" class="hidden" value="" accept="image/x-png,image/jpg,image/jpeg"
                ref="file" @change="uploadPhotos($event)">
              <button type="button" @click.prevent="($refs.file as HTMLInputElement).click()" class="w-max h-max">
                <img src="@/assets/svg/add-image.svg" class="w-[100px] h-[100px] object-cover rounded-[18px]" alt="">
              </button>

              <!-- Photos template -->
              <template v-for="( photo, index ) in  photos " :key="index">
                <img :src="photo" class="w-[100px] h-[100px] object-cover rounded-[18px]" alt="">
              </template>

              <!-- Shown when photos is not empty -->
              <img src="@/assets/svg/no-photo.svg" v-if=" !photos.length"
                class="w-[100px] h-[100px] object-cover rounded-[18px]" alt="">
            </div>

            <button class="mt-auto btn-primary" :disabled="isPhotoUploading" :class="{'opacity-70': isPhotoUploading}">
              <span v-if="!isPhotoUploading">Update Product</span>
              <span v-else>Uploading...</span>
            </button>
          </form>
        </div>
      </div>

      <img src="@/assets/svg/half-circular-ornament.svg" class="absolute bottom-0 z-0" alt="">
      <div class="right-triangle"></div>
    </section>
  </main>
</template>
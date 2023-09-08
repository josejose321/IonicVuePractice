<template>
  <ion-card>
    <div v-if="isLoading">
      <ion-list>
        <ion-list-header>
          <ion-skeleton-text
            :animated="true"
            style="width: 80px"
          ></ion-skeleton-text>
        </ion-list-header>
        <ion-item>
          <ion-thumbnail slot="start">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-thumbnail>
          <ion-label>
            <h3>
              <ion-skeleton-text
                :animated="true"
                style="width: 80%"
              ></ion-skeleton-text>
            </h3>
            <p>
              <ion-skeleton-text
                :animated="true"
                style="width: 60%"
              ></ion-skeleton-text>
            </p>
            <p>
              <ion-skeleton-text
                :animated="true"
                style="width: 30%"
              ></ion-skeleton-text>
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
    </div>
    <div v-else>
      <img
        :alt="pokemonData.name"
        height="200"
        :src="pokemonData.sprites?.front_default"
      />
      <ion-card-header>
        <ion-card-title>{{ pokemonData.name ?? '' }}</ion-card-title>
        <ion-card-subtitle>{{ `${pokemonData.name ?? ''} Details` }}</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <ion-button color="primary">
            Preview
        </ion-button>
      </ion-card-content>
    </div>
  </ion-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props: any = defineProps({
  url: String
})

// Declare reactive variables using ref
const isLoading = ref(false)
const pokemonData: any = ref({})

// Define the fetchPokemonData method
const fetchPokemonData = async () => {
  isLoading.value = true
  try {
    const res = await fetch(props.url)
    pokemonData.value = await res.json()
  } catch (e: any) {
    console.error(e.message)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }
}

// Call fetchPokemonData when the component is mounted
onMounted(() => {
  setTimeout(() => {
    fetchPokemonData()
  }, 500)
})
</script>

<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="d-flex align-items-center">
          <ion-icon :icon="star" class="mr-2"></ion-icon>
          <span>Pokémon</span>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Pokémon</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Pokémon List -->
      <ion-grid class="ion-padding">
        <ion-row class="justify-content-center" v-if="!pokemonStore.isLoading">
          <ion-col size="12" size-md="6" size-lg="4" v-for="pokemon in pokemonStore.pokemons?.results" :key="pokemon.url">
            <PokemonCard :url="pokemon.url" />
          </ion-col>
        </ion-row>

        <!-- Pagination Buttons -->
        <ion-row class="justify-content-center mt-4" v-if="!pokemonStore.isLoading">
          <ion-button color="medium" :disabled="!pokemonStore.pokemons.previous" @click="handleFetchPokemon(pokemonStore.pokemons.previous)">
            ← Previous
          </ion-button>
          <ion-button color="primary" :disabled="!pokemonStore.pokemons.next" @click="handleFetchPokemon(pokemonStore.pokemons.next)">
            Next →
          </ion-button>
        </ion-row>

        <!-- Loading Spinner -->
        <ion-row class="justify-content-center mt-5" v-else>
          <ion-spinner name="dots"></ion-spinner>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/PokemonCard.vue'
import usePokemonStore from '@/store/pokemonStore'
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import { star } from 'ionicons/icons'
import { onMounted } from 'vue'

const pokemonStore: any = usePokemonStore()

const handleFetchPokemon = async (URL = 'https://pokeapi.co/api/v2/pokemon') => {
  await pokemonStore.fetchPokemon(URL)
}

onMounted(async () => {
  await handleFetchPokemon()
})
</script>

<style scoped>
/* Style improvements */
ion-title {
  display: flex;
  align-items: center;
}

ion-icon {
  font-size: 1.5rem;
  margin-right: 8px;
}

/* Ensure buttons are spaced properly */
ion-button {
  margin: 0 8px;
}
</style>

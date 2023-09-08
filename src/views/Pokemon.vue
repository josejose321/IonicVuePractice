<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="star"></ion-icon> <ion-label>Pokemon</ion-label>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large"> Pokemon </ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container">
        <div class="row" v-if="!pokemonStore.isLoading">
          <template
            v-for="pokemon in pokemonStore.pokemons?.results"
            :key="pokemon.url"
          >
            <PokemonCard :url="pokemon?.url" />
          </template>

          <div class="row" v-show="!pokemonStore.isLoading">
            <ion-button
              color="primary"
              prepend-icon="mdi-skip-previous"
              :disabled="pokemonStore.pokemons.previous == null"
              @click="handleFetchPokemon(pokemonStore.pokemons.previous)"
            >
              Previous
            </ion-button>
            <ion-button
              color="primary"
              prepend-icon="mdi-skip-next"
              :disabled="pokemonStore.pokemons.next == null"
              @click="handleFetchPokemon(pokemonStore.pokemons.next)"
            >
              Next
            </ion-button>
          </div>
        </div>
        <div class="row" v-else>
          <ion-spinner></ion-spinner>
        </div>
      </div>

      <!-- <ExploreContainer name="Pokemon page" /> -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/PokemonCard.vue'
import usePokemonStore from '@/store/pokemonStore'
import {
IonContent,
IonHeader,
IonLabel,
IonPage,
IonSpinner,
IonTitle,
IonToolbar
} from '@ionic/vue'
import { star } from 'ionicons/icons'
import { onMounted } from 'vue'

const pokemonStore: any = usePokemonStore()

const handleFetchPokemon = async (
  URL = 'https://pokeapi.co/api/v2/pokemon'
) => {
  await pokemonStore.fetchPokemon(URL)
}

// Use an async function within onMounted
onMounted(async () => {
  await handleFetchPokemon()
})
</script>

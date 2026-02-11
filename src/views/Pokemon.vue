<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Pokémon</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Pokémon</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="ion-padding">
        <!-- Loading Spinner -->
        <ion-row
          class="ion-justify-content-center ion-margin-top"
          v-if="pokemonStore.isLoading"
        >
          <ion-spinner name="dots"></ion-spinner>
        </ion-row>

        <!-- Pokémon List -->
        <ion-row class="ion-justify-content-center" v-else>
          <ion-col
            size="12"
            size-md="6"
            size-lg="4"
            v-for="pokemon in pokemonStore.pokemons?.results"
            :key="pokemon?.url || ''"
          >
            <PokemonCard :url="pokemon?.url || ''" />
          </ion-col>
        </ion-row>

        <!-- Pagination -->
        <ion-row
          class="ion-justify-content-center ion-margin-top"
          v-if="!pokemonStore.isLoading"
        >
          <ion-col size="auto">
            <ion-button
              color="medium"
              :disabled="!pokemonStore.pokemons?.previous"
              @click="handleFetchPokemon(pokemonStore.pokemons?.previous || '')"
            >
              ← Previous
            </ion-button>
          </ion-col>
          <ion-col size="auto">
            <ion-button
              color="primary"
              :disabled="!pokemonStore.pokemons?.next"
              @click="handleFetchPokemon(pokemonStore.pokemons?.next || '')"
            >
              Next →
            </ion-button>
          </ion-col>
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
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import { onMounted } from 'vue'

const pokemonStore: any = usePokemonStore()

const handleFetchPokemon = async (
  url = 'https://pokeapi.co/api/v2/pokemon'
) => {
  await pokemonStore.fetchPokemon(url)
}

onMounted(() => handleFetchPokemon())
</script>

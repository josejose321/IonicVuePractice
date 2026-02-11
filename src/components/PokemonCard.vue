<template>
  <ion-card class="pokemon-card">
    <!-- Loading Skeleton -->
    <div v-if="isLoading">
      <ion-list>
        <ion-list-header>
          <ion-skeleton-text animated style="width: 80px"></ion-skeleton-text>
        </ion-list-header>
        <ion-item>
          <ion-thumbnail slot="start">
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-thumbnail>
          <ion-label>
            <h3><ion-skeleton-text animated style="width: 80%"></ion-skeleton-text></h3>
            <p><ion-skeleton-text animated style="width: 60%"></ion-skeleton-text></p>
            <p><ion-skeleton-text animated style="width: 30%"></ion-skeleton-text></p>
          </ion-label>
        </ion-item>
      </ion-list>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage">
      <ion-card-content class="error-message">
        <p>{{ errorMessage }}</p>
      </ion-card-content>
    </div>

    <!-- Card Content -->
    <div v-else class="pokemon-content">
      <img :alt="pokemonData.name" class="pokemon-img" :src="pokemonData.sprites?.front_default" />
      <ion-card-header>
        <ion-card-title class="pokemon-name">
          {{ pokemonData.name ? capitalize(pokemonData.name) : 'Unknown' }}
        </ion-card-title>
        <ion-card-subtitle>Type: {{ pokemonTypes }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content class="card-actions">
        <ion-button color="primary" expand="block" @click="openPreview">Preview</ion-button>
      </ion-card-content>
    </div>

    <!-- Details Modal -->
    <ion-modal :is-open="isModalOpen" @did-dismiss="isModalOpen = false">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>{{ capitalize(pokemonData.name ?? '') }} Details</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closePreview">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="modal-body">
          <img
            :alt="pokemonData.name"
            class="pokemon-img-large"
            :src="
              pokemonData.sprites?.other?.official_artwork?.front_default ||
              pokemonData.sprites?.front_default
            "
          />
          <h2>{{ capitalize(pokemonData.name ?? '') }}</h2>
          <p><strong>Type:</strong> {{ pokemonTypes }}</p>
          <p><strong>Height:</strong> {{ (pokemonData.height ?? 0) / 10 }} m</p>
          <p><strong>Weight:</strong> {{ (pokemonData.weight ?? 0) / 10 }} kg</p>
          <p><strong>Abilities:</strong> {{ pokemonAbilities }}</p>
        </div>
      </ion-content>
    </ion-modal>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { computed, onMounted, ref } from 'vue'

interface Pokemon {
  name?: string
  height?: number
  weight?: number
  sprites?: {
    front_default?: string
    other?: { official_artwork?: { front_default?: string } }
  }
  types?: { type: { name: string } }[]
  abilities?: { ability: { name: string } }[]
}

const props = defineProps<{ url: string }>()

const isLoading = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const pokemonData = ref<Pokemon>({})

const fetchPokemonData = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const res = await fetch(props.url)
    if (!res.ok) throw new Error('Failed to fetch Pokémon data')
    pokemonData.value = await res.json()
  } catch (error) {
    errorMessage.value = (error as Error).message
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 800)
  }
}

const pokemonTypes = computed(
  () => pokemonData.value.types?.map((t) => capitalize(t.type.name)).join(', ') || 'Unknown'
)

const pokemonAbilities = computed(
  () => pokemonData.value.abilities?.map((a) => capitalize(a.ability.name)).join(', ') || 'None'
)

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const openPreview = () => { isModalOpen.value = true }
const closePreview = () => { isModalOpen.value = false }

onMounted(fetchPokemonData)
</script>

<style scoped>
.pokemon-card {
  text-align: center;
  border-radius: 15px;
}

.pokemon-content {
  padding-top: 8px;
}

.pokemon-img {
  width: 130px;
  height: 130px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}

.pokemon-name {
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: capitalize;
}

.card-actions {
  margin-top: 4px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.pokemon-img-large {
  width: 220px;
  height: 220px;
  object-fit: contain;
  margin-bottom: 8px;
}

.error-message {
  color: var(--ion-color-danger);
  font-weight: bold;
}
</style>

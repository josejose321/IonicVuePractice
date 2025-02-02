<template>
  <ion-card class="pokemon-card">
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
            <h3>
              <ion-skeleton-text
                animated
                style="width: 80%"
              ></ion-skeleton-text>
            </h3>
            <p>
              <ion-skeleton-text
                animated
                style="width: 60%"
              ></ion-skeleton-text>
            </p>
            <p>
              <ion-skeleton-text
                animated
                style="width: 30%"
              ></ion-skeleton-text>
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
    </div>

    <div v-else-if="errorMessage">
      <ion-card-content class="error-message">
        <p>{{ errorMessage }}</p>
      </ion-card-content>
    </div>

    <div v-else class="pokemon-content">
      <img
        :alt="pokemonData.name"
        class="pokemon-img"
        :src="pokemonData.sprites?.front_default"
      />
      <ion-card-header>
        <ion-card-title class="pokemon-name">
          {{ pokemonData.name ? capitalize(pokemonData.name) : 'Unknown' }}
        </ion-card-title>
        <ion-card-subtitle> Type: {{ pokemonTypes }} </ion-card-subtitle>
      </ion-card-header>

      <ion-card-content class="card-actions">
        <ion-button color="primary" expand="block" @click="openPreview">
          Preview
        </ion-button>
      </ion-card-content>
    </div>

    <!-- Pokemon Details Modal -->
    <ion-modal ref="modal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title
            >{{ capitalize(pokemonData.name ?? '') }} Details</ion-title
          >
          <ion-buttons slot="end">
            <ion-button @click="closePreview">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="modal-content">
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
          <p>
            <strong>Weight:</strong> {{ (pokemonData.weight ?? 0) / 10 }} kg
          </p>
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
  IonToolbar
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

// Define props with types
const props = defineProps<{ url: string }>()

// Reactive variables
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)
const pokemonData = ref<Pokemon>({})
const modal = ref<HTMLElement | null>(null)

// Fetch Pokemon Data
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
    }, 1000)
  }
}

// Compute Pokémon Types
const pokemonTypes = computed(
  () =>
    pokemonData.value.types?.map(t => capitalize(t.type.name)).join(', ') ||
    'Unknown'
)

// Compute Pokémon Abilities
const pokemonAbilities = computed(
  () =>
    pokemonData.value.abilities
      ?.map(a => capitalize(a.ability.name))
      .join(', ') || 'None'
)

// Capitalize function
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

// Open Preview Modal
const openPreview = () => modal.value?.$el?.present()

// Close Preview Modal
const closePreview = () => modal.value?.$el?.dismiss()

// Fetch data on mount
onMounted(fetchPokemonData)
</script>

<style scoped>
.pokemon-card {
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.pokemon-img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin: 0 auto;
}

.pokemon-name {
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: capitalize;
}

.card-actions {
  margin-top: 10px;
}

/* Modal Styling */
.modal-content {
  text-align: center;
}

.modal-body {
  padding: 20px;
}

.pokemon-img-large {
  width: 250px;
  height: 250px;
  object-fit: contain;
  margin: 0 auto 10px;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from '@/utils/toast'

const usePokemonStore = defineStore('pokemon', () => {
  // ── State ──────────────────────────────────────────────────────────
  const pokemons = ref({
    results: [],
    next: null,
    previous: null,
    count: 0,
  })
  const isLoading = ref(false)

  // ── Getters ────────────────────────────────────────────────────────
  const totalCount = computed(() => pokemons.value.count)
  const hasNext = computed(() => !!pokemons.value.next)
  const hasPrevious = computed(() => !!pokemons.value.previous)

  // ── Actions ────────────────────────────────────────────────────────
  async function fetchPokemon(url = 'https://pokeapi.co/api/v2/pokemon') {
    isLoading.value = true
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to fetch Pokémon (${res.status})`)
      pokemons.value = await res.json()
    } catch (err) {
      toast.error(err.message || 'Failed to load Pokémon')
    } finally {
      isLoading.value = false
    }
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return { pokemons, isLoading, totalCount, hasNext, hasPrevious, fetchPokemon }
})

export default usePokemonStore

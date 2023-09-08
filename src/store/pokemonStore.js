// Utilities
import { defineStore } from 'pinia';
// import pokemonApi from '@/api/pokemon';


const usePokemonStore = defineStore('pokemonStore', {
  state: () => ({
    //
    pokemons:{},
    isLoading: false
  }),
  actions: {

    async fetchPokemon(URL) {

        this.isLoading = true;
        try {
            const res = await fetch(URL);
            this.pokemons = await res.json();
            console.log(this.pokemons);
        }catch (e) {
            alert(e.message);
        } finally {
            setTimeout(() =>{
                this.isLoading = false;
            },1000)
        }
    },
  }
})
export default usePokemonStore

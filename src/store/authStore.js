// Utilities
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import axios from '../axios';

const useAuthStore = defineStore('authStore', {
  state: () => ({
    //
    user: {
      id:null,
      name:null,
      email:null,
      avatar:null,
      created_at:null,
      updated_at:null
    },
    isAuthenticated:false,
    router: useRouter(),
    isLoading:false,
    errors:[],
    message: null,
  }),
  actions: {
    async csrf() {
      // sanctum/csrf-cookie
      try {
        await axios.get("/sanctum/csrf-cookie");
      } catch (error) {
        console.error(error);
      }
    },

    async refresh() {
      this.isLoading = true;
       try {
        const res = await axios.post('api/auth')
        this.user = res.data;
        this.isAuthenticated = true;
       } catch (err) {
          this.router.push('/login');
       } finally {
        this.isLoading = false;
       }
    },

    async logout() {
      this.isLoading = true;
      
      try {
        const res = await axios.post('api/logout')
        localStorage.removeItem('token',res.data)
        this.router.push('/login');
        this.isAuthenticated = false;
        this.user = null;
        useToast().success("Successfully logged out")
      } catch(err) {
          useToast().error("Internal Server Error")
      } finally {
        this.isLoading = false;
      }
    },

    async login(credentials = {}) {
      this.isLoading = true;
      
      try {
        const res = await axios.post('api/login', credentials)

        if(res.status === 200) {
          
          localStorage.setItem('token',res.data)
          
          this.message = 'success'
          useToast().success("Success!")
          // this.refresh();
          setTimeout(() =>{
            this.isAuthenticated = true
            this.router.push('/auth/dashboard')
            this.message = null
          },1000)
        }
        
      } catch(err) {

        if(err.response.status === 422) {
          this.errors = err.response.data.errors;
          this.message = 'error'
          useToast().error("The given data was invalid")
        } else if(err.response.status === 401) {
          this.message = 'error'
          useToast().error("Invalid Credentials")
        } else {
          useToast().error("Internal Server Error")
        }
      } finally {
        this.isLoading = false;
      }      
    },
  }
})
export default useAuthStore

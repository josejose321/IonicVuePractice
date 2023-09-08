<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon aria-hidden="true" :icon="star"></ion-icon>
          Dashboard
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Dashboard page" />
      <ion-button @click="handleLogout">
        <span v-if="!authStore.isLoading">Logout</span>
        <span v-else> <ion-spinner></ion-spinner> </span
      ></ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import ExploreContainer from '@/components/ExploreContainer.vue';
import useAuthStore from '@/store/authStore';
// import useDashboardStore from '@/store/dashboardStore';
import {
IonContent,
IonHeader,
IonIcon,
IonPage,
IonTitle,
IonToolbar
} from '@ionic/vue';
import { star } from 'ionicons/icons';
// let dashboardStore = useDashboardStore()
let authStore = useAuthStore()
const handleLogout = () => {
  authStore.logout()
}
// const initDashboard = () => {
//   dashboardStore.fetchDashboard()
//   dashboardStore.fetchUsersPerDay()
// }
// onMounted(() => {
//   initDashboard()
// })
</script>

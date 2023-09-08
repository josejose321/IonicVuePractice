<template>
  <ion-page>
    <ion-header >
      <ion-toolbar color="primary">
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
      <div class="row">
        <div class="col-md-12">
          <ion-card color="secondary">
            <ion-card-header>
              <ion-card-title>{{ dashboardStore.user_count }}</ion-card-title>
              <ion-card-subtitle>Total Registered User</ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </div>
        
      </div>

      <!-- <ExploreContainer name="Dashboard page" /> -->

      <apexchart
        width="350"
        height="400"
        type="bar"
        :options="dashboardStore.bar_chart_data.options"
        :series="dashboardStore.bar_chart_data.series"
      ></apexchart>
    </ion-content>
    <div class="container">
      <ion-button @click="handleLogout">
        <span v-if="!authStore.isLoading">Logout</span>
        <span v-else> <ion-spinner></ion-spinner> </span
      ></ion-button>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/authStore';
import useDashboardStore from '@/store/dashboardStore';
import {
IonCard,
IonCardHeader,
IonCardSubtitle,
IonCardTitle,
IonContent,
IonHeader,
IonIcon,
IonPage,
IonTitle,
IonToolbar
} from '@ionic/vue';
import { star } from 'ionicons/icons';

const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}

const initDashboard: any = async () => {
  await dashboardStore.fetchDashboard()
  await dashboardStore.fetchUsersPerDay()
}

// Execute initialization logic when the component is mounted
initDashboard()
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon aria-hidden="true" :icon="barChart"></ion-icon>
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

      <ion-grid class="ion-padding">
        <!-- Stats Card -->
        <ion-row>
          <ion-col size="12">
            <ion-card color="secondary">
              <ion-card-header>
                <ion-card-subtitle>Total Registered Users</ion-card-subtitle>
                <ion-card-title>{{ dashboardStore.userCount }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>

        <!-- Chart -->
        <ion-row>
          <ion-col size="12">
            <div class="chart-container">
              <apexchart
                width="100%"
                height="320"
                type="bar"
                :options="dashboardStore.barChartData.options"
                :series="dashboardStore.barChartData.series"
              ></apexchart>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useDashboardStore from '@/store/dashboardStore'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue'
import { barChart } from 'ionicons/icons'

const dashboardStore = useDashboardStore()

onIonViewWillEnter(async () => {
  await dashboardStore.fetchDashboard()
  await dashboardStore.fetchUsersPerDay()
})
</script>

<style scoped>
.chart-container {
  background-color: var(--ion-card-background);
  border-radius: 12px;
  padding: 8px;
  overflow: hidden;
}
</style>

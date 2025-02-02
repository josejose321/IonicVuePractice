<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Dashboard" href="/auth/dashboard">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="pokemon" href="/auth/pokemon">
          <ion-icon aria-hidden="true" :icon="contract" />
          <ion-label>Pokemon</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about" href="/auth/about">
          <ion-icon aria-hidden="true" :icon="star" />
          <ion-label>About</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="contact" href="/auth/contact">
          <ion-icon aria-hidden="true" :icon="contract" />
          <ion-label>Contact</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="contact" id="confirm-logout">
          <ion-icon aria-hidden="true" :icon="logOut" />
          <ion-label>Logout</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <ion-alert
      trigger="confirm-logout"
      header="Are you sure you want to logout?"
      :buttons="alertButtons"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/authStore'
import useDashboardStore from '@/store/dashboardStore'
import {
  IonAlert,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/vue'
import { contract, home, logOut, star } from 'ionicons/icons'
import { ref } from 'vue'
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

const logOutAlert = ref(false)

const handleLogout = () => {
  authStore.logout()
}

const alertButtons = [
  {
    text: 'Cancel',
    role: 'cancel',
    handler: () => {
      console.log('Alert canceled')
    }
  },
  {
    text: 'OK',
    role: 'confirm',
    handler: () => {
      console.log('Alert confirmed')
      handleLogout()
    }
  }
]
</script>

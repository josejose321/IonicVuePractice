<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard" href="/auth/dashboard">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="pokemon" href="/auth/pokemon">
          <ion-icon aria-hidden="true" :icon="flash" />
          <ion-label>Pokemon</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about" href="/auth/about">
          <ion-icon aria-hidden="true" :icon="informationCircle" />
          <ion-label>About</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="contact" href="/auth/contact">
          <ion-icon aria-hidden="true" :icon="mail" />
          <ion-label>Contact</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="logout" id="confirm-logout">
          <ion-icon aria-hidden="true" :icon="logOut" />
          <ion-label>Logout</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

    <ion-alert
      trigger="confirm-logout"
      header="Confirm Logout"
      message="Are you sure you want to logout?"
      :buttons="alertButtons"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/authStore'
import {
  IonAlert,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue'
import { flash, home, informationCircle, logOut, mail } from 'ionicons/icons'

const authStore = useAuthStore()

const alertButtons = [
  {
    text: 'Cancel',
    role: 'cancel',
  },
  {
    text: 'Logout',
    role: 'confirm',
    handler: () => authStore.logout(),
  },
]
</script>

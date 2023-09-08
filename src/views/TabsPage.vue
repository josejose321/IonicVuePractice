<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Dashboard" href="/authenticated/dashboard">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="pokemon" href="/authenticated/pokemon">
          <ion-icon aria-hidden="true" :icon="contract" />
          <ion-label>Pokemon</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about" href="/authenticated/about">
          <ion-icon aria-hidden="true" :icon="star" />
          <ion-label>About</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="contact" href="/authenticated/contact">
          <ion-icon aria-hidden="true" :icon="contract" />
          <ion-label>Contact</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
IonIcon,
IonLabel,
IonPage,
IonRouterOutlet,
IonTabBar,
IonTabButton,
IonTabs
} from '@ionic/vue';
import { contract, home, star } from 'ionicons/icons';
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Contact</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Contact</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Contact page" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import ExploreContainer from '@/components/ExploreContainer.vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
</script>

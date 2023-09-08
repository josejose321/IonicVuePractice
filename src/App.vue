<template>
  <ion-app class="bgColor">
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style scoped>
.bgColor {
  background-color: rgb(0, 0, 0);
}
</style>

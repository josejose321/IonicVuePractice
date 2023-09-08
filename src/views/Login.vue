<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="m-3 border">
        <div class="d-flex justify-content-center mt-5">
          <!-- <ion-avatar> -->
          <img
            class="rounded-pill"
            width="250"
            height="250"
            alt="Silhouette of a person's head"
            src="@/assets/boy-jackpot.jpg"
          />
          <!-- </ion-avatar> -->
          <!-- <img width="175" height="60" src="@/assets/logo.png" alt="" /> -->
        </div>

        <form action="#" method="post">
          <div class="container">
            <div class="mb-3 mt-4">
              <h2><b>Title - Subtitle</b></h2>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp; Lorem ipsum dolor.
              </p>
            </div>

            <ion-list>
              <ion-input
                label="Email"
                label-placement="floating"
                placeholder="Enter Email Address"
                v-model="credential.email"
              ></ion-input>
              <ion-input
                label="Password"
                type="password"
                label-placement="floating"
                placeholder="Enter Password"
                v-model="credential.password"
              ></ion-input>
            </ion-list>
            <div class="d-flex justify-content-center mb-3">
              <ion-button
                class="float-center"
                color="primary"
                @click="tryFunction"
              >
                <span v-if="!authStore.isLoading">Login</span>
                <span v-else>
                  <ion-spinner></ion-spinner>
                </span>
              </ion-button>
            </div>
          </div>
        </form>
        <!-- <ion-card>
        <ion-card-content> </ion-card-content>
      </ion-card> -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/authStore.js';
import {
IonButton,
IonContent,
IonInput,
IonList,
IonPage,
IonSpinner
} from '@ionic/vue';
import { ref } from 'vue';
const credential = ref({
  email: 'admin@admin.com',
  password: 'password'
})
const authStore = useAuthStore()

const tryFunction = () => {
  authStore.login(credential.value)
}
</script>

<style scope></style>

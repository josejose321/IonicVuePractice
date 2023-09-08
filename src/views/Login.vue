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
              <h2><b>eiMED - Billing</b></h2>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp; Enter your Employee Number or Email
                Address and password to start Hospital Information Management.
              </p>
            </div>
            <div class="form-floating mb-4 mt-3">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Enter Email"
                name="email"
                v-model="credential.email"
                required
              />
              <label for="email" class="text-muted"
                >Employee Number / Email Address</label
              >
            </div>

            <div class="form-floating mb-4">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Enter Password"
                name="password"
                v-model="credential.password"
                required
              />
              <label for="password" class="text-muted">Password</label>
            </div>
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
import { IonButton, IonContent, IonPage, IonSpinner } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { useToast } from 'vue-toastification';
const credential = ref({
  email: 'admin@admin.com',
  password: ''
})
let router = useRouter()
let isLoading: any = ref(false)
const authStore = useAuthStore()

const tryFunction = () => {
  authStore.login(credential.value)
}
</script>

<style scope></style>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="register-wrapper">
        <div class="register-card">
          <h2 class="register-title">Create Account</h2>
          <p class="register-subtitle">Sign up to get started</p>
          <ion-button expand="block" fill="outline" @click="goToLogin">
            Already have an account? Login
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonPage } from '@ionic/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToLogin = () => router.push('/login')
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 24px 16px;
}

.register-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--ion-card-background);
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.register-title {
  text-align: center;
  color: var(--ion-text-color);
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.register-subtitle {
  text-align: center;
  color: var(--ion-color-medium);
  margin: 0;
  font-size: 14px;
}
</style>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="form-container">
        <form class="form" @submit.prevent="tryFunction">
          <!-- Avatar Image -->
          <div class="avatar-container">
            <img src="@/assets/boy-jackpot.jpg" alt="User Avatar" class="avatar" />
          </div>

          <h2 class="text-center">Boy Jackpot</h2>

          <div class="flex-column">
            <label for="email">Email</label>
            <div class="inputForm">
              <ion-icon :icon="mailOutline"></ion-icon>
              <input
                id="email"
                type="email"
                class="input"
                placeholder="Enter Email Address"
                v-model="credential.email"
              />
            </div>
          </div>

          <div class="flex-column">
            <label for="password">Password</label>
            <div class="inputForm">
              <ion-icon :icon="lockClosedOutline"></ion-icon>
              <input
                id="password"
                type="password"
                class="input"
                placeholder="Enter Password"
                v-model="credential.password"
              />
            </div>
          </div>

          <div class="flex-row">
            <div>
              <label>
                <input type="checkbox" />
                Remember Me
              </label>
            </div>
            <span class="span">Forgot Password?</span>
          </div>

          <button class="button-submit" type="submit" :disabled="authStore.isLoading">
            <span v-if="!authStore.isLoading">Login</span>
            <ion-spinner v-else></ion-spinner>
          </button>

          <p class="p">Don't have an account? <span class="span">Sign up</span></p>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/authStore.js'
import { IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/vue'
import { lockClosedOutline, mailOutline } from 'ionicons/icons'
import { ref } from 'vue'

const credential = ref({
  email: 'admin@admin.com',
  password: 'password'
})

const authStore = useAuthStore()

const tryFunction = () => {
  authStore.login(credential.value)
}
</script>

<style scoped>
/* Center the form */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Avatar container */
.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

/* Form design */
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Input field styles */
.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
}

.input {
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  width: 100%;
  height: 100%;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

/* Button styles */
.button-submit {
  margin: 20px 0 10px 0;
  background-color: #151717;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.button-submit:hover {
  background-color: #2d79f3;
}

/* Remember Me & Forgot Password */
.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.span {
  color: #2d79f3;
  cursor: pointer;
  font-weight: 500;
}

/* Centered text */
.p {
  text-align: center;
  color: black;
  font-size: 14px;
  margin: 5px 0;
}
</style>

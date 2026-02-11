  <template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="portal-wrapper">
        <div class="portal-card">

          <!-- Card Header -->
          <div class="card-header">
            <div class="logo-ring">
              <ion-icon :icon="businessOutline" class="logo-icon"></ion-icon>
            </div>
            <h1 class="portal-title">BMC Employee Portal</h1>
            <p class="portal-subtitle">HR Management IMISS</p>
          </div>

          <!-- Login Form -->
          <form class="portal-form" @submit.prevent="handleLogin">
            <p class="form-heading">Sign in to your account</p>

            <div class="field-group">
              <label for="email" class="field-label">Email/Username</label>
              <div class="input-wrapper" :class="{ focused: focusedField === 'email' }">
                <ion-icon :icon="mailOutline" class="input-icon"></ion-icon>
                <input
                  id="email"
                  type="email"
                  class="field-input"
                  placeholder="you@company.com"
                  v-model="credential.email"
                  @focus="focusedField = 'email'"
                  @blur="focusedField = null"
                />
              </div>
              <span v-if="errors.email" class="field-error">
                {{ errors.email[0] }}
              </span>
            </div>

            <div class="field-group">
              <label for="password" class="field-label">Password</label>
              <div class="input-wrapper" :class="{ focused: focusedField === 'password' }">
                <ion-icon :icon="lockClosedOutline" class="input-icon"></ion-icon>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Enter your password"
                  v-model="credential.password"
                  @focus="focusedField = 'password'"
                  @blur="focusedField = null"
                />
                <ion-icon
                  :icon="showPassword ? eyeOffOutline : eyeOutline"
                  class="input-icon toggle-eye"
                  @click="showPassword = !showPassword"
                ></ion-icon>
              </div>
              <span v-if="errors.password" class="field-error">
                {{ errors.password[0] }}
              </span>
            </div>

            <div class="form-footer-row">
              <label class="remember-label">
                <input type="checkbox" v-model="rememberMe" />
                Remember Me
              </label>
              <span class="link-text">Forgot Password?</span>
            </div>

            <button class="btn-submit" type="submit" :disabled="authStore.isLoading">
              <ion-icon v-if="!authStore.isLoading" :icon="logInOutline" class="btn-icon"></ion-icon>
              <ion-spinner v-if="authStore.isLoading" name="crescent"></ion-spinner>
              <span v-else>Sign In</span>
            </button>

            <div class="help-row">
              <ion-icon :icon="helpCircleOutline" class="help-icon"></ion-icon>
              <span>Need help? <span class="link-text">Contact IMISS for Support</span></span>
            </div>

            <!-- API Endpoint Indicator -->
            <div class="endpoint-badge">
              <ion-icon :icon="serverOutline" class="endpoint-icon"></ion-icon>
              <span class="endpoint-label">API:</span>
              <span class="endpoint-url">{{ apiBaseUrl }}</span>
            </div>
          </form>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import useAuthStore from '@/store/authStore'
import { IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/vue'
import {
  businessOutline,
  eyeOffOutline,
  eyeOutline,
  helpCircleOutline,
  lockClosedOutline,
  logInOutline,
  mailOutline,
  serverOutline,
} from 'ionicons/icons'
import { computed, ref } from 'vue'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
const credential = ref({ email: 'admin@admin.com', password: 'password' })
const focusedField = ref<string | null>(null)
const showPassword = ref(false)
const rememberMe = ref(false)
const authStore = useAuthStore()
const errors = computed(() => authStore.errors as Record<string, string[]>)

const handleLogin = () => {
  authStore.login(credential.value)
}
</script>

<style scoped>
/* ── Layout ───────────────────────────────────────────── */
.portal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  background: linear-gradient(160deg, var(--ion-color-primary-shade) 0%, var(--ion-background-color) 45%);
}

.portal-card {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  background-color: var(--ion-card-background);
}

/* ── Card Header ──────────────────────────────────────── */
.card-header {
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
  padding: 32px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.logo-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.logo-icon {
  font-size: 36px;
  color: #ffffff;
}

.portal-title {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.portal-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* ── Form ─────────────────────────────────────────────── */
.portal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px 24px 24px;
}

.form-heading {
  color: var(--ion-text-color);
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
}

/* ── Fields ───────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  color: var(--ion-text-color);
  font-size: 13px;
  font-weight: 500;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid var(--ion-color-step-200, #e0e0e0);
  border-radius: 10px;
  height: 50px;
  padding: 0 12px;
  background-color: var(--ion-item-background);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrapper.focused {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}

.input-icon {
  color: var(--ion-color-medium);
  font-size: 18px;
  flex-shrink: 0;
}

.toggle-eye {
  cursor: pointer;
}

.toggle-eye:hover {
  color: var(--ion-color-primary);
}

.field-input {
  border: none;
  background: transparent;
  color: var(--ion-text-color);
  font-size: 15px;
  width: 100%;
  height: 100%;
}

.field-input:focus {
  outline: none;
}

.field-input::placeholder {
  color: var(--ion-color-medium);
}

.field-error {
  color: var(--ion-color-danger);
  font-size: 12px;
  margin-top: 2px;
}

/* ── Footer Row ───────────────────────────────────────── */
.form-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--ion-text-color);
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.link-text {
  color: var(--ion-color-primary);
  cursor: pointer;
  font-weight: 500;
}

/* ── Submit Button ────────────────────────────────────── */
.btn-submit {
  margin-top: 4px;
  background-color: var(--ion-color-primary);
  border: none;
  color: var(--ion-color-primary-contrast);
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.88;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
}

/* ── Help Row ─────────────────────────────────────────── */
.help-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--ion-color-medium);
  font-size: 13px;
}

.help-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* ── Endpoint Badge ───────────────────────────────────── */
.endpoint-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background-color: var(--ion-item-background);
  border: 1px solid var(--ion-color-step-200, #e0e0e0);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--ion-color-medium);
  word-break: break-all;
}

.endpoint-icon {
  font-size: 13px;
  flex-shrink: 0;
  color: var(--ion-color-primary);
}

.endpoint-label {
  font-weight: 600;
  flex-shrink: 0;
  color: var(--ion-color-primary);
}

.endpoint-url {
  font-family: monospace;
}
</style>

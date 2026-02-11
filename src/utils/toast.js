import { toastController } from '@ionic/vue'
import { alertCircleOutline, checkmarkCircleOutline, warningOutline } from 'ionicons/icons'

async function show({ message, color, icon, duration = 3000, showDismiss = false }) {
  const buttons = showDismiss ? [{ text: 'Dismiss', role: 'cancel' }] : []

  const instance = await toastController.create({
    message,
    duration,
    color,
    icon,
    position: 'top',
    buttons,
  })

  await instance.present()
}

export const toast = {
  success: (message) =>
    show({ message, color: 'success', icon: checkmarkCircleOutline }),

  error: (message) =>
    show({ message, color: 'danger', icon: alertCircleOutline, duration: 5000, showDismiss: true }),

  warning: (message) =>
    show({ message, color: 'warning', icon: warningOutline, duration: 4000, showDismiss: true }),
}

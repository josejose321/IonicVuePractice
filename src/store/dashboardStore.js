import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import moment from 'moment'
import axios from '@/axios'

const useDashboardStore = defineStore('dashboard', () => {
  const toast = useToast()

  // ── State ──────────────────────────────────────────────────────────
  const userCount = ref(0)
  const isLoading = ref(false)
  const userStats = ref([])

  const barChartData = reactive({
    options: {
      chart: { id: 'users-per-day', toolbar: { show: false } },
      xaxis: { categories: [] },
    },
    series: [{ name: 'Users per Day', data: [] }],
  })

  // ── Getters ────────────────────────────────────────────────────────
  const hasData = computed(() => userCount.value > 0)

  // ── Actions ────────────────────────────────────────────────────────
  async function fetchDashboard() {
    isLoading.value = true
    try {
      const { data } = await axios.get('api/dashboard')
      userCount.value = data.user_count
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUsersPerDay() {
    isLoading.value = true
    try {
      const { data } = await axios.get('api/dashboard/users-per-day')
      userStats.value = data
      barChartData.options.xaxis.categories = data.map((item) =>
        moment(item.date_created).format('l')
      )
      barChartData.series = [
        {
          name: 'Users per Day',
          data: data.map((item) => parseInt(item.user_count)),
        },
      ]
    } catch (err) {
      toast.error(err.message || 'Failed to load chart data')
    } finally {
      isLoading.value = false
    }
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return { userCount, isLoading, userStats, barChartData, hasData, fetchDashboard, fetchUsersPerDay }
})

export default useDashboardStore

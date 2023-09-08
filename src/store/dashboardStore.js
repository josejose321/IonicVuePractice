// Utilities
import { defineStore } from 'pinia';
// import { useToast } from "vue-toastification";
import moment from "moment";
import axios from '../axios';
const useDashboardStore = defineStore('dashboardStore', {
  state: () => ({
    //
    user_count: 0,
    bar_chart_data:{
        options:{
            chart: {
                id: "vuechart-example",
              },
            xaxis: {
                categories: []
            }
        },
        series: [
            {
              name: "Users per Day",
              data: [],
            },
        ],
    },
    user_stats:[],
    // toast:useToast(),
    isLoading:false

  }),
  actions: {

    async fetchDashboard() {
        this.isLoading = true;
       try {
        const {data} = await axios.get('api/dashboard')
        this.user_count = data.user_count
       } catch (err) {
        if (err.response.status === 401) {
            this.router.push('/login');
        } else {
            alert(err.message)
        }
          
       } finally {
        this.isLoading = false;
       }
    },
    
    async fetchUsersPerDay() {
        this.isLoading = true;
       try {
        const {data} = await axios.get('api/dashboard/users-per-day')
        const bar_data          = data.map((item) => parseInt(item.user_count))
        const bar_categories    = data.map((item) => moment(item.date_created).format('l'))
        this.user_stats = data;
        this.bar_chart_data = {
            options:{
                chart: {
                    id: "vuechart-example",
                  },
                xaxis: {
                    categories: bar_categories
                }
            },
            series: [
                {
                  name: "Users per Day",
                  data: bar_data,
                },
            ],
            
        }
       } catch (err) {
        if (err.response.status === 401) {
            this.router.push('/login');
        } else {
            alert(err.message)
        }
          
       } finally {
        this.isLoading = false;
       }
    }
    
  }
})
export default useDashboardStore

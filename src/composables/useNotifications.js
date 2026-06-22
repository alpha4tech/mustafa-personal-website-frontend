import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import instance from '../api/axios'

export function useNotifications() {
  const notifications = ref([])
  const loading = ref(false)
  let pollingInterval = null

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read_at).length
  )

  const fetchNotifications = async () => {
    try {
      loading.value = true
      const { data } = await instance.get('/notifications')
      notifications.value = data.data
    } catch (err) {
      console.error('Notifications fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const markAllRead = async () => {
    try {
      await instance.post('/notifications/mark-all-read')
      notifications.value = notifications.value.map((n) => ({
        ...n,
        read_at: new Date().toISOString(),
      }))
    } catch (err) {
      console.error('Mark all read error:', err)
    }
  }

  const markOneRead = async (id) => {
    try {
      await instance.post(`/notifications/${id}/mark-read`)
      const notif = notifications.value.find((n) => n.id === id)
      if (notif) notif.read_at = new Date().toISOString()
    } catch (err) {
      console.error('Mark read error:', err)
    }
  }

  const startPolling = (interval = 30000) => {
    pollingInterval = setInterval(fetchNotifications, interval)
  }

  const stopPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval)
  }

  onMounted(() => {
    fetchNotifications()
    startPolling()
  })

  onBeforeUnmount(() => {
    stopPolling()
  })

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllRead,
    markOneRead,
  }
}

// import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// import axios from 'axios'

// export function useNotifications() {
//   const notifications = ref([])
//   const loading = ref(false)
//   let pollingInterval = null

//   const unreadCount = computed(() =>
//     notifications.value.filter((n) => !n.read_at).length
//   )

//   // جلب الـ token من localStorage
//   const getHeaders = () => ({
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
//     },
//   })

//   const fetchNotifications = async () => {
//     try {
//       loading.value = true
//       const { data } = await axios.get('/api/notifications', getHeaders())
//       notifications.value = data.data
//     } catch (err) {
//       console.error('Notifications fetch error:', err)
//     } finally {
//       loading.value = false
//     }
//   }

//   const markAllRead = async () => {
//     try {
//       await axios.post('/api/notifications/mark-all-read', {}, getHeaders())
//       notifications.value = notifications.value.map((n) => ({
//         ...n,
//         read_at: new Date().toISOString(),
//       }))
//     } catch (err) {
//       console.error('Mark all read error:', err)
//     }
//   }

//   const markOneRead = async (id) => {
//     try {
//       await axios.post(`/api/notifications/${id}/mark-read`, {}, getHeaders())
//       const notif = notifications.value.find((n) => n.id === id)
//       if (notif) notif.read_at = new Date().toISOString()
//     } catch (err) {
//       console.error('Mark read error:', err)
//     }
//   }

//   const startPolling = (interval = 30000) => {
//     pollingInterval = setInterval(fetchNotifications, interval)
//   }

//   const stopPolling = () => {
//     if (pollingInterval) clearInterval(pollingInterval)
//   }

//   onMounted(() => {
//     fetchNotifications()
//     startPolling()
//   })

//   onBeforeUnmount(() => {
//     stopPolling()
//   })

//   return {
//     notifications,
//     unreadCount,
//     loading,
//     fetchNotifications,
//     markAllRead,
//     markOneRead,
//   }
// }

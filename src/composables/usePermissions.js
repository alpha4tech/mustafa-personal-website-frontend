import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
    const authStore = useAuthStore()

    const isAdmin = computed(() => authStore.user?.role === 'admin')

    const can = (permission) => {
        if (authStore.user?.role === 'admin') return true
        return authStore.permissions?.includes(permission) || false
    }

    return { isAdmin, can }
}

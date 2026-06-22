import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../stores/Auth'
import { useRouter } from 'vue-router'

export function useAutoLogout(timeoutMinutes = 15) {
  const auth = useAuthStore()
  const router = useRouter()

  let warningTimer = null
  let logoutTimer = null
  let warningVisible = false

  const TIMEOUT_MS = timeoutMinutes * 60 * 1000        // 15 Munites
  const WARNING_MS = (timeoutMinutes - 2) * 60 * 1000  // Warning befor 15 Munites

  const showWarning = () => {
    warningVisible = true
    const toast = document.createElement('div')
    toast.id = 'auto-logout-warning'
    toast.innerHTML = `
      <div style="
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 14px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        min-width: 320px;
        justify-content: space-between;
      ">
        <span>⚠️ ستنتهي جلستك خلال دقيقتين</span>
        <button id="stay-active-btn" style="
          background: #18B2BC;
          border: none;
          color: white;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.85rem;
        ">أنا هنا</button>
      </div>
    `
    document.body.appendChild(toast)

    document.getElementById('stay-active-btn')?.addEventListener('click', resetTimers)
  }

  const hideWarning = () => {
    const toast = document.getElementById('auto-logout-warning')
    if (toast) toast.remove()
    warningVisible = false
  }

  const doLogout = async () => {
    hideWarning()
    await auth.logout()
    router.push('/admin/auth/login')
  }

  const resetTimers = () => {
    hideWarning()
    clearTimeout(warningTimer)
    clearTimeout(logoutTimer)

    warningTimer = setTimeout(showWarning, WARNING_MS)
    logoutTimer  = setTimeout(doLogout, TIMEOUT_MS)
  }

  const EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']

  onMounted(() => {
    EVENTS.forEach((e) => document.addEventListener(e, resetTimers))
    resetTimers()
  })

  onBeforeUnmount(() => {
    EVENTS.forEach((e) => document.removeEventListener(e, resetTimers))
    clearTimeout(warningTimer)
    clearTimeout(logoutTimer)
    hideWarning()
  })
}

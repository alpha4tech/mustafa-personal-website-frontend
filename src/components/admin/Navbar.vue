<template>
  <header class="admin-navbar" :class="{ 'navbar-rtl': isRtl, 'navbar-dark': darkMode }">
    <div class="navbar-container">

      <!-- LEFT -->
      <div class="navbar-left">
        <button class="mobile-menu-toggle" @click="$emit('toggle-sidebar-mobile')">
          <i class="bi bi-list"></i>
        </button>

        <div class="logo-wrapper">
          <img :src="imageUrl" alt="Logo" class="logo-img" />
          <span class="text-gradient-navy-teal">{{ t('LogoText') }}</span>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="navbar-right">

        <!-- LANGUAGE -->
        <button
          class="action-icon language-btn"
          @click="toggleLocaleHandler"
          :title="locale === 'en' ? 'العربية' : 'English'"
        >
          <span class="language-text">
            {{ locale === 'en' ? 'عربي' : 'EN' }}
          </span>
        </button>

        <!-- NOTIFICATIONS -->
        <div class="notification-wrapper">
          <button class="action-icon notification-btn" @click.stop="toggleNotifications">
            <i class="bi bi-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">
              {{ unreadCount }}
            </span>
          </button>

          <Transition name="dropdown">
            <div v-if="showNotifications" class="notification-dropdown" @click.stop>
              <div class="dropdown-header">
                <span>{{ t('notifications') }}</span>
                <div style="display:flex; gap: 3rem;">
                  <button @click="markAllRead" class="mark-read">
                    {{ t('markAllRead') }}
                  </button>
                  <button @click="openModal" class="mark-read">
                    {{t('ShowAll')}}
                  </button>
                </div>
              </div>

              <div class="dropdown-body">
                <div v-if="notifications.length === 0" class="empty-notifications">
                  <i class="bi bi-bell-slash"></i>
                  <p>{{ t('noNotifications') }}</p>
                </div>

                <div
                  v-else
                  v-for="notif in notifications"
                  :key="notif.id"
                  class="notification-item"
                  :class="{ 'unread': !notif.read_at }"
                  @click="markOneRead(notif.id)"
                >
                  <i :class="[notif.icon, `text-${notif.color}`]"></i>
                  <div>
                    <p class="notif-title">{{ notif.title }}</p>
                    <p class="notif-message">{{ notif.message }}</p>
                    <small>{{ notif.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- USER -->
        <div class="user-dropdown">
          <button class="user-btn" @click.stop="toggleDropdown">
            <div class="user-avatar avatar-gradient-multi">
              <span class="avatar-initials">
                {{ userInitials }}
              </span>
            </div>

            <div class="user-info">
              <span class="user-name">
                {{ userDisplayName }}
              </span>
              <i class="bi bi-chevron-down" :class="{ rotated: dropdownVisible }"></i>
            </div>
          </button>

          <!-- DROPDOWN -->
          <Teleport to="body">
            <Transition name="dropdown">
              <div
                v-if="dropdownVisible"
                class="dropdown-menu-fixed"
                @click.stop
                :style="getDropdownStyle"
              >
                <!-- USER INFO -->
                <div class="dropdown-user-info">
                  <div class="dropdown-avatar">
                    <span>{{ userInitials }}</span>
                  </div>

                  <div class="dropdown-user-details">
                    <div class="dropdown-user-name">
                      {{ userDisplayName }}
                    </div>
                    <div class="dropdown-user-role">
                      {{ userRole }}
                    </div>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <router-link to="/admin/profile" class="dropdown-item" @click="closeDropdown">
                  <i class="bi bi-person"></i>
                  <span>{{ t('myProfile') }}</span>
                </router-link>

                <router-link to="/admin/profile/edit" class="dropdown-item" @click="closeDropdown">
                  <i class="bi bi-person-gear"></i>
                  <span>{{ t('editProfile') }}</span>
                </router-link>

                <router-link to="/admin/profile" class="dropdown-item" @click="closeDropdown">
                  <i class="bi bi-gear"></i>
                  <span>{{ t('settings') }}</span>
                </router-link>

                <div class="dropdown-divider"></div>

                <button class="dropdown-item logout" @click="logoutUser">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>{{ t('logout') }}</span>
                </button>
              </div>
            </Transition>
          </Teleport>
        </div>
      </div>
    </div>

    <!-- NOTIFICATIONS MODAL -->
    <NotificationsModal
      :show="showModal"
      :notifications="notifications"
      :unreadCount="unreadCount"
      @close="showModal = false"
      @mark-all="markAllRead"
      @read-one="markOneRead"
    />

  </header>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useNotifications } from '../../composables/useNotifications'
import { useAutoLogout } from '../../composables/useAutoLogout'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/Auth'
import { useSettings } from '../../composables/useSettings'
import NotificationsModal from './NotificationsModal.vue'

export default {
  name: 'AdminNavbar',

  components: {
    NotificationsModal,
  },

  props: {
    isRtl: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['toggle-sidebar-mobile'],

  setup(props) {
    const auth = useAuthStore()
    const router = useRouter()

    const { locale, darkMode, toggleLocale, toggleDarkMode, t } = useSettings()

    /* =========================
       AUTO LOGOUT — 20 Munets
    ========================== */
    useAutoLogout(20)

    /* =========================
       DROPDOWN
    ========================== */

    const dropdownVisible = ref(false)
    const showNotifications = ref(false)

    const dropdownPosition = ref({ top: 0, left: 0 })

    const toggleDropdown = async () => {
      dropdownVisible.value = !dropdownVisible.value

      if (dropdownVisible.value) {
        await nextTick()
        calculateDropdownPosition()
      }

      if (showNotifications.value) {
        showNotifications.value = false
      }
    }

    const calculateDropdownPosition = () => {
      const userBtn = document.querySelector('.user-btn')
      if (!userBtn) return

      const rect = userBtn.getBoundingClientRect()
      const dropdownWidth = window.innerWidth <= 576 ? 220 : 260
      let leftPosition

      if (props.isRtl) {
        leftPosition = rect.left
        if (leftPosition + dropdownWidth > window.innerWidth - 12) {
          leftPosition = window.innerWidth - dropdownWidth - 12
        }
        if (leftPosition < 12) leftPosition = 12
      } else {
        leftPosition = rect.right - dropdownWidth
        if (leftPosition < 12) leftPosition = 12
      }

      dropdownPosition.value = {
        top: rect.bottom + 10,
        left: leftPosition,
      }
    }

    const getDropdownStyle = computed(() => ({
      top: dropdownPosition.value.top + 'px',
      left: dropdownPosition.value.left + 'px',
    }))

    const closeDropdown = () => {
      dropdownVisible.value = false
    }

    /* =========================
       NOTIFICATIONS
    ========================== */

    const notif = useNotifications()
    const notifications = notif.notifications
    const unreadCount = notif.unreadCount
    const markAllRead = notif.markAllRead
    const markOneRead = notif.markOneRead

    const showModal = ref(false)

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      if (dropdownVisible.value) {
        dropdownVisible.value = false
      }
    }

    const openModal = () => {
      showNotifications.value = false
      showModal.value = true
    }

    /* =========================
       OUTSIDE CLICK
    ========================== */

    const handleClickOutside = (event) => {
      const userDropdown = document.querySelector('.user-dropdown')
      const notificationWrapper = document.querySelector('.notification-wrapper')

      if (userDropdown && !userDropdown.contains(event.target)) {
        dropdownVisible.value = false
      }

      if (notificationWrapper && !notificationWrapper.contains(event.target)) {
        showNotifications.value = false
      }
    }

    /* =========================
       RESIZE
    ========================== */

    const handleResize = () => {
      if (dropdownVisible.value) {
        calculateDropdownPosition()
      }
    }

    /* =========================
       LOGOUT
    ========================== */

    const logoutUser = async () => {
      await auth.logout()
      dropdownVisible.value = false
      router.push('/admin/auth/login')
    }

    /* =========================
       SETTINGS
    ========================== */

    const toggleLocaleHandler = () => {
      toggleLocale()
      if (dropdownVisible.value) {
        calculateDropdownPosition()
      }
    }

    const toggleDarkModeHandler = () => {
      toggleDarkMode()
    }

    /* =========================
       USER
    ========================== */

    const userDisplayName = computed(() => {
      const user = auth.user
      if (user?.name) return user.name
      if (user?.username) return user.username
      if (user?.email) return user.email
      return 'Guest'
    })

    const userInitials = computed(() => {
      const name = userDisplayName.value
      if (!name || name === 'Guest') return 'G'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })

    const userRole = computed(() => {
      const role = auth.user?.role
      if (role === 'admin') return t('admin') || 'Admin'
      if (role === 'manager') return t('manager') || 'Manager'
      return t('user') || 'User'
    })

    /* =========================
       LIFECYCLE
    ========================== */

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })

    return {
      dropdownVisible,
      showNotifications,
      showModal,

      unreadCount,
      notifications,

      toggleDropdown,
      closeDropdown,

      toggleNotifications,
      openModal,
      markAllRead,
      markOneRead,

      logoutUser,

      toggleLocaleHandler,
      toggleDarkModeHandler,

      userDisplayName,
      userInitials,
      userRole,

      locale,
      darkMode,
      t,

      getDropdownStyle,

      imageUrl: '/images/logo/logo-1.png',
    }
  },
}
</script>

<style scoped>
.admin-navbar {
  background: var(--bg-header) !important;
  box-shadow: 0 2px 15px rgba(23, 40, 74, 0.08);
}

.user-avatar {
  background: linear-gradient(135deg, #0A1870 0%, #0F2196 55%, #162FBB 100%);

}

.action-icon:hover {
  background: linear-gradient(135deg, #0A1870 0%, #0F2196 55%, #162FBB 100%);

  color: var(--color-teal);
}

.user-btn:hover {
  background: rgba(24, 178, 188, 0.1);
}

.admin-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 5000;
}

.navbar-dark {
  background: #1e1e1e;
}

.navbar-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img { height: 40px; }

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-rtl .navbar-container { direction: rtl; }
.navbar-rtl .navbar-left { flex-direction: row-reverse; }
.navbar-rtl .navbar-right { flex-direction: row-reverse; }

.mobile-menu-toggle,
.action-icon {
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.3s;
}

.mobile-menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.4rem;
}

.action-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #475569;
}

.action-icon:hover,
.mobile-menu-toggle:hover { background: #f1f5f9; }

.navbar-dark .action-icon { color: #e2e8f0; }
.navbar-dark .action-icon:hover,
.navbar-dark .mobile-menu-toggle:hover { background: #2d3748; }

.language-text {
  font-size: 0.8rem;
  font-weight: 700;
}

.notification-wrapper { position: relative; }

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.navbar-dark .notification-dropdown {
  background: #1e1e1e;
  border: 1px solid #334155;
}

.navbar-rtl .notification-dropdown {
  right: auto;
  left: 0;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.mark-read {
  border: none;
  background: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.8rem;
}

.mark-read:hover { text-decoration: underline; }

.dropdown-body {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 0.7rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: 0.2s;
}

.notification-item:hover { background: #f8fafc; }

.notification-item.unread {
  background: #f0f9ff;
  border-right: 3px solid #18B2BC;
}

.notification-item.unread:hover { background: #e0f2fe; }

.notif-title {
  font-weight: 600;
  font-size: 0.85rem;
  margin: 0;
}

.notif-message {
  font-size: 0.8rem;
  color: #475569;
  margin: 2px 0;
}

.text-danger  { color: #ef4444; }
.text-warning { color: #f59e0b; }
.text-info    { color: #18B2BC; }

.empty-notifications {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}

.user-dropdown { position: relative; }

.user-btn {
  border: none;
  background: none;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  transition: 0.3s;
}

.user-btn:hover { background: #f1f5f9; }
.navbar-dark .user-btn:hover { background: #2d3748; }

.user-avatar,
.dropdown-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFFFFF 0%, #18B2BC 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.navbar-rtl .user-info { flex-direction: row-reverse; }

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.navbar-dark .user-name { color: #e2e8f0; }

.rotated { transform: rotate(180deg); }

.dropdown-menu-fixed {
  position: fixed;
  width: 260px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  z-index: 999999;
  animation: fadeInDown 0.2s ease;
}

.navbar-dark .dropdown-menu-fixed {
  background: #1e1e1e;
  border: 1px solid #334155;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: #f8fafc;
}

.navbar-dark .dropdown-user-info { background: #2d3748; }
.dropdown-user-name { font-weight: 700; }
.dropdown-user-role { font-size: 0.75rem; color: #64748b; }

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
}

.navbar-dark .dropdown-divider { background: #334155; }

.dropdown-item {
  width: 100%;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 1rem;
  text-decoration: none;
  color: #1e293b;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.9rem;
}

.dropdown-item:hover { background: #f1f5f9; }
.navbar-dark .dropdown-item { color: #e2e8f0; }
.navbar-dark .dropdown-item:hover { background: #2d3748; }
.dropdown-item.logout { color: #ef4444; }

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dropdown-enter-active,
.dropdown-leave-active { transition: all 0.2s ease; }

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 992px) {
  .navbar-container { padding: 0 0.8rem; }
  .mobile-menu-toggle { display: flex; align-items: center; justify-content: center; }
  .logo-text { display: none; }
  .user-name { display: none; }
  .navbar-left { gap: 0.5rem; }
  .navbar-right { gap: 0.35rem; margin-inline-start: auto; }
  .logo-img { height: 32px; }
}

@media (max-width: 576px) {
  .dropdown-menu-fixed { width: 220px; max-width: calc(100vw - 24px); }
  .notification-dropdown { width: 280px; max-width: calc(100vw - 24px); right: 0; }
  .navbar-rtl .notification-dropdown { right: auto; left: 0; }
  .action-icon { width: 34px; height: 34px; font-size: 1rem; }
  .user-avatar { width: 34px; height: 34px; }
}
</style>

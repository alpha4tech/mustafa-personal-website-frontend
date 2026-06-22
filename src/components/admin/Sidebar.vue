<template>
  <!-- Sidebar Backdrop -->
  <div class="sidebar-backdrop"
       :class="{ 'show': isSidebarOpen }"
       @click="closeSidebar"
       v-if="isMobile && isSidebarOpen">
  </div>

  <!-- Sidebar -->
  <div class="sidebar" :class="[sidebarClasses, { 'rtl-sidebar': isRtl }]">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <img :src="logoUrl" alt="Logo" class="logo-img">
        <span class="logo-text" v-show="!isCollapsed">{{ t('AdminPanel') }}</span>
      </div>
      <button class="sidebar-toggle-btn" @click="toggleSidebar">
        <i class="ri-close-line" v-if="isMobile && isSidebarOpen"></i>
        <i class="ri-menu-fold-line" v-else-if="!isCollapsed && !isMobile"></i>
        <i class="ri-menu-unfold-line" v-else-if="isCollapsed && !isMobile"></i>
        <i class="ri-menu-2-line" v-else></i>
      </button>
    </div>

    <!-- Sidebar Menu -->
    <div class="sidebar-menu">
      <div class="menu-content">
        <!-- Dashboard -->
        <div class="menu-section">
          <div class="menu-item" :class="{ 'active': activeMenu === 'dashboard' }">
            <router-link to="/admin/dashboard" class="menu-link" @click="setActiveMenu('dashboard')">
              <i class="bi bi-speedometer2 menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Dashboard') }}</span>
            </router-link>
          </div>
        </div>

        <!-- Blog Section -->
        <div class="menu-section">

          <div class="menu-label" v-show="!isCollapsed">
            <i class="bi bi-journal-text menu-label-icon"></i>
              {{ t('Blog') }}
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Posts' }">
            <router-link to="/admin/blog" class="menu-link" @click="setActiveMenu('Posts')">
              <i class="bi bi-file-earmark-text menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Posts') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'CreatePost' }">
            <router-link to="/admin/blog/create" class="menu-link" @click="setActiveMenu('CreatePost')">
              <i class="bi bi-plus-circle menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('CreatePost') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Comments' }">
            <router-link to="/admin/comments" class="menu-link" @click="setActiveMenu('Comments')">
              <i class="bi bi-pencil menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Comments') }}</span>
            </router-link>
          </div>
        </div>

        <!-- portifolio Section -->
        <div class="menu-section">
          <div class="menu-label" v-show="!isCollapsed">
             <i class="bi bi-briefcase menu-label-icon"></i>
               {{ t('portifolio') }}
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Porjects' }">
            <router-link to="/admin/portfolio" class="menu-link" @click="setActiveMenu('Porjects')">
              <i class="bi bi-grid-3x3-gap menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Porjects') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'CreatePorjects' }">
            <router-link to="/admin/portfolio/create" class="menu-link" @click="setActiveMenu('CreatePorjects')">
              <i class="bi bi-plus-circle menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('CreatePorjects') }}</span>
            </router-link>
          </div>
        </div>

        <!-- Service Section -->
        <div class="menu-section">
          <div class="menu-label" v-show="!isCollapsed">
             <i class="bi bi-gear menu-label-icon"></i>
               {{ t('Services') }}
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Services' }">
            <router-link to="/admin/services" class="menu-link" @click="setActiveMenu('Services')">
              <i class="bi bi-list-ul menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('AllServices') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'CreateServices' }">
            <router-link to="/admin/services/create" class="menu-link" @click="setActiveMenu('CreateServices')">
              <i class="bi bi-plus-circle menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('CreateServices') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'serviceRequests' }">
            <router-link to="/admin/services/service-requests" class="menu-link" @click="setActiveMenu('serviceRequests')">
                 <i class="bi bi-clipboard-check menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('serviceRequests') }}</span>
            </router-link>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="menu-section">
          <div class="menu-label" v-show="!isCollapsed">
             <i class="bi bi-envelope menu-label-icon"></i>
               {{ t('Contacts') }}
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Messages' }">
            <router-link to="/admin/contacts" class="menu-link" @click="setActiveMenu('Messages')">
              <i class="bi bi-envelope-paper menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Messages') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Customers' }">
            <router-link to="/admin/dashboard" class="menu-link" @click="setActiveMenu('Customers')">
              <i class="bi bi-people menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Customers') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Suppliers' }">
            <router-link to="/admin/dashboard" class="menu-link" @click="setActiveMenu('Suppliers')">
              <i class="bi bi-truck menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Suppliers') }}</span>
            </router-link>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="menu-section">
          <div class="menu-label" v-show="!isCollapsed">
             <i class="bi bi-sliders menu-label-icon"></i>
                {{ t('Settings') }}
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'GeneralSettings' }">
            <router-link to="/admin/dashboard" class="menu-link" @click="setActiveMenu('GeneralSettings')">
              <i class="bi bi-gear-wide-connected menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('GeneralSettings') }}</span>
            </router-link>
          </div>

          <div class="menu-item" :class="{ 'active': activeMenu === 'Backup' }">
            <router-link to="/admin/dashboard" class="menu-link" @click="setActiveMenu('Backup')">
              <i class="bi bi-database menu-icon"></i>
              <span class="menu-text" v-show="!isCollapsed">{{ t('Backup') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer" v-show="!isCollapsed">
      <div class="user-info">
        <div class="user-avatar">
          <div class="avatar-initials">{{ getUserInitials }}</div>
        </div>
        <div class="user-details">
          <div class="user-name">{{ getUserDisplayName }}</div>
          <div class="user-role">{{ t('Administrator') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/Auth'
import { useSettings } from '../../composables/useSettings'

export default {
  name: 'AdminSidebar',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    },
    isRtl: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const auth = useAuthStore()
    const { t, isRtl: settingsRtl } = useSettings()

    const toggleSidebar = () => {
      emit('toggle-sidebar')
    }

    return {
      user: auth.user,
      toggleSidebar,
      t,
      isRtl: settingsRtl
    }
  },
  data() {
    return {
      logoUrl: '/images/logo/logo-1.png',
      activeMenu: 'dashboard',
      isMobile: false,
      isSidebarOpen: false
    }
  },
  computed: {
    sidebarClasses() {
      return {
        'collapsed': this.isCollapsed && !this.isMobile,
        'mobile-open': this.isSidebarOpen && this.isMobile,
        'mobile-closed': !this.isSidebarOpen && this.isMobile
      }
    },
    getUserDisplayName() {
      if (this.user && this.user.name) {
        return this.user.name
      } else if (this.user && this.user.username) {
        return this.user.username
      } else if (this.user && this.user.email) {
        return this.user.email.split('@')[0]
      }
      return 'Admin'
    },
    getUserInitials() {
      const name = this.getUserDisplayName
      if (!name || name === 'Admin') return 'A'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }
  },
  watch: {
    isCollapsed(newVal) {
      if (!this.isMobile) {
        this.isSidebarOpen = !newVal
      }
    }
  },
  mounted() {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    if (!this.isMobile) {
      this.isSidebarOpen = true
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize)
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu
      if (this.isMobile) {
        this.closeSidebar()
      }
    },

    checkScreenSize() {
      const wasMobile = this.isMobile
      this.isMobile = window.innerWidth < 992

      if (wasMobile !== this.isMobile) {
        if (this.isMobile) {
          this.isSidebarOpen = false
        } else {
          this.isSidebarOpen = true
        }
      }
    },

    closeSidebar() {
      if (this.isMobile) {
        this.isSidebarOpen = false
      }
    }
  }
}
</script>

<style scoped>
/* ========== Variables ========== */
.sidebar {
  /* --sidebar-bg: #162FBB; color:#fff; */
  /* --sidebar-bg: #17284A; */
   --sidebar-bg: linear-gradient(135deg, #0A1870 0%, #0F2196 55%, #162FBB 100%);

  --sidebar-header-bg: #0f1e3a;
  --sidebar-border: rgba(255, 255, 255, 0.08);
  --menu-text: rgba(255, 255, 255, 0.75);
  --menu-text-hover: #FFFFFF;
  --menu-bg-hover: rgba(24, 178, 188, 0.15);
  /* --menu-active-bg: linear-gradient(135deg, #18B2BC 0%, #13888D 100%); */
  /* --menu-active-bg:#162FBB; color:#fff; */
  --menu-active-text: #FFFFFF;
  --label-text: rgba(255, 255, 255, 0.5);
  --footer-border: rgba(255, 255, 255, 0.1);
  --user-name: #FFFFFF;
  --user-role: rgba(255, 255, 255, 0.6);
  /* --avatar-bg: linear-gradient(135deg, #18B2BC 0%, #13888D 100%); */
  --avatar-bg: linear-gradient(135deg, #04092b 0%, #0F2196 55%, #162FBB 100%);
;
}

/* ========== Main Sidebar ========== */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: var(--sidebar-bg);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
}

/* RTL Sidebar */
.sidebar.rtl-sidebar {
  left: auto;
  right: 0;
  box-shadow: -2px 0 15px rgba(0, 0, 0, 0.2);
}

.sidebar.collapsed {
  width: 80px;
}

/* ========== Sidebar Backdrop ========== */
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.sidebar-backdrop.show {
  opacity: 1;
  visibility: visible;
}

/* Mobile States */
.sidebar.mobile-closed {
  transform: translateX(-100%);
}

.sidebar.rtl-sidebar.mobile-closed {
  transform: translateX(100%);
}

.sidebar.mobile-open {
  transform: translateX(0);
}

/* ========== Sidebar Header ========== */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
  background: var(--sidebar-header-bg);
  border-bottom: 1px solid var(--sidebar-border);
}

.sidebar.collapsed .sidebar-header {
  padding: 0 16px;
  justify-content: center;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar.collapsed .sidebar-logo {
  justify-content: center;
}

.logo-img {
  height: 36px;
  width: auto;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  background: linear-gradient(135deg, #FFFFFF 0%, #18B2BC 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar.collapsed .logo-text {
  display: none;
}

/* Toggle Button */
.sidebar-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.collapsed .sidebar-toggle-btn {
  width: 40px;
  height: 40px;
}

.sidebar-toggle-btn:hover {
  background: rgba(24, 178, 188, 0.3);
  color: var(--color-teal);
  transform: rotate(90deg);
}

/* ========== Sidebar Menu ========== */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--color-teal) var(--sidebar-bg);
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: var(--color-teal);
  border-radius: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: var(--color-teal-dark);
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Menu Label */
.menu-label {
  padding: 12px 20px 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--label-text);
  letter-spacing: 1px;
  position: relative;
}

.sidebar.collapsed .menu-label {
  display: none;
}

/* Menu Item */
.menu-item {
  position: relative;
  margin: 0 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--menu-text);
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 14px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.sidebar.collapsed .menu-link {
  justify-content: center;
  padding: 12px;
}

/* Menu Icon */
.menu-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  color: var(--color-teal);
}

.sidebar.collapsed .menu-icon {
  font-size: 22px;
  width: auto;
}

/* Menu Text */
.menu-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  flex: 1;
}

/* Menu Badge */
.menu-badge {
  background: linear-gradient(135deg, #f56565, #ed64a6);
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}
.menu-label-icon {
    color: #24a26e;
}
/* Menu Hover Effect */
.menu-link:hover {
  background: var(--menu-bg-hover);
  color: var(--menu-text-hover);
  transform: translateX(4px);
}

.sidebar.rtl-sidebar .menu-link:hover {
  transform: translateX(-4px);
}

.menu-link:hover .menu-icon {
  transform: scale(1.1);
  color: var(--menu-text-hover);
}

/* Active Menu Item */
.menu-item.active .menu-link {
  background: var(--menu-active-bg);
  color: var(--menu-active-text);
  box-shadow: 0 4px 12px rgba(24, 178, 188, 0.3);
}

.menu-item.active .menu-icon {
  color: white;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: white;
  border-radius: 0 4px 4px 0;
}

.sidebar.rtl-sidebar .menu-item.active::before {
  left: auto;
  right: 0;
  border-radius: 4px 0 0 4px;
}

/* ========== Collapsed Styles ========== */
.sidebar.collapsed .menu-text {
  display: none;
}

.sidebar.collapsed .menu-badge {
  display: none;
}

.sidebar.collapsed .menu-label {
  display: none;
}

.sidebar.collapsed .menu-item {
  margin: 4px 8px;
}

.sidebar.collapsed .menu-item.active::before {
  left: auto;
  right: 0;
}

.sidebar.collapsed.rtl-sidebar .menu-item.active::before {
  right: auto;
  left: 0;
}

/* Tooltip on hover for collapsed mode */
.sidebar.collapsed .menu-item {
  position: relative;
}

.sidebar.collapsed .menu-item:hover .menu-text {
  display: block;
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-teal);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sidebar.collapsed.rtl-sidebar .menu-item:hover .menu-text {
  left: auto;
  right: 70px;
}

/* ========== Sidebar Footer ========== */
.sidebar-footer {
  border-top: 1px solid var(--footer-border);
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed .sidebar-footer {
  display: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--avatar-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.avatar-initials {
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--user-name);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.user-role {
  font-size: 11px;
  color: var(--user-role);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ========== Responsive Design ========== */
@media (max-width: 991.98px) {
  .sidebar {
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar.rtl-sidebar {
    transform: translateX(100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar.rtl-sidebar.collapsed {
    transform: translateX(100%);
  }

  .sidebar.collapsed .menu-text {
    display: block;
  }

  .sidebar.collapsed .menu-item:hover .menu-text {
    display: block;
    position: static;
    background: none;
    padding: 0;
    box-shadow: none;
  }
}

/* ========== Animation ========== */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item {
  animation: slideIn 0.3s ease forwards;
  animation-delay: calc(var(--index, 0) * 0.03s);
}

/* ========== Dark Mode Support ========== */
@media (prefers-color-scheme: dark) {
  .sidebar {
    --sidebar-bg: #0f172a;
    --sidebar-header-bg: #1e293b;
  }
}
</style>

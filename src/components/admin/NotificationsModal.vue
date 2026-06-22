
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">

          <!-- HEADER -->
          <div class="modal-header">
            <div class="modal-title">
              <i class="bi bi-bell"></i>
              <span>{{ t.notifications }}</span>
              <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
            </div>
            <div class="modal-actions">
              <button @click="$emit('mark-all')" class="btn-mark-all">
                <i class="bi bi-check-all"></i> {{ t.markAllRead }}
              </button>
              <button @click="$emit('close')" class="btn-close-modal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <!-- FILTERS -->
          <div class="modal-filters">
            <button
              v-for="f in filters"
              :key="f.value"
              :class="['filter-btn', { active: activeFilter === f.value }]"
              @click="activeFilter = f.value"
            >
              <i :class="f.icon"></i> {{ f.label }}
            </button>
          </div>

          <!-- BODY -->
          <div class="modal-body">
            <div v-if="filteredNotifications.length === 0" class="empty-state">
              <i class="bi bi-bell-slash"></i>
              <p>{{ t.noNotifications }}</p>
            </div>

            <div
              v-for="notif in filteredNotifications"
              :key="notif.id"
              class="notif-row"
              :class="{ unread: !notif.read_at, [`type-${notif.color}`]: true }"
              @click="$emit('read-one', notif.id)"
            >
              <div class="notif-icon-wrap" :class="`bg-${notif.color}`">
                <i :class="notif.icon"></i>
              </div>

              <div class="notif-content">
                <p class="notif-title">{{ notif.title }}</p>
                <p class="notif-message">{{ notif.message }}</p>
                <small class="notif-time">
                  <i class="bi bi-clock"></i> {{ notif.time }}
                </small>
              </div>

              <div v-if="!notif.read_at" class="unread-dot"></div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed } from 'vue'
import Sidebar from '../../translations/Sidebar'

export default {
  name: 'NotificationsModal',

  props: {
    show: Boolean,
    notifications: Array,
    unreadCount: Number,
    currentLocale: {
      type: String,
      default: 'ar'
    }
  },

  emits: ['close', 'mark-all', 'read-one'],

  setup(props) {
    const activeFilter = ref('all')

    // ✅ الترجمة بناءً على اللغة القادمة من الأب
    const t = computed(() => Sidebar[props.currentLocale])

    // ✅ الفلاتر مترجمة وتتغير مع اللغة
    const filters = computed(() => [
      { value: 'all',            label: t.value.filterAll,      icon: 'bi bi-grid' },
      { value: 'contact',        label: t.value.filterMessages,  icon: 'bi bi-envelope' },
      { value: 'low_stock',      label: t.value.filterStock,     icon: 'bi bi-exclamation-triangle' },
      { value: 'expiry_warning', label: t.value.filterExpiry,    icon: 'bi bi-clock-history' },
      { value: 'expired',        label: t.value.filterExpired,   icon: 'bi bi-calendar-x' },
    ])

    const filteredNotifications = computed(() => {
      if (activeFilter.value === 'all') return props.notifications
      return props.notifications.filter((n) => n.type === activeFilter.value)
    })

    return { activeFilter, filters, filteredNotifications, t }
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.badge {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 999px;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-mark-all {
  border: none;
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.2s;
}

.btn-mark-all:hover {
  background: #e2e8f0;
}

.btn-close-modal {
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 8px;
  transition: 0.2s;
}

.btn-close-modal:hover {
  background: #f1f5f9;
  color: #1e293b;
}

/* FILTERS */
.modal-filters {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.filter-btn {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8rem;
  white-space: nowrap;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.filter-btn.active {
  background: #18B2BC;
  color: white;
}

/* BODY */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
}

.empty-state i {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.notif-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
}

.notif-row:hover {
  background: #f8fafc;
}

.notif-row.unread {
  background: #f0f9ff;
}

.notif-row.unread:hover {
  background: #e0f2fe;
}

.notif-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  color: white;
}

.bg-info    { background: #18B2BC; }
.bg-warning { background: #f59e0b; }
.bg-danger  { background: #ef4444; }

.notif-content {
  flex: 1;
}

.notif-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0 0 3px;
  color: #1e293b;
}

.notif-message {
  font-size: 0.82rem;
  color: #475569;
  margin: 0 0 4px;
  line-height: 1.4;
}

.notif-time {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #18B2BC;
  flex-shrink: 0;
  margin-top: 6px;
}

/* TRANSITION */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

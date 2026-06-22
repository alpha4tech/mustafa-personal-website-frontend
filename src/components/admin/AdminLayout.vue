<template>
  <div class="admin-layout" :class="{ 'rtl-layout': isRtl }">
    <Navbar @toggle-sidebar-mobile="toggleSidebarMobile" :is-rtl="isRtl" />
    <Sidebar ref="sidebarRef" :is-rtl="isRtl" />
    <DeleteConfirmModal :show="show" :title="options.title"
  :message="options.message"
  :confirm-text="options.confirmText"
  :cancel-text="options.cancelText"
  @confirm="accept"
  @cancel="cancel"
/>

    <main class="content-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Navbar from '@/components/admin/Navbar.vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import { useSettings } from '@/composables/useSettings'
import { useAutoLogout } from '@/composables/useAutoLogout'
import { useConfirm } from '@/composables/useConfirm'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

const {
  show,
  options,
  accept,
  cancel
} = useConfirm()

useAutoLogout(15)

const { t, isRtl } = useSettings()
const sidebarRef = ref(null)

const toggleSidebarMobile = () => {
  if (sidebarRef.value) {
    sidebarRef.value.isSidebarOpen = !sidebarRef.value.isSidebarOpen
  }
}
provide('t', t)
provide('isRtl', isRtl)


</script>

<style>
.content-area {
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 60px;
  transition: all 0.3s ease;
  min-height: 100vh;
}

@media (min-width: 992px) {
  .content-area {
    margin-left: 250px;
  }

  .rtl-layout .content-area {
    margin-left: 0;
    margin-right: 250px;
  }
}

@media (max-width: 991px) {
  .content-area {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>

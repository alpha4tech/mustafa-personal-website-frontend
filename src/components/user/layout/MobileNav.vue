<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="mobile-overlay"
      @click="$emit('closeMobileMenu')"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <nav v-if="isOpen" class="mobile-drawer">

      <!-- Header -->
      <div class="drawer-header">
        <div class="drawer-logo">
          <img src="/public/images/logo/logo-1.png" alt="Logo" class="drawer-logo-img" />
          <span class="drawer-logo-text">{{ t.logoText }}</span>
        </div>
        <button class="close-btn" @click="$emit('closeMobileMenu')" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Divider -->
      <div class="drawer-divider"></div>

      <!-- Nav Items -->
      <div class="drawer-nav">
        <a
          v-for="(item, index) in navItems"
          :key="item.key"
          href="#"
          class="drawer-item"
          :style="{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }"
          @click.prevent="$emit('scrollTo', item.key); $emit('closeMobileMenu')"
        >
          <span class="item-icon" aria-hidden="true">
            <component :is="'svg'" v-html="item.icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </span>
          <span class="item-label">{{ t[item.key] }}</span>
          <span class="item-arrow">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>
      </div>

      <!-- Footer -->
      <div class="drawer-footer">
        <div class="drawer-divider"></div>
        <div class="footer-actions">
          <button class="lang-toggle" @click="$emit('toggleLang')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {{ isRTL ? 'English' : 'العربية' }}
          </button>
          <button class="contact-cta" @click="$emit('scrollTo', 'contact'); $emit('closeMobileMenu')">
            {{ t.contactMe || 'تواصل معي' }}
          </button>
        </div>
      </div>

    </nav>
  </Transition>
</template>

<script setup>
defineProps({
  t: Object,
  isOpen: Boolean,
  isRTL: Boolean
})

defineEmits(['scrollTo', 'closeMobileMenu', 'toggleLang'])

const navItems = [
  {
    key: 'home',
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
  },
  {
    key: 'about',
    icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  },
  {
    key: 'services',
    icon: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'
  },
  {
    key: 'portfolio',
    icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'
  },
  {
    key: 'blog',
    icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'
  },
  // {
  //   key: 'courses',
  //   icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
  // },
  // {
  //   key: 'contact',
  //   icon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>'
  // },
]
</script>

<style scoped>
/* ── Overlay ───────────────────────────────── */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 26, 96, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

/* ── Drawer ────────────────────────────────── */
.mobile-drawer {
  position: fixed;
  top: 0;
  inset-inline-end: 0;
  width: min(320px, 85vw);
  height: 100dvh;
  background: #fff;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Header ────────────────────────────────── */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.4rem;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-logo-img {
  width: 34px; height: 34px;
  object-fit: contain;
}

.drawer-logo-text {
  font-size: 0.95rem;
  font-weight: 800;
  color: #162FBB;
  letter-spacing: -0.02em;
}

.close-btn {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  background: #F0F0F0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #162FBB;
  transition: all 0.2s;
}
.close-btn:hover { background: #D0D6E5; }

/* ── Divider ───────────────────────────────── */
.drawer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #D0D6E5, transparent);
  margin: 0;
  flex-shrink: 0;
}

/* ── Nav ───────────────────────────────────── */
.drawer-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.8rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #2a2a2a;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.drawer-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(22,47,187,0.08), transparent);
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 10px;
}

.drawer-item:hover {
  color: #162FBB;
  background: rgba(22, 47, 187, 0.06);
}
.drawer-item:hover::before { opacity: 1; }

.drawer-item:hover .item-icon { color: #162FBB; }
.drawer-item:hover .item-arrow { opacity: 1; transform: translateX(3px); }

.item-icon {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  background: #F0F0F0;
  border-radius: 8px;
  color: #555;
  flex-shrink: 0;
  transition: all 0.2s;
}
.drawer-item:hover .item-icon { background: rgba(22,47,187,0.1); }

.item-label { flex: 1; }

.item-arrow {
  opacity: 0;
  color: #162FBB;
  transition: all 0.2s;
  flex-shrink: 0;
}

/* ── Footer ────────────────────────────────── */
.drawer-footer {
  flex-shrink: 0;
  padding: 0 0 1.2rem;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1rem 1.2rem 0;
}

.lang-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: 1.5px solid #D0D6E5;
  color: #162FBB;
  padding: 0.7rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-toggle:hover { border-color: #162FBB; background: rgba(22,47,187,0.05); }

.contact-cta {
  background: #162FBB;
  color: #fff;
  border: none;
  padding: 0.85rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.02em;
}
.contact-cta:hover {
  background: #E7AE18;
  color: #0e1a60;
  box-shadow: 0 6px 20px rgba(231,174,24,0.35);
}

/* ── Transitions ───────────────────────────── */
.overlay-enter-active,
.overlay-leave-active { transition: opacity 0.3s ease; }
.overlay-enter-from,
.overlay-leave-to    { opacity: 0; }

.drawer-enter-active { transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-leave-active { transition: transform 0.3s ease-in; }
.drawer-enter-from,
.drawer-leave-to     { transform: translateX(100%); }

/* RTL slide from left */
[dir="rtl"] .drawer-enter-from,
[dir="rtl"] .drawer-leave-to { transform: translateX(-100%); }

/* ── Only show on mobile ────────────────────── */
@media (min-width: 769px) {
  .mobile-overlay,
  .mobile-drawer { display: none !important; }
}
</style>

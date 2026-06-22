<template>
  <header :class="['navbar', { 'scrolled': isScrolled }]">
    <div class="navbar-accent"></div>

    <div class="navbar-inner" :style="isRTL ? 'direction: rtl' : 'direction: ltr'">

      <!-- Logo -->
      <div class="logo" @click="$emit('scrollTo', 'home')">
        <img src="/public/images/logo/logo-1.png" alt="Logo" class="logo-img" />
        <div class="logo-text-wrap">
          <span class="logo-text">{{ t.logoText }}</span>
          <span class="logo-dot"></span>
        </div>
      </div>

      <!-- Desktop Nav -->
      <nav class="nav-links">
        <a
          v-for="item in navItems"
          :key="item.key"
          href="#"
          :class="['nav-item', { active: activeSection === item.key }]"
          @click.prevent="$emit('scrollTo', item.key)"
        >
          <span class="nav-label">{{ t[item.key] }}</span>
          <span class="nav-indicator"></span>
        </a>
      </nav>

      <!-- Actions -->
      <div class="actions">
        <button
          class="lang-btn"
          @click="$emit('toggleLang')"
          :title="isRTL ? 'Switch to English' : 'التبديل إلى العربية'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span>{{ isRTL ? 'EN' : 'AR' }}</span>
        </button>

        <button class="cta-btn" @click="$emit('scrollTo', 'contact')">
          <span>{{ t.contactMe || 'تواصل معي' }}</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Hamburger - mobile only -->
        <button
          :class="['hamburger-btn', { open: isMobileMenuOpen }]"
          @click="$emit('toggleMobileMenu')"
          aria-label="Menu"
        >
          <span class="bar bar-1"></span>
          <span class="bar bar-2"></span>
          <span class="bar bar-3"></span>
        </button>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  t: Object,
  isRTL: Boolean,
  isDark: Boolean,
  isMobileMenuOpen: Boolean,
  activeSection: String
})

defineEmits(['toggleLang', 'toggleTheme', 'toggleMobileMenu', 'scrollTo'])

const isScrolled = ref(false)

const navItems = [
  { key: 'home' },
  { key: 'about' },
  { key: 'services' },
  { key: 'portfolio' },
  { key: 'blog' },
  // { key: 'courses' },
  // { key: 'contactMe' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* ── Base ───────────────────────────── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.4s ease;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Shimmer accent line */
.navbar-accent {
  height: 3px;
  background: linear-gradient(90deg, #162FBB 0%, #E7AE18 50%, #162FBB 100%);
  background-size: 200% 100%;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Inner wrapper */
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(208, 214, 229, 0.6);
  transition: all 0.4s ease;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}

.navbar.scrolled .navbar-inner {
  padding: 0.5rem 2rem;
  box-shadow: 0 4px 30px rgba(22, 47, 187, 0.08);
}

/* ── Logo ───────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
  text-decoration: none;
}
.logo-img {
  width: 40px; height: 40px;
  object-fit: contain;
  transition: transform 0.3s;
}
.logo:hover .logo-img { transform: rotate(-5deg) scale(1.05); }

.logo-text-wrap {
  display: flex;
  align-items: flex-start;
  gap: 3px;
}
.logo-text {
  font-size: 1.05rem;
  font-weight: 800;
  color: #162FBB;
  letter-spacing: -0.02em;
  line-height: 1;
}
.logo-dot {
  width: 6px; height: 6px;
  background: #E7AE18;
  border-radius: 50%;
  margin-top: 2px;
  flex-shrink: 0;
}

/* ── Nav Links ──────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
  flex-wrap: nowrap;
}

.nav-item {
  position: relative;
  text-decoration: none;
  color: #3a3a3a;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.nav-item:hover { color: #162FBB; background: rgba(22, 47, 187, 0.07); }
.nav-item.active { color: #162FBB; }

/* Gold underline indicator */
.nav-indicator {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 16px; height: 2px;
  background: #E7AE18;
  border-radius: 2px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-item:hover .nav-indicator,
.nav-item.active .nav-indicator {
  transform: translateX(-50%) scaleX(1);
}

/* ── Actions ────────────────────────── */
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Language button */
.lang-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1.5px solid #D0D6E5;
  color: #162FBB;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.lang-btn:hover { border-color: #162FBB; background: rgba(22, 47, 187, 0.05); }

/* CTA button */
.cta-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #162FBB;
  color: #fff;
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}
.cta-btn:hover {
  background: #E7AE18;
  color: #0e1a60;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(231, 174, 24, 0.35);
}
.cta-btn svg { transition: transform 0.3s; flex-shrink: 0; }
.cta-btn:hover svg { transform: translateX(4px); }

/* RTL: flip arrow direction */
[dir="rtl"] .cta-btn svg,
.rtl-arrow { transform: rotate(180deg); }
[dir="rtl"] .cta-btn:hover svg { transform: rotate(180deg) translateX(4px); }

/* Hamburger */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 38px; height: 38px;
  background: transparent;
  border: 1.5px solid #D0D6E5;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s;
  flex-shrink: 0;
}
.hamburger-btn:hover { border-color: #162FBB; background: rgba(22, 47, 187, 0.05); }

.bar {
  display: block;
  width: 18px; height: 2px;
  background: #162FBB;
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hamburger-btn.open .bar-1 { transform: translateY(7px) rotate(45deg); }
.hamburger-btn.open .bar-2 { opacity: 0; transform: scaleX(0); }
.hamburger-btn.open .bar-3 { transform: translateY(-7px) rotate(-45deg); }

/* ── Responsive ─────────────────────── */
@media (max-width: 1100px) {
  .navbar-inner { padding: 0.75rem 1.5rem; }
  .nav-item { padding: 0.45rem 0.65rem; font-size: 0.82rem; }
}

@media (max-width: 900px) {
  .nav-item { padding: 0.4rem 0.55rem; font-size: 0.78rem; }
}

@media (max-width: 768px) {
  .nav-links  { display: none; }
  .lang-btn  { display: none; }
  .cta-btn    { display: none; }
  .hamburger-btn { display: flex; }
  .navbar-inner { padding: 0.7rem 1.2rem; }
}
</style>

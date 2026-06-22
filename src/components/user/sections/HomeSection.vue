<template>
  <section id="home" class="hero-section">
    <!-- Geometric background shapes -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="container">
      <div class="hero-wrapper">
        <!-- Left Content -->
        <div class="hero-left" data-aos="fade-right" data-aos-duration="800">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span class="badge-text">{{ t.welcomeBadge }}</span>
          </div>

          <h1 class="hero-title">
            {{ t.heroTitlePrefix }}
            <span class="highlight-wrapper">
              <span class="highlight">{{ t.heroName }}</span>
              <svg class="underline-svg" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path
                  d="M0,8 Q50,2 100,8 Q150,14 200,8"
                  stroke="#E7AE18"
                  stroke-width="3"
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
            </span>
          </h1>

          <div class="hero-role">
            <span class="role-label">{{ t.iAm }}</span>
            <div class="role-wrapper">
              <span class="role-text">{{ currentRole }}</span>
              <span class="cursor" :class="{ typing: isTyping }"></span>
            </div>
          </div>

          <p class="hero-description">{{ t.heroDescription }}</p>

          <div class="hero-buttons">
            <button class="btn-primary" @click="$emit('scrollTo', 'contact')">
              <span>{{ t.contactMe }}</span>
              <span class="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
            <button class="btn-secondary" @click="$emit('scrollTo', 'portfolio')">
              <span>{{ t.viewWork }}</span>
              <span class="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3v10M4 9l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div class="hero-stats">
            <div class="stat-item" data-aos="fade-up" data-aos-delay="100">
              <div class="stat-number">
                <CountUp :end="Number(experienceYears)" />
                <span class="stat-plus">+</span>
              </div>

              <div class="stat-label">{{ t.yearsLabel }}</div>
            </div>

            <div class="stat-divider"></div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="200">
              <div class="stat-number">
                <CountUp :end="t.projectsCompleted" /><span class="stat-plus">+</span>
              </div>
              <div class="stat-label">{{ t.projectsLabel }}</div>
            </div>

            <div class="stat-divider"></div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="300">
              <div class="stat-number">
                <CountUp :end="t.happyClients" /><span class="stat-plus">+</span>
              </div>
              <div class="stat-label">{{ t.clientsLabel }}</div>
            </div>
          </div>
        </div>

        <!-- Right Image -->
        <div class="hero-right" data-aos="fade-left" data-aos-duration="800">
          <div class="image-container">
            <!-- Rotating ring -->
            <div class="ring ring-outer"></div>
            <div class="ring ring-inner"></div>

            <!-- Corner accent squares -->
            <div class="corner-accent top-left"></div>
            <div class="corner-accent top-right"></div>
            <div class="corner-accent bottom-left"></div>
            <div class="corner-accent bottom-right"></div>

            <!-- Gold arc badge -->
            <div class="arc-badge">
              <svg viewBox="0 0 120 120" class="arc-svg">
                <defs>
                  <path id="arc-path" d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                </defs>
                <text font-size="10" fill="#E7AE18" font-family="sans-serif" letter-spacing="3">
                  <textPath href="#arc-path">{{ t.goldArcBadge }}</textPath>
                </text>
              </svg>
            </div>

            <!-- Image frame -->
            <div class="image-frame">
              <img :src="heroImage" alt="Mustafa Hasbsido" class="hero-image" />
              <div class="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator" @click="$emit('scrollTo', 'about')">
      <div class="scroll-line"></div>
      <span class="scroll-text">{{ t.scroll }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

import myImage from '@/assets/images/hero-1.png'
import CountUp from '@/components/common/CountUp.vue'

const props = defineProps({ t: Object })
defineEmits(['scrollTo'])

const heroImage = ref(myImage)

const roles = computed(() => {
  if (props.t.welcomeBadge === 'مرحباً بك في عالمي') {
    return ['صانع محتوى', 'أخصائي التسويق عبر مواقع التواصل الإجتماعي', 'أخصائي تسويق']
  }
  return ['Marketing Specialist', 'Social Media Marketing Specialist', 'Content Creator']
})

// incraze experience years
const experienceYears = computed(() => {
  return new Date().getFullYear() - 2024 + 1
})

const currentRole = ref('')
const roleIndex = ref(0)
const charIndex = ref(0)
const isTyping = ref(true)
const isDeleting = ref(false)

const typeEffect = () => {
  if (!roles.value.length) return
  const full = roles.value[roleIndex.value]
  if (!isDeleting.value && charIndex.value <= full.length) {
    currentRole.value = full.substring(0, charIndex.value++)
    isTyping.value = true
    setTimeout(typeEffect, 100)
  } else if (!isDeleting.value && charIndex.value > full.length) {
    isTyping.value = false
    setTimeout(() => {
      isDeleting.value = true
      typeEffect()
    }, 2000)
  } else if (isDeleting.value && charIndex.value >= 0) {
    currentRole.value = full.substring(0, charIndex.value--)
    isTyping.value = true
    setTimeout(typeEffect, 50)
  } else {
    isDeleting.value = false
    roleIndex.value = (roleIndex.value + 1) % roles.value.length
    charIndex.value = 0
    setTimeout(typeEffect, 100)
  }
}

onMounted(() => setTimeout(typeEffect, 600))

watch(
  () => props.t,
  () => {
    currentRole.value = ''
    roleIndex.value = 0
    charIndex.value = 0
    isTyping.value = true
    isDeleting.value = false
    setTimeout(typeEffect, 500)
  },
)
</script>

<style scoped>
/* ─── CSS Variables ─────────────────────────────────── */
:root {
  --blue: #162fbb;
  --gold: #e7ae18;
  --bg: #f0f0f0;
  --neutral: #d0d6e5;
  --blue-dark: #0e1f8a;
  --gold-light: #f5c842;
}

/* ─── Section ────────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1a6b 0%, #162fbb 50%, #1a3acc 100%);
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 120px 0 80px;
}

/* ─── Geometric Background ──────────────────────────── */
.bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
  background: #fff;
}
.shape-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -150px;
  animation: drift 18s ease-in-out infinite;
}
.shape-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  animation: drift 22s ease-in-out infinite reverse;
}
.shape-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  left: 40%;
  opacity: 0.04;
  animation: drift 14s ease-in-out infinite 3s;
}
.shape-4 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 20%;
  background: #e7ae18;
  opacity: 0.05;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 12s ease-in-out infinite;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-15px, 20px);
  }
}
@keyframes morph {
  0%,
  100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
  50% {
    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
  }
}

/* ─── Container ─────────────────────────────────────── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.hero-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

/* ─── Left ───────────────────────────────────────────── */
.hero-left {
  color: #fff;
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(231, 174, 24, 0.15);
  border: 1px solid rgba(231, 174, 24, 0.4);
  padding: 0.45rem 1.1rem;
  border-radius: 50px;
  margin-bottom: 1.8rem;
  animation: fadeUp 0.6s both;
}
.badge-dot {
  width: 8px;
  height: 8px;
  background: #e7ae18;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(231, 174, 24, 0.6);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(231, 174, 24, 0);
  }
}
.badge-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e7ae18;
  letter-spacing: 0.05em;
}

/* Title */
.hero-title {
  font-size: clamp(2.4rem, 4.5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.2rem;
  animation: fadeUp 0.6s 0.1s both;
  letter-spacing: -0.02em;
}
.highlight-wrapper {
  position: relative;
  display: inline-block;
}
.highlight {
  color: #e7ae18;
}
.underline-svg {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 12px;
  overflow: visible;
}
.underline-svg path {
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  animation: draw-line 1s ease-out 0.8s forwards;
}
@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

/* Role */
.hero-role {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.6rem;
  font-size: 1.2rem;
  animation: fadeUp 0.6s 0.2s both;
}
.role-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}
.role-wrapper {
  display: flex;
  align-items: center;
}
.role-text {
  font-weight: 700;
  color: #e7ae18;
  min-width: 2ch;
}
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: #e7ae18;
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}
.cursor.typing {
  animation: blink 0.5s step-end infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* Description */
.hero-description {
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.78);
  margin-bottom: 2.2rem;
  max-width: 480px;
  animation: fadeUp 0.6s 0.3s both;
}

/* Buttons */
.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  animation: fadeUp 0.6s 0.4s both;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.8rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  letter-spacing: 0.02em;
}

.btn-primary {
  background: #e7ae18;
  color: #0e1a60;
}
.btn-primary:hover {
  background: #f5c842;
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(231, 174, 24, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-3px);
}

.btn-arrow {
  display: flex;
  align-items: center;
  transition: transform 0.3s;
}
.btn-primary:hover .btn-arrow,
.btn-secondary:hover .btn-arrow {
  transform: translateX(4px);
}

/* Stats */
.hero-stats {
  display: flex;
  gap: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  animation: fadeUp 0.6s 0.5s both;
}
.stat-item {
  text-align: center;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}
.stat-plus {
  color: #e7ae18;
  font-size: 1.4rem;
}
.stat-label {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
  align-self: stretch;
}

/* ─── Right ─────────────────────────────────────────── */
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  position: relative;
  width: 380px;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Rotating rings */
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px dashed rgba(231, 174, 24, 0.35);
}
.ring-outer {
  width: 380px;
  height: 380px;
  animation: spin 30s linear infinite;
}
.ring-inner {
  width: 300px;
  height: 300px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.1);
  animation: spin 20s linear infinite reverse;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Corner accents */
.corner-accent {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: #e7ae18;
  border-style: solid;
  z-index: 4;
}
.top-left {
  top: 30px;
  left: 30px;
  border-width: 2px 0 0 2px;
}
.top-right {
  top: 30px;
  right: 30px;
  border-width: 2px 2px 0 0;
}
.bottom-left {
  bottom: 30px;
  left: 30px;
  border-width: 0 0 2px 2px;
}
.bottom-right {
  bottom: 30px;
  right: 30px;
  border-width: 0 2px 2px 0;
}

/* Arc badge */
.arc-badge {
  position: absolute;
  width: 120px;
  height: 120px;
  top: -10px;
  right: -10px;
  z-index: 5;
  animation: spin 20s linear infinite;
}
.arc-svg {
  width: 100%;
  height: 100%;
}

/* Image frame */
.image-frame {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 3;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 0 0 8px rgba(22, 47, 187, 0.4),
    0 20px 60px rgba(0, 0, 0, 0.4);
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.image-frame:hover .hero-image {
  transform: scale(1.06);
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(14, 26, 107, 0.4) 100%);
}

/* Floating cards */
.float-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 6;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  min-width: 140px;
}
.float-top {
  top: 10px;
  left: -20px;
  animation: floatY 4s ease-in-out infinite;
}
.float-bottom {
  bottom: 30px;
  right: -20px;
  animation: floatY 4s ease-in-out infinite 2s;
}

@keyframes floatY {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.float-num {
  display: block;
  font-size: 1rem;
  font-weight: 800;
  color: #162fbb;
  line-height: 1;
}
.float-lbl {
  display: block;
  font-size: 0.7rem;
  color: #888;
  margin-top: 2px;
  white-space: nowrap;
}

/* ─── Scroll Indicator ──────────────────────────────── */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 2;
  opacity: 0.7;
  transition: opacity 0.3s;
}
.scroll-indicator:hover {
  opacity: 1;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #e7ae18);
  position: relative;
  overflow: hidden;
}
.scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  animation: scroll-flow 2s ease-in-out infinite;
}
@keyframes scroll-flow {
  0% {
    top: -100%;
  }
  100% {
    top: 100%;
  }
}
.scroll-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* ─── RTL ────────────────────────────────────────────── */
[dir='rtl'] .hero-buttons {
  flex-direction: row-reverse;
}
[dir='rtl'] .hero-stats {
  flex-direction: row-reverse;
}
[dir='rtl'] .float-top {
  left: auto;
  right: -20px;
}
[dir='rtl'] .float-bottom {
  right: auto;
  left: -20px;
}

/* ─── Animations ────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── Responsive ────────────────────────────────────── */
@media (max-width: 992px) {
  .hero-wrapper {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    text-align: center;
  }
  .hero-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-description {
    max-width: 100%;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-stats {
    justify-content: center;
  }
  .hero-role {
    justify-content: center;
  }
  .image-container {
    width: 300px;
    height: 300px;
  }
  .ring-outer {
    width: 300px;
    height: 300px;
  }
  .ring-inner {
    width: 240px;
    height: 240px;
  }
  .image-frame {
    width: 210px;
    height: 210px;
  }
  .float-top {
    left: -10px;
  }
  .float-bottom {
    right: -10px;
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 100px 0 70px;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-role {
    font-size: 1rem;
  }
  .hero-stats {
    gap: 1.5rem;
  }
  .stat-number {
    font-size: 1.5rem;
  }
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  .image-container {
    width: 260px;
    height: 260px;
  }
  .ring-outer {
    width: 260px;
    height: 260px;
  }
  .ring-inner {
    width: 200px;
    height: 200px;
  }
  .image-frame {
    width: 180px;
    height: 180px;
  }
  .float-card {
    min-width: 120px;
    padding: 8px 10px;
  }
  .arc-badge {
    width: 90px;
    height: 90px;
  }
}
</style>

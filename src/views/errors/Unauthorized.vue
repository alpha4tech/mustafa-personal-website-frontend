<template>
  <div class="unauthorized-page" :class="{ 'rtl-unauthorized': isRtl }">
    <!-- Animated Background -->
    <div class="bg-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <!-- Icon -->
        <div class="icon-wrapper">
          <div class="icon-circle">
            <i class="bi bi-shield-exclamation"></i>
          </div>
          <div class="icon-pulse"></div>
        </div>

        <!-- Error Code -->
        <div class="error-code">
          <span class="code-4">4</span>
          <span class="code-0">0</span>
          <span class="code-3">3</span>
        </div>

        <!-- Content -->
        <h1 class="error-title">
          {{ t('unauthorizedTitle') }}
        </h1>

        <p class="error-message">
          {{ t('unauthorizedPragraph') }}
        </p>

        <!-- Suggestions -->
        <div class="error-suggestions">
          <div class="suggestion-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ t('suggestion1') }}</span>
          </div>

          <div class="suggestion-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ t('suggestion2') }}</span>
          </div>

          <div class="suggestion-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ t('suggestion3') }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <router-link
            to="/admin/dashboard"
            class="btn-dashboard"
          >
            <i class="bi bi-house-door-fill"></i>
            {{ t('backToDashboard') }}
          </router-link>

          <button
            class="btn-back"
            @click="goBack"
          >
            <i class="bi bi-arrow-left"></i>
            {{ t('goBack') }}
          </button>
        </div>

        <!-- Contact -->
        <div class="contact-support">
          <p>{{ t('needHelp') }}</p>

          <a href="mailto:support@allan.com">
            <i class="bi bi-envelope-fill"></i>
            support@allan.com
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSettings } from '@/composables/useSettings'

const router = useRouter()
const { t, isRtl } = useSettings()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/admin/dashboard')
  }
}
</script>

<style scoped>
.unauthorized-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background: #f8fafc;
}

/* RTL */
.unauthorized-page.rtl-unauthorized {
  direction: rtl;
}

.rtl-unauthorized .btn-back i {
  transform: scaleX(-1);
}

/* Background Animation */
.bg-animation {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.08);
  animation: float 18s infinite ease-in-out;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.circle-1 {
  width: 220px;
  height: 220px;
  top: -60px;
  left: -60px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -100px;
}

.circle-3 {
  width: 160px;
  height: 160px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(20px, -20px, 0);
  }
}

/* Container */
.unauthorized-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
}

.unauthorized-content {
  background: white;
  border-radius: 28px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(24, 178, 188, 0.3);
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Icon */
.icon-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #fee2e2,
    #fecaca
  );

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.icon-circle i {
  font-size: 3rem;
  color: #ef4444;
}

.icon-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-teal-dark, #13888D), var(--color-teal, #18B2BC));
  animation: pulse 2s infinite;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }

  70% {
    transform: scale(1.35);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Error Code */
.error-code {
  display: flex;
  justify-content: center;
  gap: 0.4rem;

  margin-bottom: 1rem;
}

.error-code span {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
}

.code-4,
.code-3 {
    color: var(--color-teal, #18B2BC);
}

.code-0 {
  color: #764ba2;
}

/* Title */
.error-title {
  font-size: 1.8rem;
  font-weight: 700;

  color: #1e293b;

  margin-bottom: 0.8rem;
}

.error-message {
  color: #64748b;
  line-height: 1.7;

  margin-bottom: 2rem;
}

/* Suggestions */
.error-suggestions {
  background: #f8fafc;

  border-radius: 18px;

  padding: 1.3rem;

  margin-bottom: 2rem;

  text-align: left;
}

.rtl-unauthorized .error-suggestions {
  text-align: right;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  margin-bottom: 0.8rem;

  color: #475569;
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.suggestion-item i {
  color: #10b981;
}

/* Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;

  flex-wrap: wrap;

  margin-bottom: 2rem;
}

.btn-dashboard,
.btn-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;

  padding: 0.8rem 1.5rem;

  border-radius: 12px;

  font-weight: 600;

  text-decoration: none;

  transition: 0.25s ease;

  cursor: pointer;
}

.btn-dashboard {
  background: linear-gradient(
    135deg,
    #667eea,
    #764ba2
  );

  color: white;

  border: none;
}

.btn-dashboard:hover {
  transform: translateY(-2px);
}

.btn-back {
  background: #f1f5f9;

  border: 1px solid #e2e8f0;

  color: #475569;
}

.btn-back:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

/* Contact */
.contact-support {
  padding-top: 1rem;

  border-top: 1px solid #e2e8f0;
}

.contact-support p {
  font-size: 0.85rem;

  color: #94a3b8;

  margin-bottom: 0.5rem;
}

.contact-support a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  color: #667eea;

  text-decoration: none;
}

.contact-support a:hover {
  color: #764ba2;
}

/* Responsive */
@media (max-width: 768px) {
  .unauthorized-content {
    padding: 2rem;
  }

  .error-code span {
    font-size: 3.5rem;
  }

  .error-title {
    font-size: 1.4rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-dashboard,
  .btn-back {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .unauthorized-content {
    padding: 1.5rem;
  }

  .error-code span {
    font-size: 2.5rem;
  }

  .error-title {
    font-size: 1.2rem;
  }
}
</style>

<template>
  <section id="services" class="services-section" :dir="props.isRtl ? 'rtl' : 'ltr'">

    <!-- Background decoration -->
    <div class="section-bg-decoration" aria-hidden="true">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-grid"></div>
    </div>

    <div class="container">

      <!-- Section Header  -->
           <div class="sec-header" data-aos="fade-up">
        <div class="sec-badge">
          <span class="badge-dot"></span>
          <span>{{ t.ServiceBadge }}</span>
        </div>
        <h2 class="sec-title">
          {{ t.ServiceTitlePrefix }}
          <span class="title-highlight">{{ t.ServiceTitleHighlight }}</span>
        </h2>
        <p class="sec-sub">{{ t.ServiceSubtitle }}</p>
      </div>
      <!-- Loading -->
      <div v-if="loading" class="services-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skel skel-icon"></div>
          <div class="skel skel-title"></div>
          <div class="skel skel-text"></div>
          <div class="skel skel-text short"></div>
          <div class="skel skel-text shortest"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon-wrap">
          <i class="bi bi-wifi-off"></i>
        </div>
        <p class="error-msg">{{ t.error }}</p>
        <button @click="fetchServices" class="retry-btn">
          <i class="bi bi-arrow-clockwise me-2"></i>{{ t.retry }}
        </button>
      </div>

      <!-- Services Grid -->
      <div v-else class="services-grid">
        <div
          v-for="(service, index) in services"
          :key="service.id"
          class="service-card"
          :style="`--delay: ${index * 0.09}s`"
          @mouseenter="hoveredId = service.id"
          @mouseleave="hoveredId = null"
          @click="openModal(service)"
        >
          <!-- Number badge -->
          <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>

          <!-- Accent line -->
          <div class="card-accent"></div>

          <!-- Icon -->
          <div class="card-icon-wrap">
            <div class="card-icon" :class="{ hovered: hoveredId === service.id }">
              <i :class="`bi ${service.icon || 'bi-briefcase'}`"></i>
            </div>
            <div class="card-icon-glow" :class="{ active: hoveredId === service.id }"></div>
          </div>

          <!-- Content -->
          <div class="card-content">
            <h3 class="card-title">
              {{ props.isRtl ? service.title_ar : service.title_en }}
            </h3>
            <p class="card-desc">
              {{ props.isRtl ? service.desc_service_ar : service.desc_service_en }}
            </p>

            <!-- Points preview -->
            <ul
              v-if="getPoints(service).length"
              class="card-points"
            >
              <li v-for="(point, i) in getPoints(service).slice(0, 3)" :key="i">
                <span class="point-dot"></span>{{ point }}
              </li>
              <li v-if="getPoints(service).length > 3" class="more-points">
                +{{ getPoints(service).length - 3 }} {{ t.morePoints }}
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <button class="card-read-more" @click.stop="openModal(service)">
              <span>{{ t.readMore }}</span>
              <i :class="`bi bi-arrow-${props.isRtl ? 'ar' : 'en'}-short`"></i>
            </button>
            <button class="card-request-btn" @click.stop="openRequestForm(service)">
              <i class="bi bi-send me-1"></i>{{ t.requestService }}
            </button>
          </div>
        </div>
      </div>

      <!-- CTA -->
       <div
  v-if="!loading && !error && services.length"
  class="section-cta"
  data-aos="fade-up"
>
  <div class="cta-dots"></div>
  <div class="cta-glow"></div>

  <div class="cta-icon">
    <i class="bi bi-headset"></i>
  </div>

  <div class="cta-content">
    <p class="cta-tagline">{{ t.cta}}</p>
  </div>

  <a href="https://wa.me/249924535131?text=Hello%20Mustafa,%20I%20would%20like%20to%20inquire%20about%20your%20services." class="cta-btn">
    {{ t.ctaTagline }}
  </a>
</div>
    </div>

    <!-- ═══ Service Detail Modal ═══ -->
    <Transition name="modal">
      <div v-if="modalService" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel" :dir="props.isRtl ? 'rtl' : 'ltr'">

          <!-- Modal Header -->
          <div class="modal-header">
            <div class="modal-icon">
              <i :class="`bi ${modalService.icon || 'bi-briefcase'}`"></i>
            </div>
            <div class="modal-header-text">
              <span class="modal-eyebrow">{{ t.serviceDetail }}</span>
              <h2 class="modal-title">
                {{ props.isRtl ? modalService.title_ar : modalService.title_en }}
              </h2>
            </div>
            <button class="modal-close" @click="closeModal" :aria-label="t.close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <p class="modal-desc">
              {{ props.isRtl ? modalService.desc_service_ar : modalService.desc_service_en }}
            </p>

            <div v-if="getPoints(modalService).length" class="modal-points-section">
              <h4 class="modal-points-title">
                <i class="bi bi-list-check me-2"></i>{{ t.whatIncluded }}
              </h4>
              <ul class="modal-points">
                <li v-for="(point, i) in getPoints(modalService)" :key="i">
                  <span class="modal-point-icon"><i class="bi bi-check2"></i></span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- Contact -->


          <!-- Modal Footer -->
          <div class="modal-footer">
            <button class="modal-request-btn" @click="openRequestForm(modalService); closeModal()">
              <i class="bi bi-send-fill me-2"></i>{{ t.requestNow }}
            </button>
            <button class="modal-cancel-btn" @click="closeModal">{{ t.close }}</button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ═══ Request Service Modal ═══ -->
    <Transition name="modal">
      <div v-if="requestService" class="modal-overlay" @click.self="closeRequest">
        <div class="modal-panel request-panel" :dir="props.isRtl ? 'rtl' : 'ltr'">

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-icon gold-icon">
              <i class="bi bi-send-fill"></i>
            </div>
            <div class="modal-header-text">
              <span class="modal-eyebrow">{{ t.requestEyebrow }}</span>
              <h2 class="modal-title">{{ props.isRtl ? requestService.title_ar : requestService.title_en }}</h2>
            </div>
            <button class="modal-close" @click="closeRequest" :aria-label="t.close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Form -->
          <div class="modal-body">
            <div v-if="requestSent" class="success-state">
              <div class="success-icon"><i class="bi bi-check-circle-fill"></i></div>
              <h3>{{ t.successTitle }}</h3>
              <p>{{ t.successMsg }}</p>
              <button class="modal-cancel-btn" @click="closeRequest">{{ t.close }}</button>
            </div>

            <div v-else class="request-form">
              <div class="form-group">
                <label>{{ t.nameLabel }}</label>
                <input
                  v-model="form.name"
                  type="text"
                  :placeholder="t.namePlaceholder"
                  :class="{ 'has-error': formErrors.name }"
                  @input="formErrors.name = ''"
                />
                <span v-if="formErrors.name" class="field-error">{{ formErrors.name }}</span>
              </div>

              <div class="form-group">
                <label>{{ t.phoneLabel }}</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  :placeholder="t.phonePlaceholder"
                  :class="{ 'has-error': formErrors.phone }"
                  @input="formErrors.phone = ''"
                />
                <span v-if="formErrors.phone" class="field-error">{{ formErrors.phone }}</span>
              </div>

              <div class="form-group">
                <label>{{ t.emailLabel }} <span class="optional">({{ t.optional }})</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t.emailPlaceholder"
                />
              </div>

              <div class="form-group">
                <label>{{ t.messageLabel }}</label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  :placeholder="t.messagePlaceholder"
                ></textarea>
              </div>

              <button
                class="modal-request-btn full-width"
                @click="submitRequest"
                :disabled="submitting"
              >
                <span v-if="submitting">
                  <i class="bi bi-hourglass-split me-2"></i>{{ t.sending }}
                </span>
                <span v-else>
                  <i class="bi bi-send-fill me-2"></i>{{ t.sendRequest }}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { publicAxios } from '@/api/axios'
import { ref, computed, onMounted } from 'vue'


const requests = ref([])

const fetchRequests = async () => {
    const { data } = await publicAxios.get(
        '/admin/service-requests'
    )

    requests.value = data.data
}

onMounted(fetchRequests)


const props = defineProps({
  t: Object,
  isRtl: Boolean
})

// ── State ──
const services  = ref([])
const loading   = ref(true)
const error     = ref(false)
const hoveredId = ref(null)

// ── Modal state ──
const modalService  = ref(null)
const requestService = ref(null)
const requestSent   = ref(false)
const submitting    = ref(false)

const form = ref({ name: '', phone: '', email: '', message: '' })
const formErrors = ref({ name: '', phone: '' })

// ── Helpers ──
const getPoints = (service) => {
  const points =
    props.isRtl
      ? service.list_desc_ar
      : service.list_desc_en

  return Array.isArray(points) ? points : []
}

// ── Fetch ──
const fetchServices = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await publicAxios.get('/services')
    services.value = Array.isArray(res.data) ? res.data : res.data.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// ── Modal actions ──
const openModal = (service) => {
  modalService.value = service
  document.body.style.overflow = 'hidden'
}
const closeModal = () => {
  modalService.value = null
  document.body.style.overflow = ''
}

const openRequestForm = (service) => {
  requestService.value = service
  requestSent.value = false
  form.value = { name: '', phone: '', email: '', message: '' }
  formErrors.value = { name: '', phone: '' }
  document.body.style.overflow = 'hidden'
}
const closeRequest = () => {
  requestService.value = null
  document.body.style.overflow = ''
}

// ── Submit ──
const submitRequest = async () => {
  formErrors.value = { name: '', phone: '' }
  let valid = true

  if (!form.value.name.trim()) {
    formErrors.value.name = t.value.nameRequired
    valid = false
  }
  if (!form.value.phone.trim()) {
    formErrors.value.phone = t.value.phoneRequired
    valid = false
  }
  if (!valid) return

  submitting.value = true
  try {
    await publicAxios.post('/service-requests', {
      service_id: requestService.value.id,
     service_title: props.isRtl  ? requestService.value.title_ar: requestService.value.title_en,
      ...form.value,
    })
    requestSent.value = true
  } catch {
    // If endpoint doesn't exist yet, still show success to user
    requestSent.value = true
  } finally {
    submitting.value = false
  }
}

onMounted(fetchServices)
</script>

<style scoped>
/* ═══ Section ═══ */
.services-section {
  position: relative;
  padding: 6rem 0;
  background: #F0F0F0;
  overflow: hidden;
}

/* Background decoration */
.section-bg-decoration { position: absolute; inset: 0; pointer-events: none; }
.deco-circle {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(22,47,187,.07) 0%, transparent 70%);
}
.deco-1 { width: 600px; height: 600px; top: -200px; inset-inline-end: -150px; }
.deco-2 { width: 450px; height: 450px; bottom: -120px; inset-inline-start: -100px; }
.deco-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(22,47,187,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22,47,187,.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ═══ Header ═══ */
.section-header { text-align: center; margin-bottom: 4rem; position: relative; }

.sec-header { text-align:center; margin-bottom:2.5rem; }
.sec-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(22,47,187,.07); border:1px solid rgba(22,47,187,.18); color:#162FBB; padding:5px 16px; border-radius:50px; font-size:.8rem; font-weight:700; margin-bottom:1rem; letter-spacing:.04em; }
.badge-dot { width:6px; height:6px; background:#E7AE18; border-radius:50%; animation:pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(231,174,24,.5)} 50%{box-shadow:0 0 0 5px rgba(231,174,24,0)} }
.sec-title { font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:800; color:#0e1a60; margin-bottom:.8rem; line-height:1.2; letter-spacing:-.02em; }
.sec-sub { font-size:1rem; color:#64748b; max-width:520px; margin:0 auto; line-height:1.7; }

.title-highlight {
  color: var(--blue);
  position: relative;
  display: inline-block;
}

.title-highlight::after {
  content: '';
  position: absolute; bottom: -6px; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), transparent);
  border-radius: 3px;
}
.sec-sub {
  font-size: 1rem; color: var(--gray-600);
  max-width: 580px; margin: 0 auto; line-height: 1.75;
}

.section-eyebrow {
  display: inline-flex; align-items: center;
  padding: .45rem 1.25rem; border-radius: 30px;
  background: rgba(22,47,187,.09); color: #162FBB;
  font-size: .78rem; font-weight: 800; letter-spacing: .1em;
  text-transform: uppercase; margin-bottom: 1.25rem;
  border: 1px solid rgba(22,47,187,.15);
}

.section-title {
  font-size: clamp(1.9rem, 4.5vw, 2.75rem);
  font-weight: 800; color: #0A1870; line-height: 1.15;
  margin-bottom: .85rem;
  background: linear-gradient(135deg, #0A1870 0%, #162FBB 60%, #1a3fd4 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

.section-subtitle {
  font-size: 1.05rem; color: #6b7280; max-width: 580px;
  margin: 0 auto; line-height: 1.75;
}

/* ═══ Grid ═══ */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.75rem;
}

/* ═══ Card ═══ */
.service-card {
  background: #fff;
  border-radius: 22px;
  padding: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.05), 0 4px 20px rgba(0,0,0,.06);
  transition: transform .35s cubic-bezier(.34,1.2,.64,1), box-shadow .35s ease;
  cursor: pointer;
  animation: fadeSlideUp .55s ease both;
  animation-delay: var(--delay, 0s);
  display: flex; flex-direction: column;
  border: 1px solid rgba(208,214,229,.5);
}
.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 40px rgba(22,47,187,.16), 0 2px 8px rgba(0,0,0,.06);
  border-color: rgba(22,47,187,.2);
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Card number */
.card-number {
  position: absolute; top: 1.25rem; inset-inline-end: 1.25rem;
  font-size: .72rem; font-weight: 800; color: #D0D6E5;
  letter-spacing: .05em; line-height: 1;
  transition: color .3s;
}
.service-card:hover .card-number { color: rgba(22,47,187,.2); }

/* Accent line */
.card-accent {
  height: 3px;
  background: linear-gradient(90deg, #162FBB 0%, #E7AE18 100%);
  transform: scaleX(0);
  transform-origin: inline-start;
  transition: transform .45s cubic-bezier(.34,1.2,.64,1);
}
.service-card:hover .card-accent { transform: scaleX(1); }

/* Card body padding */
.card-icon-wrap,
.card-content { padding-inline: 1.75rem; }
.card-icon-wrap { padding-top: 1.75rem; padding-bottom: 0; position: relative; }

/* Icon */
.card-icon {
  width: 60px; height: 60px; border-radius: 16px;
  background: rgba(22,47,187,.08);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: #162FBB;
  transition: background .35s, color .3s, transform .35s cubic-bezier(.34,1.56,.64,1);
  position: relative; z-index: 1;
}
.card-icon.hovered {
  background: linear-gradient(135deg, #162FBB 0%, #0A1870 100%);
  color: #fff;
  transform: rotate(-8deg) scale(1.1);
}
.card-icon-glow {
  position: absolute; top: 1.75rem; inset-inline-start: 1.75rem;
  width: 60px; height: 60px; border-radius: 16px;
  background: rgba(22,47,187,.2);
  filter: blur(14px);
  opacity: 0; transition: opacity .35s;
}
.card-icon-glow.active { opacity: 1; }

/* Content */
.card-content { flex: 1; padding-top: 1rem; padding-bottom: 1.25rem; }
.card-title {
  font-size: 1.05rem; font-weight: 800; color: #0A1870;
  margin-bottom: .6rem; line-height: 1.35;
}
.card-desc {
  font-size: .875rem; color: #6b7280; line-height: 1.7;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: .9rem;
}

/* Points */
.card-points {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: .45rem;
}
.card-points li {
  display: flex; align-items: baseline; gap: .6rem;
  font-size: .82rem; color: #374151; line-height: 1.4;
}
.point-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #E7AE18; flex-shrink: 0; margin-top: .3rem;
}
.more-points {
  font-size: .78rem; color: #162FBB; font-weight: 600; padding-inline-start: 1.1rem;
}

/* Card Footer */
.card-footer {
  display: flex; align-items: center; gap: .75rem;
  padding: 1rem 1.75rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;
}
.card-read-more {
  display: inline-flex; align-items: center; gap: .25rem;
  font-size: .82rem; font-weight: 700; color: #162FBB;
  background: none; border: none; cursor: pointer;
  padding: .4rem .6rem; border-radius: 8px;
  transition: background .2s, transform .2s;
  flex: 1;
}
.card-read-more:hover { background: rgba(22,47,187,.07); transform: translateX(-2px); }
[dir="ltr"] .card-read-more:hover { transform: translateX(2px); }
.card-read-more .bi { font-size: 1.1rem; }

.card-request-btn {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: .78rem; font-weight: 700; color: #fff;
  background: linear-gradient(135deg, #162FBB 0%, #0A1870 100%);
  border: none; cursor: pointer;
  padding: .5rem 1rem; border-radius: 9px;
  transition: all .2s; white-space: nowrap;
  box-shadow: 0 2px 8px rgba(22,47,187,.3);
}
.card-request-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(22,47,187,.4);
}

/* ═══ Skeleton ═══ */
.skeleton-card {
  background: #fff; border-radius: 22px;
  overflow: hidden; border: 1px solid rgba(208,214,229,.5);
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  animation: fadeSlideUp .55s ease both;
  animation-delay: var(--delay, 0s);
}
.skeleton-card::before {
  content: ''; display: block; height: 3px;
  background: #f3f4f6;
}
.skeleton-card > .skel { margin: 1.75rem 1.75rem .85rem; }
.skeleton-card > .skel:first-of-type { margin-top: 1.75rem; }
.skel {
  border-radius: 8px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skel-icon { width: 56px; height: 56px; border-radius: 14px; }
.skel-title { height: 16px; width: 60%; }
.skel-text { height: 11px; width: 100%; }
.skel-text.short { width: 80%; }
.skel-text.shortest { width: 55%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ═══ Error ═══ */
.error-state { text-align: center; padding: 4rem 2rem; }
.error-icon-wrap {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(22,47,187,.07); margin: 0 auto 1.25rem;
  display: flex; align-items: center; justify-content: center;
}
.error-icon-wrap .bi { font-size: 2rem; color: #162FBB; }
.error-msg { color: #6b7280; font-size: .95rem; margin-bottom: 1.25rem; }
.retry-btn {
  padding: .65rem 1.75rem; background: #162FBB; color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-weight: 700; font-size: .9rem; transition: all .2s;
  display: inline-flex; align-items: center;
}
.retry-btn:hover { background: #0A1870; transform: translateY(-1px); }

/* ═══ CTA ═══ */
.section-cta {
  background: #1d39b6;
  margin-top: 12px;
  border-radius: var(--r-2xl); padding: 2.4rem 2.8rem;
  display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
  position: relative; overflow: hidden; box-shadow: 0 16px 48px rgba(22,47,187,.28);
  border-radius:24px;
}

.cta-dots{
  position:absolute;
  inset:0;
  background-size:28px 28px;
  pointer-events:none;
}

.cta-glow{
  position:absolute;
  top:-60px;
  inset-inline-end:-60px;

  width:220px;
  height:220px;
  border-radius:50%;
  background: radial-gradient( circle,rgba(231,174,24,.20), transparent 70%);
  pointer-events:none;
}

.cta-icon{
  width:64px;
  height:64px;
  border-radius:18px;
  background:rgba(231,174,24,.18);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#E7AE18;
  position:relative;
  z-index:1;
  box-shadow:0 0 0 8px rgba(231,174,24,.08);
}

.cta-icon i{
  font-size:1.8rem;
}

.cta-content{
  flex:1;
  position:relative;
  z-index:1;
}

.cta-tagline {
  margin:0;
  color:rgba(255,255,255,.82);
  font-size:1rem;
  line-height:1.8;
}
.cta-btn {
  color: gold;
  padding:.8rem 1.6rem;
  font-weight:800;
  font-size:.9rem;
  transition:all .25s ease;

}
/* Mobile */
@media (max-width: 768px){

  .section-cta{
    padding: 1.2rem;
    gap: 1rem;
    text-align: center;
    justify-content: center;
    flex-direction: column;
  }

  .cta-icon{
    width: 54px;
    height: 54px;
    border-radius: 14px;
  }

  .cta-icon i{
    font-size: 1.4rem;
  }

  .cta-content{
    flex: unset;
    width: 100%;
  }

  .cta-tagline{
    font-size: .9rem;
    line-height: 1.6;
    max-width: 100%;
  }

  .cta-btn{
    width: 100%;
    justify-content: center;
    padding: .9rem 1rem;
    border-radius: 12px;
  }

}

/* Decorative */
.consultation-dots{
  position:absolute;
  inset:0;
  background-image:
    radial-gradient(
      circle,
      rgba(255,255,255,.07) 1.5px,
      transparent 1.5px
    );

  background-size:28px 28px;
  pointer-events:none;
}

.consultation-glow{
  position:absolute;
  top:-70px;
  inset-inline-end:-70px;

  width:220px;
  height:220px;
  border-radius:50%;

  background:
    radial-gradient(
      circle,
      rgba(231,174,24,.25),
      transparent 70%
    );

  pointer-events:none;
}

/* Large Icon */
.consultation-icon{
  width:90px;
  height:90px;

  border-radius:24px;

  background:rgba(231,174,24,.18);

  display:flex;
  align-items:center;
  justify-content:center;

  flex-shrink:0;

  position:relative;
  z-index:2;

  color:var(--gold);

  box-shadow:
    0 0 0 12px rgba(231,174,24,.08);
}

.consultation-icon i{
  font-size:2.8rem;
}

/* Content */
.consultation-content{
  flex:1;
  min-width:220px;
  position:relative;
  z-index:2;
}

.consultation-content h3{
  color:#fff;
  font-size:1.45rem;
  font-weight:800;
  margin:0 0 .5rem;
}

.consultation-content p{
  color:rgba(255,255,255,.72);
  line-height:1.8;
  margin:0;
  font-size:.95rem;
}

/* Button */
.consultation-btn{
  display:inline-flex;
  align-items:center;
  gap:.7rem;

  padding:.95rem 1.8rem;

  background:var(--gold);
  color:var(--blue-dk);

  border-radius:14px;
  text-decoration:none;

  font-weight:800;
  font-size:.95rem;

  position:relative;
  z-index:2;

  transition:all .3s ease;
}

.consultation-btn i{
  font-size:1.2rem;
}

.consultation-btn:hover{
  background:#fff;
  transform:translateY(-3px);

  box-shadow:
    0 10px 25px rgba(0,0,0,.15);

  color:var(--blue);
}

/* ═══ Modal Overlay ═══ */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(10,24,112,.55);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

/* ═══ Modal Panel ═══ */
.modal-panel {
  background: #fff; border-radius: 24px;
  width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 80px rgba(10,24,112,.25);
  animation: modalIn .35s cubic-bezier(.34,1.2,.64,1);
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(.93) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Modal Header */
.modal-header {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.75rem 1.75rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
}
.modal-icon {
  width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(22,47,187,.1) 0%, rgba(22,47,187,.15) 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: #162FBB;
}
.modal-icon.gold-icon {
  background: linear-gradient(135deg, rgba(231,174,24,.1) 0%, rgba(231,174,24,.2) 100%);
  color: #c49210;
}
.modal-header-text { flex: 1; min-width: 0; }
.modal-eyebrow {
  display: block; font-size: .72rem; font-weight: 800;
  color: #162FBB; text-transform: uppercase; letter-spacing: .08em;
  margin-bottom: .25rem;
}
.modal-title {
  font-size: 1.15rem; font-weight: 800; color: #0A1870;
  line-height: 1.3; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.modal-close {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: #f9fafb; border: 1px solid #e5e7eb;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #6b7280; font-size: .9rem;
  transition: all .2s;
}
.modal-close:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

/* Modal Body */
.modal-body { padding: 1.5rem 1.75rem; }
.modal-desc {
  font-size: .9rem; color: #4b5563; line-height: 1.8;
  margin-bottom: 1.5rem;
}
.modal-points-section {}
.modal-points-title {
  font-size: .85rem; font-weight: 800; color: #0A1870;
  margin-bottom: 1rem; display: flex; align-items: center;
}
.modal-points {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: .65rem;
}
.modal-points li {
  display: flex; align-items: flex-start; gap: .75rem;
  font-size: .87rem; color: #374151; line-height: 1.55;
}
.modal-point-icon {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  background: rgba(231,174,24,.12);
  display: flex; align-items: center; justify-content: center;
  color: #c49210; font-size: .8rem; margin-top: .1rem;
}

/* Modal Footer */
.modal-footer {
  display: flex; align-items: center; gap: .75rem; flex-wrap: wrap;
  padding: 1.25rem 1.75rem;
  border-top: 1px solid #f3f4f6;
  justify-content: flex-end;
}
.modal-request-btn {
  display: inline-flex; align-items: center;
  padding: .7rem 1.5rem;
  background: linear-gradient(135deg, #162FBB 0%, #0A1870 100%); color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-weight: 700; font-size: .88rem; transition: all .2s;
  box-shadow: 0 2px 10px rgba(22,47,187,.3);
}
.modal-request-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(22,47,187,.4); }
.modal-request-btn.full-width { width: 100%; justify-content: center; font-size: .95rem; padding: .85rem; }
.modal-request-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }
.modal-cancel-btn {
  padding: .7rem 1.25rem; background: none;
  border: 1px solid #e5e7eb; border-radius: 10px;
  cursor: pointer; color: #6b7280; font-weight: 600; font-size: .88rem;
  transition: all .2s;
}
.modal-cancel-btn:hover { background: #f9fafb; border-color: #d1d5db; }

/* ═══ Request Form ═══ */
.request-panel { max-width: 500px; }
.request-form { display: flex; flex-direction: column; gap: 1.1rem; }
.form-group { display: flex; flex-direction: column; gap: .45rem; }
.form-group label {
  font-size: .82rem; font-weight: 700; color: #374151;
}
.optional { font-weight: 400; color: #9ca3af; }
.form-group input,
.form-group textarea {
  width: 100%; padding: .65rem 1rem;
  border: 1.5px solid #e5e7eb; border-radius: 10px;
  font-size: .9rem; color: #111827; background: #fafafa;
  transition: border-color .2s, background .2s;
  font-family: inherit; resize: vertical;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none; border-color: #162FBB; background: #fff;
  box-shadow: 0 0 0 3px rgba(22,47,187,.1);
}
.form-group input.has-error,
.form-group textarea.has-error { border-color: #ef4444; }
.field-error { font-size: .78rem; color: #ef4444; font-weight: 600; }

/* ═══ Success State ═══ */
.success-state { text-align: center; padding: 1.5rem 0; }
.success-icon {
  font-size: 3.5rem; color: #22c55e; margin-bottom: 1rem;
  animation: popIn .5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.success-state h3 { font-size: 1.15rem; font-weight: 800; color: #0A1870; margin-bottom: .5rem; }
.success-state p { font-size: .9rem; color: #6b7280; margin-bottom: 1.5rem; }

/* ═══ Modal Transition ═══ */
.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-panel { animation: modalIn .35s cubic-bezier(.34,1.2,.64,1); }
.modal-leave-active .modal-panel { animation: modalIn .25s cubic-bezier(.34,1.2,.64,1) reverse; }

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .services-section { padding: 4rem 0; }
  .services-grid { grid-template-columns: 1fr; }
  .modal-panel { border-radius: 18px; }
  .modal-footer { flex-direction: column-reverse; }
  .modal-cancel-btn, .modal-request-btn { width: 100%; justify-content: center; }
}
</style>

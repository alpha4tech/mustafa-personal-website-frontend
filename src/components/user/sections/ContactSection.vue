<template>
  <section id="contact" class="contact-section" :class="{ 'rtl-contact': isRtl }">

    <!-- Background -->
    <div class="bg-deco">
      <div class="deco-1"></div>
      <div class="deco-2"></div>
      <div class="deco-grid"></div>
    </div>

    <div class="container">

      <!-- Header -->
      <div class="sec-header" data-aos="fade-up">
        <div class="sec-badge">
          <span class="badge-dot"></span>
          <span>{{ t.contactBadge }}</span>
        </div>
        <h2 class="sec-title">
          {{ t.contactTitlePrefix }}
          <span class="title-highlight">{{ t.contactTitleHighlight }}</span>
        </h2>
        <p class="sec-sub">{{ t.contactSubtitle }}</p>
      </div>

      <!-- Main Grid -->
      <div class="contact-grid">

        <!-- ── LEFT: Info ── -->
        <div class="contact-info" data-aos="fade-right" data-aos-delay="100">

          <!-- Info cards -->
          <div class="info-cards">
            <a :href="'tel:' + t.phoneValue" class="info-card" >
              <div class="info-icon" style="background:rgba(22,47,187,.1)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162FBB" stroke-width="1.8" stroke-linecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                </svg>
              </div>
              <div class="info-text">
                <span class="info-label">{{ t.phoneLabel }}</span>
                <!-- <span class="info-value">{{ t.phoneValue }}</span> -->
                <span class="info-value phone-value">
                    <bdi>{{ t.phoneValue }}</bdi>
                 </span>
                <span class="info-note">{{ t.phoneNote }}</span>
              </div>
              <div class="info-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </a>

            <a :href="'mailto:' + t.emailValue" class="info-card">
              <div class="info-icon" style="background:rgba(231,174,24,.1)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="1.8" stroke-linecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div class="info-text">
                <span class="info-label">{{ t.emailLabel }}</span>
                <span class="info-value">{{ t.emailValue }}</span>
                <span class="info-note">{{ t.emailNote }}</span>
              </div>
              <div class="info-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </a>

            <div class="info-card no-link">
              <div class="info-icon" style="background:rgba(16,185,129,.1)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.8" stroke-linecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="info-text">
                <span class="info-label">{{ t.locationLabel }}</span>
                <span class="info-value">{{ t.locationCity }}</span>
                <span class="info-note">{{ t.locationNote }}</span>
              </div>
            </div>

            <div class="info-card no-link hours-card">
              <div class="info-icon" style="background:rgba(139,92,246,.1)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.8" stroke-linecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="info-text">
                <span class="info-label">{{ t.hoursLabel }}</span>
                <div class="hours-list">
                  <div class="hour-row">
                    <span>{{ t.weekdays }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social links -->
          <div class="social-wrap">
            <span class="social-title">{{ t.contactMe }}</span>
            <div class="social-links">
              <a v-for="s in socials" :key="s.name" :href="s.href" class="social-btn" :style="{ '--sc': s.color }" target="_blank" rel="noopener">
                <span v-html="s.icon"></span>
              </a>
            </div>
          </div>

          <!-- Availability badge -->
          <div class="availability">
            <span class="avail-dot"></span>
            <span>{{ t.availableNow }}</span>
          </div>

        </div>

        <!-- ── RIGHT: Form ── -->
        <div class="contact-form-wrap" data-aos="fade-left" data-aos-delay="150">
          <div class="form-card">

            <div class="form-header">
              <h3>{{ t.sendMessage }}</h3>
              <p>{{ t.formSubtitle }}</p>
            </div>

            <form class="contact-form" @submit.prevent="submitForm">

              <div class="form-row">
                <div class="form-group">
                  <label>{{ t.nameLabel }}</label>
                  <div class="input-wrap">
                    <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      v-model="form.name"
                      type="text"
                      :placeholder="t.namePlaceholder"
                      :class="{ error: errors.name }"
                      @input="errors.name = ''"
                    />
                  </div>
                  <span v-if="errors.name" class="err-msg">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                  <label>{{ t.emailLabel }}</label>
                  <div class="input-wrap">
                    <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      v-model="form.email"
                      type="email"
                      :placeholder="t.emailPlaceholder"
                      :class="{ error: errors.email }"
                      @input="errors.email = ''"
                    />
                  </div>
                  <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>{{ t.subjectLabel }}</label>
                <div class="input-wrap">

                   <input
                      v-model="form.subject"
                      type="text"
                      :placeholder="t.subjectPlaceholder"
                      :class="{ error: errors.subject }"
                      @input="errors.subject = ''"
                    />
                </div>
                <span v-if="errors.subject" class="err-msg">{{ errors.subject }}</span>
              </div>

              <div class="form-group">
                <label>{{ t.messageLabel }}</label>
                <div class="input-wrap textarea-wrap">
                  <textarea
                    v-model="form.message"
                    :placeholder="t.messagePlaceholder"
                    rows="4"
                    :class="{ error: errors.message }"
                    @input="errors.message = ''"
                  ></textarea>
                </div>
                <span v-if="errors.message" class="err-msg">{{ errors.message }}</span>
                <span class="char-count">{{ form.message.length }} / 500</span>
              </div>

              <!-- Success message -->
              <Transition name="toast">
                <div v-if="submitStatus === 'success'" class="toast toast-success">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {{ t.sendSuccess }}
                </div>
                <div v-else-if="submitStatus === 'error'" class="toast toast-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {{ t.sendError }}
                </div>
              </Transition>

              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                  {{ t.send }}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </span>
                <span v-else class="sending-wrap">
                  <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  {{ t.sending }}
                </span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { publicAxios } from '@/api/axios'

const submitForm = async () => {
  if (!validate()) return

  isSubmitting.value = true
  submitStatus.value = null

  try {
    await publicAxios.post('/contacts', {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    })

    submitStatus.value = 'success'

    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    setTimeout(() => {
      submitStatus.value = null
    }, 5000)

  } catch (error) {
    console.error(error)

    submitStatus.value = 'error'

    setTimeout(() => {
      submitStatus.value = null
    }, 5000)

  } finally {
    isSubmitting.value = false
  }
}
// import emailjs from '@emailjs/browser'

const props = defineProps({
  t: { type: Object, required: true },
  isRtl: { type: Boolean, default: false }
})

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', subject: '', message: '' })
const isSubmitting = ref(false)
const submitStatus = ref(null)

const socials = [
  {
    name: 'WhatsApp', href: 'https://wa.me/249924535131?text=Hello%20Mustafa,%20I%20would%20like%20to%20inquire%20about%20your%20services.', color: '#25D366',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`
  },
 {
  name: 'Facebook',
  href: 'https://www.facebook.com/MustafaHasbSido',
  color: '#1877F2',
  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/>
  </svg>`
},
  {
    name: 'LinkedIn', href: 'https://www.linkedin.com/in/mustafahasbsido/', color: '#0a66c2',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
  },
  {
    name: 'Instagram', href: 'https://www.instagram.com/mustafahasbsido/', color: '#E1306C',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
  },
  {
    name: 'Twitter / X', href: 'https://x.com/MustafaHasbSido/', color: '#000',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  },
  {
  name: 'TikTok',
  href: 'https://www.tiktok.com/@mustafahasbsid',
  color: '#ff0050',
  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.234V2h-3.193v13.377a2.896 2.896 0 1 1-2.896-2.896c.226 0 .446.025.658.07V9.307a6.09 6.09 0 0 0-.658-.035A6.09 6.09 0 1 0 15.82 15.36V8.548a7.97 7.97 0 0 0 4.658 1.49V6.845c-.307 0-.607-.053-.889-.159z"/>
  </svg>`
}
]

const validate = () => {
  let valid = true
  if (!form.name.trim()) { errors.name = props.t.errorRequired || 'مطلوب'; valid = false }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = props.t.errorEmail || 'بريد غير صحيح'; valid = false }
  if (!form.subject) { errors.subject = props.t.errorRequired || 'مطلوب'; valid = false }
  if (!form.message.trim() || form.message.length < 10) { errors.message = props.t.errorMessage || 'الرسالة قصيرة جداً'; valid = false }
  return valid
}


</script>

<style scoped>
/* ── Section ──────────────────────────────── */
.contact-section {
  padding: 6rem 0;
  background: #F0F0F0;
  position: relative;
  overflow: hidden;
}

.bg-deco { position:absolute; inset:0; pointer-events:none; }
.deco-1 { position:absolute; width:500px; height:500px; top:-150px; right:-100px; background:radial-gradient(circle,rgba(22,47,187,.06),transparent 70%); border-radius:50%; }
.deco-2 { position:absolute; width:400px; height:400px; bottom:-100px; left:-80px; background:radial-gradient(circle,rgba(231,174,24,.07),transparent 70%); border-radius:50%; }
.deco-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(22,47,187,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(22,47,187,.025) 1px,transparent 1px); background-size:50px 50px; }

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
/* ── Container ────────────────────────────── */
.container { max-width:1200px; margin:0 auto; padding:0 2rem; position:relative; z-index:1; }

/* ── Header ───────────────────────────────── */
.sec-header { text-align:center; margin-bottom:3.5rem; }
.sec-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(22,47,187,.07); border:1px solid rgba(22,47,187,.18); color:#162FBB; padding:5px 16px; border-radius:50px; font-size:.8rem; font-weight:700; margin-bottom:1rem; letter-spacing:.04em; }
.badge-dot { width:6px; height:6px; background:#E7AE18; border-radius:50%; animation:pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(231,174,24,.5)} 50%{box-shadow:0 0 0 5px rgba(231,174,24,0)} }
.sec-title { font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:800; color:#0e1a60; margin-bottom:.8rem; line-height:1.2; letter-spacing:-.02em; }
.title-highlight { color:#162FBB; }
.sec-sub { font-size:1rem; color:#64748b; max-width:520px; margin:0 auto; line-height:1.7; }

/* ── Grid ─────────────────────────────────── */
.contact-grid { display:grid; grid-template-columns:1fr 1.4fr; gap:3rem; align-items:start; }

/* ── Info Cards ───────────────────────────── */
.info-cards { display:flex; flex-direction:column; gap:12px; margin-bottom:1.8rem; }

.info-card {
  display:flex; align-items:center; gap:14px;
  background:#fff; border-radius:14px; padding:1rem 1.1rem;
  border:1px solid rgba(22,47,187,.08);
  text-decoration:none; color:inherit;
  transition:all .25s ease;
  cursor:pointer;
}

a.info-card:hover { transform:translateX(-4px); border-color:rgba(22,47,187,.2); box-shadow:0 6px 20px rgba(22,47,187,.08); }
.rtl-contact a.info-card:hover { transform:translateX(4px); }
.no-link { cursor:default; }

.info-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:transform .25s; }
a.info-card:hover .info-icon { transform:scale(1.08); }

.info-text { flex:1; display:flex; flex-direction:column; gap:2px; overflow:hidden; }
.info-label { font-size:.7rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:.06em; }
.info-value { font-size:.92rem; font-weight:700; color:#0e1a60; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.info-note { font-size:.72rem; color:#64748b; }

.info-arrow { color:#D0D6E5; transition:all .25s; flex-shrink:0; }
a.info-card:hover .info-arrow { color:#162FBB; transform:translateX(3px); }
.rtl-contact a.info-card:hover .info-arrow { transform:translateX(-3px) rotate(180deg); }

/* Hours */
.hours-card { align-items:flex-start; }
.hours-list { display:flex; flex-direction:column; gap:3px; margin-top:2px; }
.hour-row { display:flex; justify-content:space-between; gap:12px; font-size:.78rem; color:#475569; }
.hour-time { font-weight:700; color:#162FBB; }

/* Social */
.social-wrap { margin-bottom:1.2rem; }
.social-title { font-size:.75rem; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:.08em; display:block; margin-bottom:.7rem; }
.social-links { display:flex; gap:8px; }
.social-btn {
  width:40px; height:40px;
  background:#fff; border-radius:10px;
  border:1px solid rgba(22,47,187,.1);
  display:flex; align-items:center; justify-content:center;
  color:#475569; transition:all .25s; text-decoration:none;
}
.social-btn:hover { background:var(--sc); color:#fff; border-color:var(--sc); transform:translateY(-3px); box-shadow:0 6px 16px rgba(0,0,0,.12); }

/* Availability */
.availability { display:inline-flex; align-items:center; gap:8px; background:#fff; border:1px solid rgba(16,185,129,.2); padding:7px 14px; border-radius:50px; }
.avail-dot { width:8px; height:8px; background:#10b981; border-radius:50%; animation:avail-pulse 2s ease-in-out infinite; flex-shrink:0; }
@keyframes avail-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4)} 50%{box-shadow:0 0 0 5px rgba(16,185,129,0)} }
.availability span:last-child { font-size:.8rem; font-weight:700; color:#059669; }

/* ── Form Card ────────────────────────────── */
.form-card { background:#fff; border-radius:22px; padding:2rem 2.2rem; border:1px solid rgba(22,47,187,.08); box-shadow:0 8px 40px rgba(22,47,187,.07); }

.form-header { margin-bottom:1.6rem; }
.form-header h3 { font-size:1.25rem; font-weight:800; color:#0e1a60; margin-bottom:5px; }
.form-header p { font-size:.85rem; color:#64748b; }

/* Form */
.contact-form { display:flex; flex-direction:column; gap:1.1rem; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.form-group { display:flex; flex-direction:column; gap:5px; }
.form-group label { font-size:.8rem; font-weight:700; color:#374151; }

/* Input */
.input-wrap { position:relative; }
.input-icon { position:absolute; top:50%; inset-inline-start:12px; transform:translateY(-50%); color:#94a3b8; pointer-events:none; }
.textarea-wrap .input-icon { top:14px; transform:none; }

input, select, textarea {
  width:100%;
  padding:.65rem .75rem .65rem 2.4rem;
  background:#f8fafc;
  border:1.5px solid #e2e8f0;
  border-radius:10px;
  font-size:.88rem;
  color:#1e293b;
  font-family:inherit;
  transition:all .2s;
  outline:none;
  appearance:none;
}
.rtl-contact input,
.rtl-contact select,
.rtl-contact textarea { padding:.65rem 2.4rem .65rem .75rem; }

input:focus, select:focus, textarea:focus { border-color:#162FBB; background:#fff; box-shadow:0 0 0 3px rgba(22,47,187,.08); }
input.error, select.error, textarea.error { border-color:#ef4444; background:#fff5f5; }
textarea { resize:vertical; min-height:110px; padding-top:.65rem; line-height:1.6; }
select { cursor:pointer; }

.err-msg { font-size:.72rem; color:#ef4444; font-weight:600; }
.char-count { font-size:.7rem; color:#94a3b8; text-align:end; }

/* Toast */
.toast { display:flex; align-items:center; gap:8px; padding:.75rem 1rem; border-radius:10px; font-size:.85rem; font-weight:600; }
.toast-success { background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.25); color:#059669; }
.toast-error   { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25); color:#dc2626; }
.toast-enter-active,.toast-leave-active { transition:all .3s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateY(-8px); }

/* Submit button */
.submit-btn {
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:.85rem; width:100%;
  background:#162FBB; color:#fff;
  border:none; border-radius:12px;
  font-size:.95rem; font-weight:800;
  cursor:pointer; font-family:inherit;
  transition:all .3s cubic-bezier(.34,1.56,.64,1);
  margin-top:.3rem;
}
.submit-btn:hover:not(:disabled) { background:#E7AE18; color:#0e1a60; transform:translateY(-2px); box-shadow:0 10px 28px rgba(231,174,24,.35); }
.submit-btn:disabled { opacity:.7; cursor:not-allowed; transform:none; }
.submit-btn svg { transition:transform .2s; }
.submit-btn:hover:not(:disabled) svg { transform:translateX(4px) rotate(-45deg); }

.sending-wrap { display:flex; align-items:center; gap:8px; }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* ── RTL ──────────────────────────────────── */
.rtl-contact { direction:rtl; }
.rtl-contact .submit-btn svg { transform:rotate(180deg); }
.rtl-contact .submit-btn:hover:not(:disabled) svg { transform:rotate(180deg) translateX(4px); }

/* ── Responsive ───────────────────────────── */
@media (max-width:1024px) { .contact-grid { grid-template-columns:1fr; gap:2.5rem; } }
@media (max-width:640px) {
  .contact-section { padding:4rem 0; }
  .form-row { grid-template-columns:1fr; }
  .form-card { padding:1.5rem; }
  .container { padding:0 1.2rem; }
  .social-links { flex-wrap:wrap; }
}
</style>

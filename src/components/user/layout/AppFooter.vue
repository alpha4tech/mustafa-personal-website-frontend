<template>
  <footer class="footer" :class="{ rtl: isRtl }">

    <!-- TOP ACCENT LINE -->
    <div class="top-line"></div>

    <!-- ══ COMPANIES / TRUST STRIP   ══ -->
    <div class="co-strip">
      <p class="co-label">
        {{ isRtl
          ? 'موثوق به من منصات وشهادات عالمية رائدة'
          : 'Trusted by Leading Global Platforms & Certifications'
        }}
      </p>
      <div class="co-row">
        <div
          v-for="n in 10"
          :key="n"
          class="co-card"
        >
          <img
            :ref="el => imgRefs[n] = el"
            :alt="`company-${n}`"
            @error="onImgError(n)"
            @load="onImgLoad(n)"
          />
        </div>
      </div>
    </div>

    <!-- ══ MAIN GRID ══ -->
    <div class="fp-main">
      <div class="fp-grid">

        <!-- Brand -->
        <div class="col">
          <div class="brand-logo">
            {{ isRtl ? 'مصطفى' : 'Mustafa' }}
            <em>{{ isRtl ? 'حسب سيدو' : 'Hasb Sido' }}</em>
          </div>
          <div class="brand-sub">Digital Marketing Specialist</div>
          <div class="col-bar"></div>
          <p class="brand-p">{{ t.footerDescription }}</p>
          <div class="soc-row">
            <a
              v-for="s in socialLinks"
              :key="s.name"
              :href="s.link"
              target="_blank"
              rel="noopener noreferrer"
              class="soc-btn"
              :title="s.name"
            >
              <Icon :icon="s.icon" width="15" height="15" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col">
          <p class="col-title">{{ t.quickLinks }}</p>
          <div class="col-bar"></div>
          <ul class="n-list">
            <li v-for="link in navLinks" :key="link.key">
              <a @click.prevent="$emit('scrollTo', link.key)">{{ t[link.label] }}</a>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div class="col">
          <p class="col-title">{{ t.ourServices }}</p>
          <div class="col-bar"></div>
          <ul class="s-list">
            <li
              v-for="i in 10"
              :key="i"
              @click="$emit('scrollTo', 'services')"
            >
              <span class="s-arrow">›</span>{{ t[`footerService${i}`] }}
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col">
          <p class="col-title">{{ t.contactInfo }}</p>
          <div class="col-bar"></div>
          <ul class="c-list">
            <li>
              <div class="c-icon"><Icon icon="mdi:map-marker" width="14" height="14" /></div>
              <div>
                <p class="c-lbl">{{ isRtl ? 'الموقع' : 'Location' }}</p>
                <p class="c-val">{{ t.locationAddress }}</p>
              </div>
            </li>
            <li>
              <div class="c-icon"><Icon icon="mdi:phone" width="14" height="14" /></div>
              <div>
                <p class="c-lbl">{{ isRtl ? 'الهاتف' : 'Phone' }}</p>
                <p class="c-val">
                  <a href="tel:+249924535131"><bdi>{{ t.phoneValue }}</bdi>
                  </a>
               </p>
              </div>
            </li>
            <li>
              <div class="c-icon"><Icon icon="mdi:email" width="14" height="14" /></div>
              <div>
                <p class="c-lbl">{{ isRtl ? 'البريد' : 'Email' }}</p>
                <p class="c-val"><a href="mailto:info@mustafahasbsido.com">info@mustafahasbsido.com</a></p>
              </div>
            </li>
            <li>
              <div class="c-icon"><Icon icon="mdi:clock" width="14" height="14" /></div>
              <div>
                <p class="c-lbl">{{ isRtl ? 'أوقات العمل' : 'Working Hours' }}</p>
                <p class="c-val">{{ t.workHours }}</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- ══ BOTTOM BAR ══ -->
    <div class="fp-bottom">
      <p class="copy">
        &copy; {{ currentYear }} {{ t.logoText }}.
        {{ isRtl ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.' }}
      </p>
      <p class="dev">
        {{ isRtl ? 'تمت البرمجة بواسطة' : 'Developed by' }}
        <a href="https://www.alphafortech.com" target="_blank" rel="noopener noreferrer">Alpha4Tech</a>
      </p>
    </div>

    <!-- ══ BACK TO TOP ══ -->
    <Transition name="btt">
      <button
        v-show="showTop"
        class="back-to-top"
        @click="scrollToTop"
        :title="isRtl ? 'للأعلى' : 'Back to top'"
      >
        <i class="bi bi-chevron-up"></i>
      </button>
    </Transition>

  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  t:     { type: Object,  required: true },
  isRtl: { type: Boolean, default: false },
})
defineEmits(['scrollTo'])

/* ── image loading with fallback ── */
const imgRefs   = ref({})
const attempts  = {}
const extList   = ['png', 'jpg', 'jpeg', 'webp', 'svg']

onMounted(() => {
  for (let n = 1; n <= 10; n++) {
    attempts[n] = 0
    tryLoad(n)
  }
})

function tryLoad(n) {
  const el = imgRefs.value[n]
  if (!el) return
  if (attempts[n] >= extList.length) {
    el.style.display = 'none'
    return
  }
  el.src = `/images/companies/companies-${n}.${extList[attempts[n]]}`
  attempts[n]++
}
function onImgError(n) { tryLoad(n) }
function onImgLoad(n)  { /* image loaded, nothing needed */ }

/* ── nav ── */
const navLinks = [
  { key: 'home',      label: 'home'      },
  { key: 'about',     label: 'about'     },
  { key: 'services',  label: 'services'  },
  { key: 'portfolio', label: 'portfolio' },
  { key: 'blog',      label: 'blog'      },
  { key: 'contact',   label: 'contactMe' },
]

/* ── social ── */
const socialLinks = ref([
  { name: 'WhatsApp',  icon: 'mdi:whatsapp',  link: 'https://wa.me/249924535131?text=Hello%20Mustafa,%20I%20would%20like%20to%20inquire%20about%20your%20services.' },
  { name: 'Facebook',  icon: 'mdi:facebook',  link: 'https://www.facebook.com/MustafaHasbSido' },
  { name: 'LinkedIn',  icon: 'mdi:linkedin',  link: 'https://www.linkedin.com/in/mustafahasbsido/' },
  { name: 'Instagram', icon: 'mdi:instagram', link: 'https://www.instagram.com/mustafahasbsido/' },
  { name: 'X',         icon: 'simple-icons:x',   link: 'https://x.com/MustafaHasbSido' },
  { name: 'TikTok',    icon: 'bi:tiktok',  link: 'https://www.tiktok.com/@mustafahasbsid', color: '#ff0050',}

])

/* ── scroll ── */
const showTop      = ref(false)
const currentYear  = computed(() => new Date().getFullYear())
const scrollToTop  = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const onScroll     = () => { showTop.value = window.scrollY > 500 }

onMounted(()   => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ══ BASE ══ */
.footer {
  --navy:   #0d1b4b;
  --blue:   #111f5c;
  --blue2:  #1a2d7a;
  --gold:   #E7AE18;
  --w55:    rgba(255,255,255,0.55);
  --w30:    rgba(255,255,255,0.30);
  --w07:    rgba(255,255,255,0.07);
  background: var(--navy);
  color: #fff;
  font-family: inherit;
}
.footer.rtl { direction: rtl; }

/* ══ TOP LINE ══ */
.top-line {
  height: 3px;
  background: linear-gradient(90deg, #162FBB 0%, #E7AE18 50%, #162FBB 100%);
}

/* ══ COMPANIES STRIP ══ */
.co-strip {
  background: var(--blue);
  padding: 2rem 2.5rem;
  border-bottom: 1px solid var(--w07);
}
.co-label {
  text-align: center;
  font-size: 10.5px;
  letter-spacing: 3px;
  color: var(--w30);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.co-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.co-card {
  width: 92px;
  height: 56px;
  background: var(--blue2);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color .25s, background .25s;
}
.co-card:hover {
  background: #1e3490;
  border-color: rgba(231,174,24,0.55);
}
/* ← THE FIX: no filter, full opacity, visible at all times */
.co-card img {
  max-width: 78%;
  max-height: 38px;
  object-fit: contain;
  display: block;
  opacity: 1;
}

/* ══ MAIN GRID ══ */
.fp-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 2.5rem 2.5rem;
}
.fp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* all equal */
  gap: 2.5rem;
  align-items: start;
}

/* ══ COLUMN SHARED ══ */
.col-bar {
  width: 28px;
  height: 2px;
  background: var(--gold);
  border-radius: 2px;
  margin-bottom: 1.2rem;
}
.col-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

/* ══ BRAND ══ */
.brand-logo {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 3px;
  letter-spacing: -0.3px;
}
.brand-logo em { color: var(--gold); font-style: normal; }
.brand-sub {
  font-size: 9.5px;
  letter-spacing: 2.5px;
  color: var(--w30);
  text-transform: uppercase;
  margin-bottom: 0.9rem;
}
.brand-p {
  font-size: 12px;
  line-height: 1.85;
  color: var(--w55);
  margin-bottom: 1.2rem;
}
.soc-row { display: flex; gap: 6px; flex-wrap: wrap; }
.soc-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--w55);
  text-decoration: none;
  transition: all .2s;
}
.soc-btn:hover { background: var(--gold); border-color: var(--gold); color: var(--navy); }

/* ══ NAV LIST ══ */
.n-list { list-style: none; }
.n-list li { margin-bottom: 5px; }
.n-list a {
  font-size: 12.5px;
  color: var(--w55);
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color .2s;
}
.n-list a::before { content: '›'; color: var(--gold); opacity: 0; transition: opacity .2s; }
.n-list a:hover { color: #fff; }
.n-list a:hover::before { opacity: 1; }

/* ══ SERVICES LIST ══ */
.s-list { list-style: none; }
.s-list li {
  font-size: 12px;
  color: var(--w55);
  padding: 5px 0;
  border-bottom: 1px solid var(--w07);
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: color .2s;
}
.s-list li:last-child { border-bottom: none; }
.s-list li:hover { color: #fff; }
.s-arrow { color: var(--gold); font-size: 14px; line-height: 1; flex-shrink: 0; }

/* ══ CONTACT LIST ══ */
.c-list { list-style: none; }
.c-list li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  margin-bottom: 11px;
}
.c-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: rgba(231,174,24,0.1);
  border: 1px solid rgba(231,174,24,0.22);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
}
.c-lbl {
  font-size: 9.5px;
  color: var(--w30);
  letter-spacing: .5px;
  text-transform: uppercase;
  margin-bottom: 1px;
}
.c-val { font-size: 12px; color: var(--w55); }
.c-val a { color: var(--w55); text-decoration: none; transition: color .2s; }
.c-val a:hover { color: var(--gold); }

/* ══ BOTTOM BAR ══ */
.fp-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.2rem 2.5rem;
  border-top: 1px solid var(--w07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.copy, .dev { font-size: 11px; color: var(--w30); }
.dev a { color: var(--gold); text-decoration: none; font-weight: 700; transition: color .2s; }
.dev a:hover { color: #fff; }

/* ══ BACK TO TOP ══ */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--gold);
  color: var(--navy);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 4px 14px rgba(231,174,24,0.4);
  transition: all .3s;
}
.back-to-top:hover { background: #fff; transform: translateY(-3px); }
.rtl .back-to-top { right: auto; left: 2rem; }

/* ══ BTT TRANSITION ══ */
.btt-enter-active { animation: bttIn .25s ease; }
.btt-leave-active { animation: bttIn .2s ease reverse; }
@keyframes bttIn {
  from { opacity: 0; transform: scale(.75) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ══ RESPONSIVE ══ */
@media (max-width: 960px) {
  .fp-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
}
@media (max-width: 580px) {
  .fp-grid { grid-template-columns: 1fr; gap: 1.8rem; }
  .fp-main  { padding: 2.5rem 1.5rem 2rem; }
  .co-strip { padding: 1.8rem 1.5rem; }
  .co-card  { width: 70px; height: 44px; }
  .fp-bottom { flex-direction: column; text-align: center; padding: 1rem 1.5rem; }
  .back-to-top { bottom: 1rem; right: 1rem; }
  .rtl .back-to-top { right: auto; left: 1rem; }
}
</style>

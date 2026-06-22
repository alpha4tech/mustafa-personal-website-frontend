<template>
  <section id="about" class="about-section" :class="{ 'rtl-about': isRtl }">

    <!-- Background decorations -->
    <div class="bg-deco">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-grid"></div>
    </div>

    <div class="container">

      <!-- Section Header -->
      <div class="sec-header" data-aos="fade-up">
        <div class="sec-badge">
          <span class="badge-dot"></span>
          <span>{{ t.aboutBadge || (isRtl ? 'من أنا' : 'About Me') }}</span>
        </div>
        <h2 class="sec-title">
          {{ isRtl ? 'تعرّف على' : 'Get to Know' }}
          <span class="title-highlight">{{ t.heroName || 'Mustafa' }}</span>
        </h2>
        <p class="sec-sub">{{ t.aboutSubtitle }}</p>
      </div>

      <!-- Main Grid -->
      <div class="about-grid">

        <!-- ── LEFT: Content ── -->
        <div class="about-content" data-aos="fade-right" data-aos-delay="100">

          <h3 class="content-title">{{ t.aboutMainTitle }}</h3>
          <p class="about-desc">{{ t.aboutText1 }}</p>
          <p class="about-desc">{{ t.aboutText2 }}</p>

          <!-- Tabs: Mission / Vision / Values -->
          <div class="tabs-wrap">
            <div class="tabs-header">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                :class="['tab-btn', { active: activeTab === tab.key }]"
                @click="activeTab = tab.key"
              >
                {{ t[tab.labelKey] || tab.fallback }}
              </button>
            </div>

            <Transition name="tab-fade" mode="out-in">
              <div :key="activeTab" class="tab-body">

                <!-- Mission or Vision -->
                <div v-if="activeTab !== 'values'" class="mv-card">
                  <div class="mv-icon">
                    <svg v-if="activeTab === 'mission'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div class="mv-text-wrap">
                    <div class="mv-title">
                      {{ activeTab === 'mission' ? t.missionTitle : t.visionTitle }}
                    </div>
                    <div class="mv-text">
                      {{ activeTab === 'mission' ? t.missionText : t.visionText }}
                    </div>
                  </div>
                </div>

                <!-- Values -->
                <div v-else class="values-grid">
                  <div class="val-item" v-for="(val, i) in coreValues" :key="i">
                    <span class="val-icon" v-html="val.icon"></span>
                    <span>{{ t[val.key] }}</span>
                  </div>
                </div>

              </div>
            </Transition>
          </div>

          <!-- Signature -->
          <div class="about-sig">
            <div class="sig-line"></div>
            <span class="sig-text">{{ t.signature }}</span>
          </div>

        </div>

        <!-- ── RIGHT: Visual ── -->
        <div class="about-visual" data-aos="fade-left" data-aos-delay="200">

          <!-- Image block -->
          <div class="img-block">
            <div class="img-border-deco"></div>
            <div class="img-frame">
              <img src="/images/aboutme.png" alt="About" class="about-img" />
              <div class="img-overlay"></div>
            </div>
            <div class="exp-badge">
              <div class="exp-num">3<span>+</span></div>
              <div class="exp-lbl">{{ t.yearsOfExcellence }}</div>
            </div>
            <!-- Floating dot pattern -->
            <div class="dot-pattern"></div>
          </div>

          <!-- Stats -->
          <div class="stats-grid">
            <div
              class="stat-card"
              v-for="stat in stats"
              :key="stat.key"
              data-aos="fade-up"
              :data-aos-delay="stat.delay"
            >
              <div class="stat-icon" v-html="stat.icon"></div>
              <div class="stat-body">
                <div class="stat-num">{{ stat.value }}</div>
                <div class="stat-lbl">{{ t[stat.key] }}</div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="about-cta">
            <button class="cta-primary" @click="$emit('scrollTo', 'contact')">
              <span>{{ t.startProject }}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{{ t.trustedBy }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import CountUp from '@/components/common/CountUp.vue'


defineProps({
  t: { type: Object, required: true },
  isRtl: { type: Boolean, default: false }
})
defineEmits(['scrollTo'])

const activeTab = ref('mission')

const tabs = [
  { key: 'mission', labelKey: 'missionTitle', fallback: 'Mission' },
  { key: 'vision',  labelKey: 'visionTitle',  fallback: 'Vision'  },
  { key: 'values',  labelKey: 'coreValuesTitle', fallback: 'Values' },
]

const coreValues = [
  { key: 'value1', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="2.5" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { key: 'value2', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>' },
  { key: 'value3', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { key: 'value4', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="2.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  {
  key: 'value5',
  icon: ` <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="2 stroke-linecap="round" stroke-linejoin="round"> <circle cx="11" cy="11" r="7"/> <line x1="21" y1="21" x2="16.65" y2="16.65"/> </svg>`
}
]

const stats = [
  {
    key: 'projects_Completed', value: '100+', delay: 100,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#162FBB" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'
  },
  {
    key: 'happy_Clients', value: '300+', delay: 150,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#162FBB" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>'
  },
  {
    key: 'expertTeam', value: '15+', delay: 200,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#162FBB" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    key: 'countriesServed', value: '10+', delay: 250,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#162FBB" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  },
]
</script>

<style scoped>
/* ── Variables ─────────────────────────── */
.about-section {
  --blue:     #162FBB;
  --blue-dk:  #0e1a6e;
  --gold:     #E7AE18;
  --bg:       #F0F0F0;
  --neu:      #D0D6E5;
}

/* ── Section ───────────────────────────── */
.about-section {
  padding: 6rem 0;
  background: #fff;
  position: relative;
  overflow: hidden;
}

/* Background decorations */
.bg-deco { position: absolute; inset: 0; pointer-events: none; }
.deco-circle {
  position: absolute;
  border-radius: 50%;
}
.deco-1 {
  width: 500px; height: 500px;
  top: -150px; right: -150px;
  background: radial-gradient(circle, rgba(22,47,187,0.05) 0%, transparent 70%);
}
.deco-2 {
  width: 350px; height: 350px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(231,174,24,0.07) 0%, transparent 70%);
}
.deco-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(22,47,187,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22,47,187,0.025) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* ── Container ─────────────────────────── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* ── Section Header ────────────────────── */
.sec-header {
  text-align: center;
  margin-bottom: 4rem;
}

.sec-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(22, 47, 187, 0.07);
  border: 1px solid rgba(22, 47, 187, 0.18);
  color: #162FBB;
  padding: 5px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 0.04em;
}
.badge-dot {
  width: 6px; height: 6px;
  background: #E7AE18;
  border-radius: 50%;
}

.sec-title {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 800;
  color: #0e1a60;
  margin-bottom: 0.8rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
/* .title-highlight { color: #162FBB; } */

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
  font-size: 1rem;
  color: #64748b;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ── Grid ──────────────────────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

/* ── Left Content ──────────────────────── */
.content-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0e1a60;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.about-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 1rem;
}

/* Tabs */
.tabs-wrap { margin: 1.8rem 0; }

.tabs-header {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.2rem;
}

.tab-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}
.tab-btn:hover { color: #162FBB; }
.tab-btn.active {
  color: #162FBB;
  border-bottom-color: #162FBB;
}

/* Mission/Vision card */
.mv-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(22, 47, 187, 0.04);
  border: 1px solid rgba(22, 47, 187, 0.1);
  border-radius: 14px;
  padding: 1.2rem;
}
.mv-icon {
  width: 44px; height: 44px;
  background: #162FBB;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #fff;
}
.mv-icon svg { width: 22px; height: 22px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; }
.mv-title { font-size: 0.95rem; font-weight: 700; color: #0e1a60; margin-bottom: 5px; }
.mv-text  { font-size: 0.88rem; color: #64748b; line-height: 1.65; }

/* Values */
.values-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}
.val-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(22, 47, 187, 0.06);
  border: 1px solid rgba(22, 47, 187, 0.12);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #162FBB;
  transition: all 0.2s;
}
.val-item:hover { background: rgba(22,47,187,0.12); transform: translateY(-2px); }
.val-icon { display: flex; align-items: center; }

/* Signature */
.about-sig {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1.8rem;
}
.sig-line {
  width: 40px; height: 2px;
  background: linear-gradient(90deg, #162FBB, #E7AE18);
  border-radius: 2px;
  flex-shrink: 0;
}
.sig-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #162FBB;
  letter-spacing: 0.06em;
}

/* Tab transition */
.tab-fade-enter-active, .tab-fade-leave-active { transition: all 0.25s ease; }
.tab-fade-enter-from { opacity: 0; transform: translateY(8px); }
.tab-fade-leave-to   { opacity: 0; transform: translateY(-8px); }

/* ── Right Visual ──────────────────────── */
.img-block {
  position: relative;
  margin-bottom: 1.8rem;
}

.img-border-deco {
  position: absolute;
  top: -10px;
  inset-inline-end: -10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border: 2px solid rgba(231, 174, 24, 0.3);
  border-radius: 22px;
  z-index: 0;
}

.img-frame {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1;
}
.about-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}
.img-frame:hover .about-img { transform: scale(1.03); }

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(14,26,96,0.15), rgba(22,47,187,0.1));
  pointer-events: none;
}

/* Experience badge */
.exp-badge {
  position: absolute;
  bottom: -16px;
  inset-inline-end: 20px;
  background: #162FBB;
  padding: 12px 18px;
  border-radius: 14px;
  text-align: center;
  color: #fff;
  box-shadow: 0 10px 30px rgba(22,47,187,0.4);
  z-index: 2;
}
.exp-num {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
  color: #E7AE18;
}
.exp-num span { font-size: 1.2rem; }
.exp-lbl { font-size: 0.72rem; opacity: 0.85; white-space: nowrap; margin-top: 2px; }

/* Dot pattern decoration */
.dot-pattern {
  position: absolute;
  bottom: -20px;
  inset-inline-start: -20px;
  width: 80px; height: 80px;
  background-image: radial-gradient(circle, rgba(22,47,187,0.2) 1.5px, transparent 1.5px);
  background-size: 12px 12px;
  z-index: 0;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 2rem;
  margin-bottom: 1.2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid rgba(22, 47, 187, 0.07);
  transition: all 0.25s ease;
  cursor: default;
}
.stat-card:hover {
  background: #fff;
  box-shadow: 0 6px 20px rgba(22,47,187,0.08);
  transform: translateY(-3px);
  border-color: rgba(22,47,187,0.15);
}

.stat-icon {
  width: 40px; height: 40px;
  background: rgba(22,47,187,0.08);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s;
}
.stat-card:hover .stat-icon { background: rgba(22,47,187,0.14); }

.stat-num {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0e1a60;
  line-height: 1;
}
.stat-lbl { font-size: 0.72rem; color: #64748b; margin-top: 3px; }

/* CTA */
.about-cta {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.2rem;
  border-top: 1px solid #f0f4f8;
  flex-wrap: wrap;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.7rem 1.6rem;
  background: #162FBB;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
}
.cta-primary:hover {
  background: #E7AE18;
  color: #0e1a60;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(231,174,24,0.35);
}
.cta-primary svg { transition: transform 0.3s; flex-shrink: 0; }
.cta-primary:hover svg { transform: translateX(4px); }

.trust-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #64748b;
}

/* ── RTL ───────────────────────────────── */
.rtl-about { direction: rtl; }
.rtl-about .about-sig { flex-direction: row-reverse; }
.rtl-about .cta-primary svg { transform: rotate(180deg); }
.rtl-about .cta-primary:hover svg { transform: rotate(180deg) translateX(4px); }
.rtl-about .about-cta { flex-direction: row-reverse; justify-content: flex-end; }

/* ── Responsive ────────────────────────── */
@media (max-width: 992px) {
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .img-block  { max-width: 500px; margin: 0 auto 1.8rem; }
}

@media (max-width: 768px) {
  .about-section { padding: 4rem 0; }
  .sec-title { font-size: 1.8rem; }
  .content-title { font-size: 1.3rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .about-cta { flex-direction: column; align-items: flex-start; }
  .rtl-about .about-cta { align-items: flex-end; }
  .container { padding: 0 1.2rem; }
  .about-grid { gap: 2rem; }
}

@media (max-width: 480px) {
  .sec-title { font-size: 1.6rem; }
  .stats-grid { grid-template-columns: 1fr; }
  .values-grid { justify-content: center; }
}
</style>

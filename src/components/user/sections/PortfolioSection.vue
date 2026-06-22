<template>
  <section id="portfolio" class="portfolio-section" :class="{ 'rtl-portfolio': isRtl }">

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
          <span>{{ t.portfolioBadge }}</span>
        </div>
     

        <h2 class="sec-title" data-aos="fade-right"
            data-aos-duration="700">
          {{ t.portfolioTitlePrefix }}
          <span class="title-highlight">{{ t.portfolioTitleHighlight }}</span>
        </h2>
        <p class="sec-sub">{{ t.portfolioSubtitle }}</p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="skeleton-wrap">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="sk-img"></div>
          <div class="sk-body">
            <div class="sk-line w40"></div>
            <div class="sk-line w80"></div>
            <div class="sk-line w60"></div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div v-else>

        <!-- Filter Tabs -->
        <div class="filter-wrap" data-aos="fade-up" data-aos-delay="50">
          <button
            :class="['filter-btn', { active: activeFilter === 'all' }]"
            @click="setFilter('all')"
          >
            <span class="filter-icon" v-html="icons.all"></span>
            {{ isRtl ? 'الكل' : 'All' }}
            <span class="filter-count">{{ allProjects.length }}</span>
          </button>

          <button
            v-for="cat in apiCategories"
            :key="cat.slug"
            :class="['filter-btn', { active: activeFilter === cat.slug }]"
            @click="setFilter(cat.slug)"
          >
            <span class="filter-icon" v-html="icons.category"></span>
            {{ isRtl ? cat.name_ar : cat.name_en }}
            <span class="filter-count">{{ cat.count }}</span>
          </button>
        </div>

        <!-- Error state -->
        <div v-if="error" class="error-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E7AE18" stroke-width="1.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{{ isRtl ? 'حدث خطأ في تحميل المشاريع' : 'Failed to load projects' }}</p>
          <button class="retry-btn" @click="fetchData">
            {{ isRtl ? 'إعادة المحاولة' : 'Retry' }}
          </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredProjects.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D0D6E5" stroke-width="1.5" stroke-linecap="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <p>{{ isRtl ? 'لا توجد مشاريع في هذا التصنيف' : 'No projects in this category' }}</p>
        </div>

        <!-- Projects Grid -->
        <TransitionGroup v-else name="project-grid" tag="div" class="projects-grid">
          <div
            v-for="(project, index) in visibleProjects"
            :key="project.id"
            class="project-card"
            :class="{ 'card-wide': project.featured && index === 0 }"
            data-aos="fade-up"
            :data-aos-delay="index * 60"
            @click="openModal(project)"
          >
            <!-- Image area -->
            <div
              class="card-img"
              :style="project.thumbnail
                ? { backgroundImage: `url(${project.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: getGradient(project.category?.slug) }"
            >
              <div class="img-pattern" v-if="!project.thumbnail"></div>
              <div class="card-category-tag">
                {{ isRtl ? project.category?.name_ar : project.category?.name_en }}
              </div>
              <div class="card-overlay">
                <button class="view-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {{ t.viewProject }}
                </button>
              </div>
              <div class="mock-screen" v-if="!project.thumbnail">
                <div class="mock-bar"><span></span><span></span><span></span></div>
                <div class="mock-content">
                  <div class="mock-line w80"></div>
                  <div class="mock-line w60"></div>
                  <div class="mock-line w70"></div>
                  <div class="mock-blocks">
                    <div class="mock-block"></div>
                    <div class="mock-block"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="card-info">
              <div class="card-meta">
                <span class="meta-cat">
                  {{ isRtl ? project.category?.name_ar : project.category?.name_en }}
                </span>
                <span class="meta-year">{{ project.year }}</span>
              </div>
              <h3 class="card-title">
                {{ isRtl ? project.title_ar : project.title_en }}
              </h3>
              <p class="card-desc">
                {{ isRtl ? project.short_desc_ar : project.short_desc_en }}
              </p>
              <div class="card-tags">
                <span v-for="tag in (project.tags || []).slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="card-footer">
                <div class="card-stats">
                  <span class="stat" v-if="primaryResult(project)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                    </svg>
                    {{ primaryResult(project) }}
                  </span>
                </div>
                <button class="details-btn" @click.stop="openModal(project)">
                  {{ t.viewDetails }}
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Load more -->
        <div class="load-more-wrap" v-if="hasMore" data-aos="fade-up">
          <button class="load-more-btn" @click="loadMore">
            {{ t.loadMore }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar" data-aos="fade-up">
          <div class="stat-item" v-for="s in statsBar" :key="s.key">
              <div class="stat-num">
                  <CountUp :end="s.value" />
                  <span class="stat-plus">+</span>
              </div>
            <div class="stat-lbl">{{ t[s.key] }}</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
              <div class="stat-num">
                <CountUp :end="Number(experienceYears)" />
                <span class="stat-plus">+</span>
              </div>
              <div class="stat-lbl">{{ t.yearsLabel }}</div>
          </div>
        </div>

      </div>
      <!-- end v-else -->

    </div>

    <!-- Project Modal -->
    <Transition name="modal">
      <div v-if="selectedProject" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box">
          <button class="modal-close" @click="closeModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          <div
            class="modal-img"
            :style="selectedProject.thumbnail
              ? { backgroundImage: `url(${selectedProject.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: getGradient(selectedProject.category?.slug) }"
          >
            <div class="img-pattern" v-if="!selectedProject.thumbnail"></div>
            <div class="modal-mock" v-if="!selectedProject.thumbnail">
              <div class="mock-bar"><span></span><span></span><span></span></div>
              <div class="mock-content">
                <div class="mock-line w80"></div>
                <div class="mock-line w60"></div>
                <div class="mock-line w70"></div>
                <div class="mock-blocks">
                  <div class="mock-block"></div>
                  <div class="mock-block"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-content">
            <div class="modal-meta">
              <span class="meta-cat">
                {{ isRtl ? selectedProject.category?.name_ar : selectedProject.category?.name_en }}
              </span>
              <span class="meta-year">{{ selectedProject.year }}</span>
            </div>
            <h3 class="modal-title">
              {{ isRtl ? selectedProject.title_ar : selectedProject.title_en }}
            </h3>
            <p class="modal-desc">
              {{ isRtl ? selectedProject.short_desc_ar : selectedProject.short_desc_en }}
            </p>

            <div class="modal-results" v-if="selectedProject.results?.length">
              <div
                class="modal-result"
                v-for="(res, i) in selectedProject.results"
                :key="i"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                  <polyline points="16 7 22 7 22 13"/>
                </svg>
                <strong>{{ res }}</strong>
              </div>
            </div>

            <div
  class="modal-links"
  v-if="selectedProject.project_url || selectedProject.case_study_url"
>

  <a
    v-if="selectedProject.project_url"
    :href="selectedProject.project_url"
    target="_blank"
    rel="noopener"
    class="modal-link"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
    {{ isRtl ? 'زيارة المشروع' : 'Visit Project' }}
  </a>

  <a
    v-if="selectedProject.case_study_url"
    :href="selectedProject.case_study_url"
    target="_blank"
    rel="noopener"
    class="modal-link modal-link--secondary"
  >
    {{ isRtl ? 'دراسة الحالة' : 'Case Study' }}
  </a>

</div>
            <div class="modal-tags">
              <span v-for="tag in (selectedProject.tags || [])" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="modal-actions">
              <button class="modal-cta" @click="$emit('scrollTo', 'contact')">
                {{ t.startProject }}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="modal-close-btn" @click="closeModal">
                {{ isRtl ? 'إغلاق' : 'Close' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { publicAxios } from '@/api/axios'
import CountUp from '@/components/common/CountUp.vue'


const props = defineProps({
  t:     { type: Object,  required: true },
  isRtl: { type: Boolean, default: false },
})
defineEmits(['scrollTo'])


const allProjects     = ref([])
const apiCategories = computed(() => {
  const map = new Map()

  allProjects.value.forEach(project => {
    if (!project.category) return

    const slug = project.category.slug

    if (!map.has(slug)) {
      map.set(slug, {
        ...project.category,
        count: 0
      })
    }

    map.get(slug).count++
  })

  return [...map.values()]
})

const loading         = ref(true)
const error           = ref(false)
const activeFilter    = ref('all')
const selectedProject = ref(null)
const visibleCount    = ref(6)

const icons = {
  all:      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  category: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>',
}

const gradientMap = {
  marketing: 'linear-gradient(135deg,#162FBB 0%,#1a3acc 100%)',
  brand:     'linear-gradient(135deg,#0e1a6e 0%,#162FBB 100%)',
  seo:       'linear-gradient(135deg,#E7AE18 0%,#f5c842 100%)',
  courses:   'linear-gradient(135deg,#162FBB 0%,#E7AE18 100%)',
  default:   'linear-gradient(135deg,#162FBB 0%,#0e1a6e 100%)',
}
const getGradient = (slug) => gradientMap[slug] || gradientMap.default

const primaryResult = (project) => {
  if (!project.results?.length) return null

  const result = project.results[0]

  return `${result.value}`
}

const fetchData = async () => {
  loading.value = true
  error.value = false

  try {
    const res = await publicAxios.get('/portfolio')

    console.log(res.data)

    allProjects.value = res.data.data || []
  } catch (e) {
    console.error('Portfolio Error:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return allProjects.value
  return allProjects.value.filter(p => p.category?.slug === activeFilter.value)
})

const visibleProjects = computed(() =>
  filteredProjects.value.slice(0, visibleCount.value)
)

const hasMore = computed(() =>
  visibleCount.value < filteredProjects.value.length
)

const setFilter = (slug) => {
  activeFilter.value = slug
  visibleCount.value = 6
}

const loadMore = () => { visibleCount.value += 3 }
const statsBar = [
  { key: 'projects_Completed', value: 100 },
  { key: 'happy_Clients', value: 300 },
  { key: 'countriesServed', value: 10 },
]

// const statsBar = [
//   { key: 'projects_Completed', value: '100+' },
//   { key: 'happy_Clients',      value: '300+' },
//   { key: 'countriesServed',   value: '10+' },
// ]

// incraze experience years
const experienceYears = computed(() => {
  return new Date().getFullYear() - 2024 + 1
})

const openModal  = (p) => { selectedProject.value = p; document.body.style.overflow = 'hidden' }
const closeModal = () => { selectedProject.value = null; document.body.style.overflow = '' }
</script>

<style scoped>
.portfolio-section { padding:6rem 0; background:#fff; position:relative; overflow:hidden; }
.bg-deco { position:absolute; inset:0; pointer-events:none; }
.deco-1 { position:absolute; width:500px; height:500px; top:-120px; right:-100px; background:radial-gradient(circle,rgba(22,47,187,.05),transparent 70%); border-radius:50%; }
.deco-2 { position:absolute; width:350px; height:350px; bottom:-80px; left:-60px; background:radial-gradient(circle,rgba(231,174,24,.06),transparent 70%); border-radius:50%; }
.deco-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(22,47,187,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(22,47,187,.025) 1px,transparent 1px); background-size:50px 50px; }

.container { max-width:1200px; margin:0 auto; padding:0 2rem; position:relative; z-index:1; }

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

/* Skeleton */
.skeleton-wrap { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:2rem; }
.skeleton-card { background:#fff; border-radius:18px; border:1px solid rgba(22,47,187,.08); overflow:hidden; }
.sk-img { height:180px; background:linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
.sk-body { padding:1.2rem; display:flex; flex-direction:column; gap:10px; }
.sk-line { height:10px; background:linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:5px; }
.sk-line.w40{width:40%} .sk-line.w80{width:80%} .sk-line.w60{width:60%}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Error / Empty */
.error-state,.empty-state { text-align:center; padding:4rem 2rem; display:flex; flex-direction:column; align-items:center; gap:1rem; }
.error-state p,.empty-state p { color:#64748b; font-size:.95rem; }
.retry-btn { padding:.5rem 1.5rem; background:#162FBB; color:#fff; border:none; border-radius:8px; font-size:.85rem; font-weight:700; cursor:pointer; font-family:inherit; }

/* Filter */
.filter-wrap { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:2.5rem; }
.filter-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; background:#F0F0F0; border:1.5px solid transparent; color:#475569; border-radius:50px; font-size:.82rem; font-weight:700; cursor:pointer; transition:all .25s; font-family:inherit; }
.filter-btn:hover { color:#162FBB; background:rgba(22,47,187,.07); border-color:rgba(22,47,187,.2); }
.filter-btn.active { background:#162FBB; color:#fff; border-color:#162FBB; }
.filter-count { background:rgba(255,255,255,.25); color:inherit; font-size:.7rem; padding:1px 6px; border-radius:50px; font-weight:800; }
.filter-btn:not(.active) .filter-count { background:rgba(22,47,187,.1); color:#162FBB; }

/* Grid */
.projects-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:2rem; }
.card-wide { grid-column:span 2; }

/* Card */
.project-card { background:#fff; border-radius:18px; border:1px solid rgba(22,47,187,.08); overflow:hidden; cursor:pointer; transition:all .35s cubic-bezier(.34,1.2,.64,1); display:flex; flex-direction:column; }
.project-card:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(22,47,187,.12); border-color:rgba(22,47,187,.2); }
.card-img { position:relative; height:180px; overflow:hidden; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.card-wide .card-img { height:200px; }
.img-pattern { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(255,255,255,.1) 1px,transparent 1px); background-size:20px 20px; }
.card-category-tag { position:absolute; top:12px; inset-inline-start:12px; background:rgba(255,255,255,.2); backdrop-filter:blur(8px); color:#fff; font-size:.7rem; font-weight:700; padding:3px 10px; border-radius:50px; border:1px solid rgba(255,255,255,.3); z-index:2; }
.card-overlay { position:absolute; inset:0; background:rgba(14,26,96,.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .3s; z-index:3; }
.project-card:hover .card-overlay { opacity:1; }
.view-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 18px; background:rgba(255,255,255,.95); color:#162FBB; border:none; border-radius:50px; font-size:.82rem; font-weight:700; cursor:pointer; font-family:inherit; transition:transform .2s; }
.view-btn:hover { transform:scale(1.05); }
.mock-screen { position:relative; z-index:1; width:75%; background:rgba(255,255,255,.12); border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,.2); }
.mock-bar { display:flex; gap:4px; padding:6px 8px; background:rgba(0,0,0,.15); }
.mock-bar span { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,.4); }
.mock-content { padding:10px; display:flex; flex-direction:column; gap:6px; }
.mock-line { height:6px; background:rgba(255,255,255,.25); border-radius:3px; }
.w80{width:80%} .w60{width:60%} .w70{width:70%}
.mock-blocks { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:2px; }
.mock-block { height:28px; background:rgba(255,255,255,.15); border-radius:5px; }
.card-info { padding:1.2rem; display:flex; flex-direction:column; gap:.55rem; flex:1; }
.card-meta { display:flex; align-items:center; justify-content:space-between; }
.meta-cat { font-size:.7rem; font-weight:700; color:#162FBB; background:rgba(22,47,187,.08); padding:2px 9px; border-radius:50px; }
.meta-year { font-size:.7rem; color:#94a3b8; font-weight:600; }
.card-title { font-size:.98rem; font-weight:800; color:#0e1a60; line-height:1.3; margin:0; }
.card-desc { font-size:.82rem; color:#64748b; line-height:1.6; margin:0; flex:1; }
.card-tags { display:flex; flex-wrap:wrap; gap:5px; }
.tag { font-size:.68rem; font-weight:600; color:#475569; background:#F0F0F0; padding:2px 8px; border-radius:5px; }
.card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:.6rem; border-top:1px solid #f0f4f8; flex-wrap:wrap; gap:8px; }
.card-stats .stat { display:inline-flex; align-items:center; gap:4px; font-size:.75rem; font-weight:700; color:#10b981; }
.details-btn { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; background:transparent; border:1.5px solid rgba(22,47,187,.2); color:#162FBB; border-radius:6px; font-size:.75rem; font-weight:700; cursor:pointer; transition:all .2s; font-family:inherit; }
.details-btn:hover { background:#162FBB; color:#fff; border-color:#162FBB; }
.details-btn svg { transition:transform .2s; }
.details-btn:hover svg { transform:translateX(3px); }

/* Load More */
.load-more-wrap { text-align:center; margin-bottom:2.5rem; }
.load-more-btn { display:inline-flex; align-items:center; gap:8px; padding:.7rem 2rem; background:transparent; border:1.5px solid #D0D6E5; color:#162FBB; border-radius:50px; font-size:.88rem; font-weight:700; cursor:pointer; transition:all .3s; font-family:inherit; }
.load-more-btn:hover { background:#162FBB; color:#fff; border-color:#162FBB; }

/* Stats Bar */
.stats-bar { display:flex; align-items:center; justify-content:center; gap:3rem; background:linear-gradient(135deg,#162FBB,#0e1a6e); border-radius:18px; padding:1.8rem 2.5rem; flex-wrap:wrap; }
.stat-item { text-align:center; }
.stat-num { font-size:2rem; font-weight:800; color:#E7AE18; line-height:1; }
.stat-lbl { font-size:.75rem; color:rgba(255,255,255,.7); margin-top:4px; letter-spacing:.04em; }
.stat-divider { width:1px; height:40px; background:rgba(255,255,255,.15); }

/* Grid Transition */
.project-grid-enter-active { transition:all .35s ease; }
.project-grid-leave-active { transition:all .25s ease; }
.project-grid-enter-from { opacity:0; transform:translateY(20px) scale(.97); }
.project-grid-leave-to   { opacity:0; transform:scale(.95); }
.project-grid-move       { transition:transform .4s ease; }

/* Modal */
.modal-overlay { position:fixed; inset:0; background:rgba(14,26,96,.6); backdrop-filter:blur(6px); z-index:2000; display:flex; align-items:center; justify-content:center; padding:1rem; }
.modal-box { background:#fff; border-radius:22px; width:100%; max-width:580px; overflow:hidden; position:relative; max-height:90vh; overflow-y:auto; }
.modal-close { position:absolute; top:14px; inset-inline-end:14px; width:34px; height:34px; background:rgba(255,255,255,.9); border:none; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:1; transition:all .2s; }
.modal-close:hover { background:#fff; box-shadow:0 2px 10px rgba(0,0,0,.1); }
.modal-img { height:220px; position:relative; display:flex; align-items:center; justify-content:center; }
.modal-mock { position:relative; z-index:1; width:65%; background:rgba(255,255,255,.12); border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,.2); }
.modal-content { padding:1.5rem; }
.modal-meta { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.modal-title { font-size:1.3rem; font-weight:800; color:#0e1a60; margin-bottom:10px; line-height:1.3; }
.modal-desc { font-size:.9rem; color:#64748b; line-height:1.7; margin-bottom:14px; }
.modal-results { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
.modal-result { display:inline-flex; align-items:center; gap:6px; background:rgba(16,185,129,.08); border:1px solid rgba(16,185,129,.2); color:#059669; padding:6px 14px; border-radius:8px; font-size:.82rem; font-weight:700; }
.modal-links { display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
.modal-link { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; background:rgba(22,47,187,.07); color:#162FBB; border-radius:8px; font-size:.8rem; font-weight:700; text-decoration:none; transition:all .2s; border:1px solid rgba(22,47,187,.15); }
.modal-link:hover { background:#162FBB; color:#fff; }
.modal-link--secondary { background:rgba(231,174,24,.08); color:#b88500; border-color:rgba(231,174,24,.2); }
.modal-link--secondary:hover { background:#E7AE18; color:#0e1a60; }
.modal-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:1.2rem; }
.modal-actions { display:flex; gap:10px; }
.modal-cta { display:inline-flex; align-items:center; gap:7px; padding:.7rem 1.4rem; background:#162FBB; color:#fff; border:none; border-radius:10px; font-size:.88rem; font-weight:700; cursor:pointer; transition:all .3s; font-family:inherit; }
.modal-cta:hover { background:#E7AE18; color:#0e1a60; }
.modal-cta svg { transition:transform .2s; }
.modal-cta:hover svg { transform:translateX(4px); }
.modal-close-btn { display:inline-flex; align-items:center; padding:.7rem 1.4rem; background:transparent; border:1.5px solid #D0D6E5; color:#475569; border-radius:10px; font-size:.88rem; font-weight:700; cursor:pointer; transition:all .2s; font-family:inherit; }
.modal-close-btn:hover { border-color:#162FBB; color:#162FBB; }
.modal-enter-active,.modal-leave-active { transition:all .3s ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }
.modal-enter-from .modal-box,.modal-leave-to .modal-box { transform:scale(.95) translateY(20px); }

/* RTL */
.rtl-portfolio { direction:rtl; }
.rtl-portfolio .details-btn svg { transform:rotate(180deg); }
.rtl-portfolio .details-btn:hover svg { transform:rotate(180deg) translateX(3px); }
.rtl-portfolio .modal-cta svg { transform:rotate(180deg); }
.rtl-portfolio .modal-cta:hover svg { transform:rotate(180deg) translateX(4px); }

/* Responsive */
@media (max-width:1024px) {
  .projects-grid { grid-template-columns:repeat(2,1fr); }
  .card-wide { grid-column:span 2; }
  .skeleton-wrap { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:640px) {
  .portfolio-section { padding:4rem 0; }
  .projects-grid { grid-template-columns:1fr; }
  .card-wide { grid-column:span 1; }
  .stats-bar { gap:1.5rem; padding:1.5rem; }
  .stat-divider { display:none; }
  .container { padding:0 1.2rem; }
  .modal-box { border-radius:16px; }
  .skeleton-wrap { grid-template-columns:1fr; }
}
</style>

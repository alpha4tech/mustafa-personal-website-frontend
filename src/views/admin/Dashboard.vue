<template>
  <div class="dashboard-page" :class="{ 'rtl': isRtl }">

    <!-- ════════════════════════════
         Welcome Banner
    ════════════════════════════ -->
    <section class="wb-banner">
      <div class="wb-top">
        <div>
          <h1 class="wb-title">
            {{ t('welcomeBack') || 'أهلاً بعودتك' }},
            <span class="wb-name">{{ userName }}</span>
            <span aria-hidden="true">👋</span>
          </h1>
          <p class="wb-sub">{{ t('DashboardSubtitle') || 'نظرة سريعة على موقعك اليوم' }} — {{ currentDate }}</p>
        </div>
        <div class="wb-last-login">
          <i class="bi bi-clock" aria-hidden="true"></i>
          {{ t('lastLogin') || 'آخر تسجيل دخول' }}: {{ lastLoginText }}
        </div>
      </div>

      <!-- Mini KPIs inside banner -->
      <div class="wb-kpis">
        <div class="wb-kpi">
          <div class="wb-kpi-v">{{ formatNumber(statistics.monthly_visits) }}</div>
          <div class="wb-kpi-l">{{ t('monthlyVisits') || 'زيارة هذا الشهر' }}</div>
        </div>
        <div class="wb-kpi">
          <div class="wb-kpi-v">{{ formatNumber(statistics.total_posts) }}</div>
          <div class="wb-kpi-l">{{ t('publishedPosts') || 'منشور منشور' }}</div>
        </div>
        <div class="wb-kpi">
          <div class="wb-kpi-v">{{ formatNumber(statistics.unread_messages) }}</div>
          <div class="wb-kpi-l">{{ t('newMessages') || 'رسالة جديدة' }}</div>
        </div>
        <div class="wb-kpi">
          <div class="wb-kpi-v">{{ statistics.uptime_percent || '99' }}%</div>
          <div class="wb-kpi-l">{{ t('uptime') || 'وقت التشغيل' }}</div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════
         Site Stats Row
    ════════════════════════════ -->
    <strong class="section-label">
      <span class="sl-line" aria-hidden="true"></span>
      {{ t('siteStats') || 'إحصاءات الموقع' }}
    </strong>

    <div class="stats-grid">
      <div class="stat-card" v-for="stat in siteStats" :key="stat.key">
        <div class="stat-ico" :class="stat.color">
          <i :class="'bi ' + stat.icon" aria-hidden="true"></i>
        </div>
        <div class="stat-body">
          <div class="stat-val">{{ stat.value }}</div>
          <div class="stat-lbl">{{ stat.label }}</div>
          <span v-if="stat.badge" class="stat-badge" :class="stat.badgeType">
            {{ stat.badge }}
          </span>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════
         Row 1 — Visitor Chart + Messages
    ════════════════════════════ -->
    <div class="row-chart-msg">

      <!-- Visitor Chart -->
      <div class="data-card chart-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-chart-bar" aria-hidden="true"></i>
            {{ t('weeklyVisitors') || 'الزوار — آخر ٧ أيام' }}
          </span>
          <button class="dc-link">{{ t('thisMonth') || 'هذا الشهر' }}</button>
        </div>
        <div class="chart-body">
          <div class="bar-chart">
            <div
              v-for="(day, i) in weeklyData"
              :key="i"
              class="bar-col"
              :class="{ 'bar-today': i === weeklyData.length - 1 }"
              :style="{ height: day.pct + '%' }"
              :title="day.label + ': ' + formatNumber(day.count)"
            ></div>
          </div>
          <div class="bar-labels">
            <span v-for="(day, i) in weeklyData" :key="i" :class="{ 'today-lbl': i === weeklyData.length - 1 }">
              {{ day.short }}
            </span>
          </div>
          <div class="chart-summary">
            <div class="cs-item">
              <div class="cs-val">{{ formatNumber(todayVisits) }}</div>
              <div class="cs-lbl">{{ t('today') || 'اليوم' }}</div>
            </div>
            <div class="cs-item">
              <div class="cs-val">{{ avgTime }}</div>
              <div class="cs-lbl">{{ t('avgTime') || 'متوسط الوقت' }}</div>
            </div>
            <div class="cs-item">
              <div class="cs-val">{{ statistics.bounce_rate || '34' }}%</div>
              <div class="cs-lbl">{{ t('bounceRate') || 'معدل الارتداد' }}</div>
            </div>
            <div class="cs-item">
              <div class="cs-val">{{ statistics.new_visitors_pct || '62' }}%</div>
              <div class="cs-lbl">{{ t('newVisitors') || 'زوار جدد' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="data-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-mail" aria-hidden="true"></i>
            {{ t('messages') || 'الرسائل' }}
            <span v-if="unreadMessages > 0" class="unread-pill">{{ unreadMessages }}</span>
          </span>
          <router-link to="/admin/contacts" class="dc-link">
            {{ t('viewAll') || 'عرض الكل' }}
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
          </router-link>
        </div>
        <div class="dc-body">
          <div v-if="loadingMessages" class="dc-spinner"><span class="spin-sm"></span></div>
          <div v-else-if="messages.length === 0" class="dc-empty">
            <i class="bi bi-inbox" aria-hidden="true"></i>
            <p>{{ t('noMessages') || 'لا توجد رسائل' }}</p>
          </div>
          <div v-else class="dc-list">
            <div
              v-for="msg in messages.slice(0, 5)"
              :key="msg.id"
              class="msg-row"
              :class="{ unread: !msg.read_at }"
              @click="goToMessage(msg.id)"
            >
              <span v-if="!msg.read_at" class="unread-dot" aria-label="غير مقروء"></span>
              <div class="msg-av" :style="msg.avatarStyle">{{ getInitials(msg.name) }}</div>
              <div class="msg-body">
                <div class="msg-name">{{ msg.name }}</div>
                <div class="msg-preview">{{ msg.message }}</div>
                <div class="msg-time">{{ msg.created_at_human }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════
         Row 2 — Top Posts · Quick Actions · Timeline
    ════════════════════════════ -->
    <div class="row-three">

      <!-- Top Posts -->
      <div class="data-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-flame" aria-hidden="true"></i>
            {{ t('trendingPosts') || 'المنشورات الرائجة' }}
          </span>
          <router-link to="/admin/blog" class="dc-link">
            {{ t('allPosts') || 'كل المنشورات' }}
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
          </router-link>
        </div>
        <div class="dc-body">
          <div v-if="loadingPosts" class="dc-spinner"><span class="spin-sm"></span></div>
          <div v-else-if="trendingPosts.length === 0" class="dc-empty">
            <i class="bi bi-file-off" aria-hidden="true"></i>
            <p>{{ t('noPosts') || 'لا توجد منشورات' }}</p>
          </div>
          <div v-else class="dc-list">
            <div v-for="post in trendingPosts.slice(0, 5)" :key="post.id" class="post-row">
              <div class="post-thumb">
                <img v-if="post.thumbnail" :src="post.thumbnail" :alt="post.title" />
                <i v-else class="bi bi-article" aria-hidden="true"></i>
              </div>
              <div class="post-info">
                <div class="post-title">{{ post.title }}</div>
                <div class="post-date">{{ post.published_at_human }}</div>
              </div>
              <div class="post-stats">
                <span class="pstat"><i class="bi bi-eye" aria-hidden="true"></i> {{ formatNumber(post.views) }}</span>
                <span class="pstat"><i class="bi bi-heart" aria-hidden="true"></i> {{ formatNumber(post.likes) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions + Tags -->
      <div class="data-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-bolt" aria-hidden="true"></i>
            {{ t('quickActions') || 'إجراءات سريعة' }}
          </span>
        </div>
        <div class="quick-actions">
          <router-link v-for="action in quickActions" :key="action.to" :to="action.to" class="qa-btn">
            <div class="qa-ico" :style="action.style">
              <i :class="'bi ' + action.icon" aria-hidden="true"></i>
            </div>
            <span class="qa-lbl">{{ action.label }}</span>
          </router-link>
        </div>

        <div class="dc-head" style="margin-top: 4px;">
          <span class="dc-title">
            <i class="bi bi-tags" aria-hidden="true"></i>
            {{ t('skills') || 'المهارات والوسوم' }}
          </span>
        </div>
        <div class="tags-wrap">
          <span v-for="tag in profileTags" :key="tag.label" class="tag" :class="'tag-' + tag.color">
            {{ tag.label }}
          </span>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="data-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-history" aria-hidden="true"></i>
            {{ t('recentActivity') || 'آخر النشاطات' }}
          </span>
        </div>
        <div class="timeline">
          <div v-for="(event, i) in activityLog" :key="i" class="tl-row" :class="{ 'tl-last': i === activityLog.length - 1 }">
            <div class="tl-ico" :class="'tl-' + event.type">
              <i :class="'bi ' + event.icon" aria-hidden="true"></i>
            </div>
            <div class="tl-body">
              <div class="tl-text" v-html="event.text"></div>
              <div class="tl-time">{{ event.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════
         Row 3 — Traffic Sources + Site Health
    ════════════════════════════ -->
    <div class="row-two" style="margin-top: 10px;">

      <!-- Traffic Sources -->
      <div class="data-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-world" aria-hidden="true"></i>
            {{ t('trafficSources') || 'مصادر الزيارات' }}
          </span>
        </div>
        <div class="dc-body">
          <div v-for="src in trafficSources" :key="src.label" class="traffic-row">
            <div class="tr-label">
              <i :class="'bi ' + src.icon" :style="{ color: src.color }" aria-hidden="true"></i>
              {{ src.label }}
            </div>
            <div class="tr-bar-wrap">
              <div class="tr-bar" :style="{ width: src.pct + '%', background: src.color }"></div>
            </div>
            <span class="tr-pct">{{ src.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- Site Health -->
      <div class="data-card">
        <div class="dc-head">
          <span class="dc-title">
            <i class="bi bi-rocket" aria-hidden="true"></i>
            {{ t('siteHealth') || 'صحة الموقع والـ SEO' }}
          </span>

                <!-- مؤشر المصدر -->
            <span class="ga-badge" :class="gaHealth ? 'ga-live' : 'ga-static'">
              <i :class="gaHealth ? 'bi bi-circle-fill' : 'bi bi-circle'"></i>
              {{ gaHealth ? 'Google Analytics' : 'بيانات تقريبية' }}
            </span>
        </div>

        <div class="dc-body">
          <div class="health-grid">
            <div v-for="metric in healthMetrics" :key="metric.label" class="health-card">
              <div class="hc-val" :style="{ color: metric.color }">{{ metric.value }}</div>
              <div class="hc-lbl">{{ metric.label }}</div>
              <div class="hc-status" :style="{ color: metric.color }">{{ metric.status }}</div>
            </div>
          </div>

          <!-- SSL Alert -->
          <div v-if="sslDaysLeft <= 30" class="ssl-alert">
            <i class="bi bi-alert-circle" aria-hidden="true"></i>
            <div>
              <div class="ssl-title">{{ t('sslWarning') || 'تنبيه: شهادة SSL' }}</div>
              <div class="ssl-sub">{{ t('sslExpiry') || 'تنتهي خلال' }} {{ sslDaysLeft }} {{ t('days') || 'يوماً' }} — {{ t('renewSoon') || 'يُنصح بالتجديد' }}</div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- ════════════════════════════
         Loading Overlay
    ════════════════════════════ -->
    <!-- <Transition name="fade">
      <div v-if="loading" class="load-overlay" role="status">
        <div class="load-box">
          <span class="spin-lg"></span>
          <p>{{ t('loading') || 'جاري التحميل...' }}</p>
        </div>
      </div>
    </Transition>-->

     <!-- Toast -->
     <!-- <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="'toast-' + toast.type" role="alert">
        <i :class="toast.type === 'success' ? 'bi bi-circle-check' : 'bi bi-circle-x'" aria-hidden="true"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>  -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettings }  from '@/composables/useSettings'
import axios from '@/api/axios'

const router    = useRouter()
const authStore = useAuthStore()
const { t, isRtl } = useSettings()

// ── State ──────────────────────────────────────────────────────────
const loading         = ref(true)
const loadingMessages = ref(false)
const loadingPosts    = ref(false)

const statistics = ref({
  total_posts: 0,
  published_posts: 0,
  draft_posts: 0,
  total_Services: 0,

  total_messages: 0,
  unread_messages: 0,

  portfolio_projects: 0,

  total_comments: 0,
  approved_comments: 0,
  pending_comments: 0
})

const messages      = ref([])
const trendingPosts = ref([])
const activityLog   = ref([])
const sslDaysLeft   = ref(14)
const toast         = ref({ show: false, message: '', type: 'success' })

// ── Computed ───────────────────────────────────────────────────────
const userName = computed(() =>
  authStore.user?.name || authStore.user?.email || 'Admin'
)

const currentDate = computed(() =>
  new Date().toLocaleDateString(isRtl.value ? 'ar-SA' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
)

const lastLoginText = computed(() => t('twoHoursAgo') || 'منذ ساعتين')
const todayVisits   = computed(() => statistics.value.today_visits   || 460)
const avgTime       = computed(() => statistics.value.avg_time_str   || '٦.٢ د')
const unreadMessages = computed(() => statistics.value.unread_messages || 0)
const gaHealth = ref(null)
const siteStats = computed(() => [
  {
    key: 'posts',
    label: t('posts' || 'المنشورات'),
    value: formatNumber(statistics.value.total_posts),
    icon: 'bi-pencil',
    color: 'ic-amber'
  },
  {
    key: 'projects',
    label: t('projects' || 'المشاريع'),
    value: formatNumber(statistics.value.portfolio_projects),
    icon: 'bi-briefcase',
    color: 'ic-teal'
  },
    {
    key: 'services',
    label: t('services' || 'الخدمات'),
    value: formatNumber(statistics.value.total_Services),
    icon: 'bi-lightbulb',
    color: 'ic-blue'
  },
  {
    key: 'comments',
    label: t('comments' || 'التعليقات'),
    value: formatNumber(statistics.value.total_comments),
    icon: 'bi-chat-dots',
    color: 'ic-blue'
  },

  {
    key: 'pending_comments',
    label: t('pending_comments' || 'تعليقات معلقة'),
    value: formatNumber(statistics.value.pending_comments),
    icon: 'bi-hourglass',
    color: 'ic-gold'
  },
  {
    key: 'messages',
    label: t('NewMessages' || 'رسائل جديدة'),
    value: formatNumber(statistics.value.unread_messages),
    icon: 'bi-envelope',
    color: 'ic-purple'
  },
  {
    key: 'total_messages',
    label: t('TotalMessages' || 'إجمالي الرسائل'),
    value: formatNumber(statistics.value.total_messages),
    icon: 'bi-envelope-open',
    color: 'ic-green'
  }
])

// ── Weekly chart data (replace with real API data) ──────────────────
const weeklyData = ref([
  { short: 'أحد', label: 'الأحد',     count: 180, pct: 35 },
  { short: 'اثن', label: 'الاثنين',   count: 280, pct: 55 },
  { short: 'ثلا', label: 'الثلاثاء',  count: 230, pct: 45 },
  { short: 'أرب', label: 'الأربعاء',  count: 360, pct: 70 },
  { short: 'خمي', label: 'الخميس',    count: 310, pct: 60 },
  { short: 'جمع', label: 'الجمعة',    count: 410, pct: 80 },
  { short: 'اليوم', label: 'اليوم',   count: 460, pct: 90 },
])

// ── Quick Actions ──────────────────────────────────────────────────
const quickActions = computed(() => [
  { to: '/admin/blog/create',            icon: 'bi-pencil',       label: t('newPost')      || 'مقال جديد',       style: 'background:rgba(22,47,187,.08);color:#162FBB' },
  { to: '/admin/portfolio/create',      icon: 'bi-briefcase',  label: t('newProject')   || 'مشروع جديد',      style: 'background:rgba(124,58,237,.08);color:#7c3aed' },
  { to: '/admin/contacts',               icon: 'bi-envelope',       label: t('replyMessages')|| 'رد الرسائل',      style: 'background:rgba(16,185,129,.08);color:#059669' },
  { to: '/admin/profile/edit',           icon: 'bi-people',  label: t('editProfile')  || 'تعديل الملف',     style: 'background:rgba(231,174,24,.1);color:#C49310' },
  { to: '/admin/services/create',        icon: 'bi-briefcase',      label: t('addservice')  || 'إضافة خدمة',        style: 'background:rgba(14,116,144,.08);color:#0e7490' },
  { to: '/admin/settings',               icon: 'bi-gear-wide-connected',   label: t('settings')     || 'الإعدادات',       style: 'background:rgba(220,38,38,.07);color:#dc2626' },
])

// ── Profile Tags ───────────────────────────────────────────────────


// ── Traffic Sources ────────────────────────────────────────────────
const trafficSources = ref([
  { label: 'بحث جوجل',       icon: 'bi-search',          color: '#162FBB', pct: 48 },
  { label: 'زيارة مباشرة',   icon: 'bi-link',            color: '#E7AE18', pct: 24 },
  { label: 'تواصل اجتماعي',  icon: 'bi-facebook',   color: '#0e7490', pct: 18 },
  { label: 'مواقع خارجية',   icon: 'bi-globe',   color: '#7c3aed', pct: 10 },
])

// ── Site Health Metrics ────────────────────────────────────────────
// const healthMetrics = computed(() => [
//   { label: t('pageSpeed') || 'سرعة الصفحة', value: statistics.value.page_speed || 92, color: '#059669', status: '● ' + (t('excellent') || 'ممتاز') },
//   { label: t('seoScore')  || 'تقييم SEO',   value: statistics.value.seo_score  || 87, color: '#162FBB', status: '● ' + (t('veryGood') || 'جيد جداً') },
//   { label: t('uxScore')   || 'تجربة المستخدم',value: statistics.value.ux_score || 74, color: '#d97706', status: '● ' + (t('good') || 'جيد') },
//   { label: t('uptime')    || 'وقت التشغيل', value: (statistics.value.uptime_percent || 99) + '%', color: '#0e7490', status: '● ' + (t('excellent') || 'ممتاز') },
// ])

const healthMetrics = computed(() => {
    if (gaHealth.value) {
        const h = gaHealth.value

        const scoreColor = (v) =>
            v >= 80 ? '#059669' : v >= 60 ? '#d97706' : '#dc2626'
        const scoreLabel = (v) =>
            v >= 80 ? (t('excellent') || 'ممتاز') : v >= 60 ? (t('good') || 'جيد') : (t('needsWork') || 'يحتاج تحسين')

        const engNum = parseInt(h.engagement_rate)
        const bNum   = parseInt(h.bounce_rate)
        const oNum   = h.overall_score

        return [
            {
                label:  t('engagementRate') || 'معدل التفاعل',
                value:  h.engagement_rate,
                color:  scoreColor(engNum),
                status: '● ' + scoreLabel(engNum),
            },
            {
                label:  t('avgSession')   || 'متوسط الجلسة',
                value:  h.avg_session,
                color:  '#162FBB',
                status: '● ' + (t('minutes') || 'دقيقة'),
            },
            {
                label:  t('bounceRate')   || 'معدل الارتداد',
                value:  h.bounce_rate,
                color:  scoreColor(100 - bNum),
                status: '● ' + scoreLabel(100 - bNum),
            },
            {
                label:  t('overallScore') || 'التقييم العام',
                value:  oNum,
                color:  scoreColor(oNum),
                status: '● ' + scoreLabel(oNum),
            },
        ]
    }

    // fallback static
    return [
        { label: t('pageSpeed') || 'سرعة الصفحة', value: 92, color: '#059669', status: '● ' + (t('excellent') || 'ممتاز') },
        { label: t('seoScore')  || 'تقييم SEO',   value: 87, color: '#162FBB', status: '● ' + (t('veryGood') || 'جيد جداً') },
        { label: t('uxScore')   || 'تجربة المستخدم', value: 74, color: '#d97706', status: '● ' + (t('good') || 'جيد') },
        { label: t('uptime')    || 'وقت التشغيل', value: (statistics.value.uptime_percent || 99) + '%', color: '#0e7490', status: '● ' + (t('excellent') || 'ممتاز') },
    ]
})

// ── Helpers ────────────────────────────────────────────────────────
const formatNumber = (v) =>
  new Intl.NumberFormat(isRtl.value ? 'ar-SA' : 'en-US').format(Number(v) || 0)

const getInitials = (name) => {
  if (!name) return 'U'
  return name.trim().split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const avatarGradients = [
  'linear-gradient(135deg,#162FBB,#0A1870)',
  'linear-gradient(135deg,#7c3aed,#5b21b6)',
  'linear-gradient(135deg,#059669,#047857)',
  'linear-gradient(135deg,#d97706,#b45309)',
  'linear-gradient(135deg,#0e7490,#0c4a6e)',
]
const assignAvatar = (msg, index) => {
  msg.avatarStyle = { background: avatarGradients[index % avatarGradients.length] }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

const goToMessage = (id) => router.push(`/admin/contacts/${id}`)

// ── API ────────────────────────────────────────────────────────────
const fetchDashboard = async () => {
  loading.value = true
  try {
    await authStore.fetchUser()
    const { data } = await axios.get('/dashboard')

    console.log('Dashboard Response:', data)
    statistics.value  = data.statistics     || statistics.value
    messages.value    = (data.messages      || []).map((m, i) => { assignAvatar(m, i); return m })
    trendingPosts.value = data.trending_posts || []
    activityLog.value = data.activity_log   || getDefaultActivity()

        // Traffic Sources من GA
    if (data.traffic_sources) {
        trafficSources.value = data.traffic_sources
    }

    // Site Health من GA
    if (data.site_health) {
        gaHealth.value = data.site_health
    }

    // Weekly visits من GA
    if (data.weekly_visits) {
        weeklyData.value = data.weekly_visits
    }

    if (data.weekly_visits) weeklyData.value = data.weekly_visits
    if (data.ssl_days_left !== undefined) sslDaysLeft.value = data.ssl_days_left

  } catch (err) {
    console.error('Dashboard fetch error:', err)
    // Use defaults on error so the page still looks good
    activityLog.value = getDefaultActivity()
    showToast(t('fetchError') || 'فشل تحميل بعض البيانات', 'error')
  } finally {
    loading.value = false
  }
}

const getDefaultActivity = () => [
  { type: 'blue',  icon: 'bi-pencil',            text: 'نشرت مقال <b>Vue 3 مقابل React</b>',   time: 'منذ ٣ ساعات' },
  { type: 'green', icon: 'bi-envelope',             text: 'رددت على رسالة <b>محمد علي</b>',        time: 'منذ ٥ ساعات' },
  { type: 'amber', icon: 'bi-briefcase',        text: 'أضفت مشروعاً جديداً للمحفظة',           time: 'أمس، ٨:٣٠ م' },
  { type: 'blue',  icon: 'bi-camera',            text: 'حدّثت صورة الملف الشخصي',               time: 'أمس، ٣:١٥ م' },
]

onMounted(fetchDashboard)
</script>

<style scoped>
/* ─── Page ─── */
.dashboard-page {
  padding: 1.3rem;
  min-height: 100vh;
  background: #F0F0F0;
}
.dashboard-page.rtl { direction: rtl; }

/* ─── Welcome Banner ─── */
.wb-banner {
  background: linear-gradient(135deg, #0A1870 0%, #0F2196 55%, #162FBB 100%);
  border-radius: 14px;
  padding: 20px 24px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 3px 0 0 #E7AE18;
  margin-bottom: 14px;
}
.wb-banner::before {
  content: '';
  position: absolute; top: -50px; inset-inline-end: -30px;
  width: 200px; height: 200px; border-radius: 50%;
  background: rgba(231, 174, 24, .07); pointer-events: none;
}

.wb-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px; position: relative; z-index: 1;
}
.wb-title   { font-size: 17px; font-weight: 600; margin: 0 0 4px; }
.wb-name {
  background: rgba(231, 174, 24, .18);
  border: 1px solid rgba(231, 174, 24, .35);
  padding: 1px 11px; border-radius: 20px; color: #F5C842;
}
.wb-sub { font-size: 12px; opacity: .72; margin: 0; }
.wb-last-login {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.14);
  padding: 6px 13px; border-radius: 9px; font-size: 11.5px;
  display: flex; align-items: center; gap: 6px; backdrop-filter: blur(8px);
  white-space: nowrap;
}

.wb-kpis {
  display: flex; gap: 24px; flex-wrap: wrap;
  margin-top: 14px; padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,.1);
  position: relative; z-index: 1;
}
.wb-kpi-v { font-size: 20px; font-weight: 700; color: #F5C842; }
.wb-kpi-l { font-size: 11px; opacity: .65; margin-top: 1px; }

/* ─── Section label ─── */
.section-label {
  display: flex; align-items: center; gap: 7px;
  font-size: 10.5px; font-weight: 700; letter-spacing: .8px;
  text-transform: uppercase; color: #7A8CAB; margin-bottom: 7px;
}
.sl-line {
  width: 14px; height: 1.5px;
  background: linear-gradient(90deg, #E7AE18, transparent); flex-shrink: 0;
}

/* ─── Stats grid ─── */
.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 10px; margin-bottom: 12px;
}
.stat-card {
  background: #fff; border-radius: 11px; border: 1px solid #D0D6E5;
  padding: 13px 14px; display: flex; align-items: center; gap: 11px;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 5px 18px rgba(22,47,187,.08); }
.stat-ico {
  width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.ic-blue   { background: rgba(22,47,187,.08);  color: #162FBB; }
.ic-green  { background: rgba(16,185,129,.10); color: #059669; }
.ic-amber  { background: rgba(217,119,6,.10);  color: #d97706; }
.ic-purple { background: rgba(124,58,237,.09); color: #7c3aed; }
.ic-teal   { background: rgba(20,184,166,.10); color: #0f766e; }
.ic-cyan   { background: rgba(14,116,144,.10); color: #0e7490; }
.ic-gold   { background: rgba(231,174,24,.12); color: #C49310; }
.ic-gray   { background: #F1F5F9;              color: #64748b; }
.stat-val  { font-size: 19px; font-weight: 700; color: #0D1830; }
.stat-lbl  { font-size: 11px; color: #7A8CAB; margin-top: 2px; }
.stat-badge {
  display: inline-block; padding: 2px 7px; border-radius: 20px;
  font-size: 10px; font-weight: 600; margin-top: 4px;
}
.badge-up   { background: #dcfce7; color: #15803d; }
.badge-warn { background: rgba(217,119,6,.12); color: #d97706; }
.badge-info { background: rgba(22,47,187,.1);  color: #162FBB; }

/* ─── Row layouts ─── */
.row-chart-msg {
  display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-bottom: 10px;
}
.row-three {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
}
.row-two {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}

/* ─── Data Card ─── */
.data-card {
  background: #fff; border-radius: 11px; border: 1px solid #D0D6E5; overflow: hidden;
}
.dc-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE;
}
.dc-title {
  font-size: 12.5px; font-weight: 600; color: #0D1830;
  display: flex; align-items: center; gap: 6px;
}
.dc-title i { color: #162FBB; font-size: 15px; }
.dc-link {
  font-size: 11px; color: #162FBB; font-weight: 500;
  text-decoration: none; display: flex; align-items: center; gap: 3px;
  background: none; border: none; cursor: pointer; transition: color .15s;
}
.dc-link:hover { color: #0F2196; }
.dc-body { padding: 8px; max-height: 280px; overflow-y: auto; }
.dc-spinner { text-align: center; padding: 22px; }
.dc-empty   { text-align: center; padding: 22px; color: #94a3b8; font-size: 12.5px; }
.dc-empty i { font-size: 24px; display: block; margin-bottom: 5px; opacity: .45; }
.dc-list    { display: flex; flex-direction: column; gap: 5px; }

/* ─── Visitor Chart ─── */
.chart-card { grid-column: span 1; }
.chart-body { padding: 10px 14px; }
.bar-chart {
  display: flex; align-items: flex-end; gap: 5px;
  height: 80px; margin-bottom: 6px;
}
.bar-col {
  flex: 1; border-radius: 4px 4px 0 0;
  background: rgba(22,47,187,.14); transition: background .2s; cursor: pointer;
}
.bar-col:hover  { background: rgba(22,47,187,.3); }
.bar-today      { background: #162FBB !important; }
.bar-today:hover{ background: #0F2196 !important; }
.bar-labels {
  display: flex; gap: 5px;
}
.bar-labels span {
  flex: 1; font-size: 9.5px; color: #7A8CAB; text-align: center;
}
.today-lbl { color: #162FBB !important; font-weight: 600; }
.chart-summary {
  display: flex; gap: 12px; margin-top: 10px; padding-top: 10px;
  border-top: 1px solid #D0D6E5; flex-wrap: wrap;
}
.cs-val { font-size: 14px; font-weight: 700; color: #0D1830; }
.cs-lbl { font-size: 10.5px; color: #7A8CAB; }

/* ─── Messages ─── */
.unread-pill {
  background: rgba(22,47,187,.1); color: #162FBB;
  font-size: 10px; padding: 1px 7px; border-radius: 20px; font-weight: 700;
  margin-inline-start: 4px;
}
.msg-row {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 9px 10px; background: #F8FAFC; border-radius: 9px;
  border: 1px solid #E8EDF5; cursor: pointer; position: relative;
  transition: background .15s;
}
.msg-row:hover  { background: #EEF2FF; }
.msg-row.unread { background: #EEF4FF; border-color: rgba(22,47,187,.15); }
.unread-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #162FBB;
  position: absolute; top: 12px; inset-inline-end: 10px; flex-shrink: 0;
}
.msg-av {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 11px; font-weight: 700;
}
.msg-name    { font-size: 12.5px; font-weight: 600; color: #0D1830; }
.msg-preview { font-size: 11.5px; color: #7A8CAB; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.msg-time    { font-size: 10.5px; color: #7A8CAB; margin-top: 2px; }

/* ─── Posts ─── */
.post-row {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 9px; background: #F8FAFC; border-radius: 9px;
  border: 1px solid #E8EDF5; transition: background .15s;
}
.post-row:hover { background: #EEF2FF; }
.post-thumb {
  width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
  background: #E8EDF5; overflow: hidden; display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #7A8CAB;
}
.post-thumb img { width: 100%; height: 100%; object-fit: cover; }
.post-info  { flex: 1; min-width: 0; }
.post-title { font-size: 12.5px; font-weight: 600; color: #0D1830; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post-date  { font-size: 11px; color: #7A8CAB; margin-top: 1px; }
.post-stats { display: flex; gap: 8px; flex-shrink: 0; }
.pstat { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #7A8CAB; }
.pstat i { font-size: 12px; }

/* ─── Quick Actions ─── */
.quick-actions {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; padding: 10px 12px;
}
.qa-btn {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding: 11px 6px; border-radius: 9px; border: 1px solid #D0D6E5;
  background: #F8FAFC; cursor: pointer; text-decoration: none;
  transition: all .18s;
}
.qa-btn:hover { background: #EEF2FF; border-color: rgba(22,47,187,.25); }
.qa-ico {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.qa-lbl { font-size: 11px; font-weight: 500; color: #0D1830; text-align: center; }

/* ─── Tags ─── */
.tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding: 9px 12px; }
.tag {
  padding: 4px 11px; border-radius: 20px; font-size: 11.5px; font-weight: 500;
  cursor: pointer; transition: all .15s;
}
.tag-blue   { background: rgba(22,47,187,.08);  color: #162FBB; border: 1px solid rgba(22,47,187,.18); }
.tag-gold   { background: rgba(231,174,24,.1);  color: #C49310; border: 1px solid rgba(231,174,24,.25); }
.tag-green  { background: rgba(16,185,129,.08); color: #059669; border: 1px solid rgba(16,185,129,.18); }
.tag-purple { background: rgba(124,58,237,.08); color: #7c3aed; border: 1px solid rgba(124,58,237,.18); }
.tag-teal   { background: rgba(14,116,144,.08); color: #0e7490; border: 1px solid rgba(14,116,144,.18); }
.tag-blue:hover   { background: rgba(22,47,187,.15); }
.tag-gold:hover   { background: rgba(231,174,24,.18); }
.tag-green:hover  { background: rgba(16,185,129,.15); }
.tag-purple:hover { background: rgba(124,58,237,.14); }

/* ─── Timeline ─── */
.timeline { padding: 8px 10px; }
.tl-row {
  display: flex; gap: 10px; margin-bottom: 10px; position: relative;
}
.tl-row:not(.tl-last)::before {
  content: '';
  position: absolute;
  top: 22px; inset-inline-start: 10px;
  width: 1px; bottom: -10px;
  background: #E8EDF5;
}
.tl-ico {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; z-index: 1;
  display: flex; align-items: center; justify-content: center; font-size: 11px;
}
.tl-blue   { background: rgba(22,47,187,.1);  color: #162FBB; }
.tl-green  { background: #dcfce7;             color: #15803d; }
.tl-amber  { background: rgba(217,119,6,.12); color: #d97706; }
.tl-red    { background: #fee2e2;             color: #dc2626; }
.tl-purple { background: rgba(124,58,237,.1); color: #7c3aed; }
.tl-text   { font-size: 12.5px; color: #0D1830; line-height: 1.4; }
.tl-time   { font-size: 10.5px; color: #7A8CAB; margin-top: 1px; }

/* ─── Traffic Sources ─── */
.traffic-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
}
.traffic-row:last-child { margin-bottom: 0; }
.tr-label { font-size: 12.5px; color: #0D1830; display: flex; align-items: center; gap: 5px; width: 130px; flex-shrink: 0; }
.tr-bar-wrap { flex: 1; height: 6px; background: #E8EDF5; border-radius: 4px; overflow: hidden; }
.tr-bar { height: 100%; border-radius: 4px; transition: width .5s ease; }
.tr-pct { font-size: 12px; font-weight: 600; color: #0D1830; width: 35px; text-align: end; flex-shrink: 0; }

/* ─── Site Health ─── */
.health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
.health-card {
  background: #F8FAFC; border-radius: 9px; border: 1px solid #E8EDF5;
  padding: 10px; text-align: center;
}
.hc-val    { font-size: 22px; font-weight: 700; }
.hc-lbl    { font-size: 10.5px; color: #7A8CAB; margin-top: 2px; }
.hc-status { font-size: 9.5px; margin-top: 3px; }

.ssl-alert {
  background: rgba(220,38,38,.05); border: 1px solid rgba(220,38,38,.12);
  border-radius: 9px; padding: 9px 11px;
  display: flex; align-items: flex-start; gap: 8px;
}
.ssl-alert i     { color: #dc2626; font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.ssl-title       { font-size: 12px; font-weight: 600; color: #dc2626; }
.ssl-sub         { font-size: 11px; color: #7A8CAB; margin-top: 1px; }

/* ─── Spinners ─── */
.spin-sm {
  display: block; width: 24px; height: 24px; margin: 0 auto;
  border: 3px solid #D0D6E5; border-top-color: #162FBB;
  border-radius: 50%; animation: spin 1s linear infinite;
}
.spin-lg {
  display: block; width: 44px; height: 44px; margin: 0 auto .6rem;
  border: 4px solid rgba(255,255,255,.2); border-top-color: #E7AE18;
  border-radius: 50%; animation: spin 1s linear infinite;
}

.ga-badge {
  font-size: 10px; padding: 2px 8px; border-radius: 20px;
  display: flex; align-items: center; gap: 4px; font-weight: 500;
}
.ga-live   { background: #dcfce7; color: #15803d; }
.ga-live i { font-size: 7px; }
.ga-static { background: #f1f5f9; color: #64748b; }

/* ─── Loading Overlay ─── */
.load-overlay {
  position: fixed; inset: 0; background: rgba(10,24,112,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; backdrop-filter: blur(5px);
}
.load-box { text-align: center; color: #fff; }
.load-box p { font-size: .88rem; opacity: .85; }

/* ─── Toast ─── */
.toast {
  position: fixed; bottom: 1.3rem; inset-inline-end: 1.3rem;
  padding: 9px 15px; border-radius: 10px; color: #fff;
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 500; z-index: 3000;
  box-shadow: 0 8px 28px rgba(0,0,0,.18);
}
.toast-success { background: #10b981; }
.toast-error   { background: #ef4444; }

/* ─── Transitions ─── */
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from  { transform: translateY(14px); opacity: 0; }
.toast-leave-to    { transform: translateY(8px); opacity: 0; }
.fade-enter-active, .fade-leave-active   { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to         { opacity: 0; }

@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Responsive ─── */
@media (max-width: 1200px) {
  .stats-grid     { grid-template-columns: repeat(4, 1fr); }
  .row-three      { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 992px) {
  .stats-grid     { grid-template-columns: repeat(2, 1fr); }
  .row-chart-msg  { grid-template-columns: 1fr; }
  .row-three      { grid-template-columns: 1fr 1fr; }
  .row-two        { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .dashboard-page { padding: .9rem; }
  .stats-grid     { grid-template-columns: repeat(2, 1fr); }
  .row-three      { grid-template-columns: 1fr; }
  .wb-kpis        { gap: 14px; }
}
@media (max-width: 420px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
</style>

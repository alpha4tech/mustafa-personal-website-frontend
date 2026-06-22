<template>
  <div :class="['app', { rtl: isRTL, dark: isDark }]">

    <ProgressBar :progress-width="progressWidth" />
    <AllanSlider @scroll-to="scrollToSection" />

    <AppNavbar
      :t="t"
      :isRTL="isRTL"
      :isDark="isDark"
      :isMobileMenuOpen="isMobileMenuOpen"
      :activeSection="activeSection"
      @toggle-lang="toggleLang"
      @toggle-theme="toggleTheme"
      @toggle-mobile-menu="toggleMobileMenu"
      @scroll-to="scrollTo"
    />

    <MobileNav
      :is-open="isMobileMenuOpen"
      :t="t"
      :isRTL="isRTL"
      @scroll-to="scrollTo"
      @close-mobile-menu="closeMobileMenu"
      @toggle-lang="toggleLang"
    />

    <main class="main">
      <HomeSection   :t="t" @scroll-to="scrollTo" />
      <AboutSection  :t="t" :isRtl="isRTL" />
      <ServicesSection  :t="t" :isRtl="isRTL" />
      <PortfolioSection :t="t" :isRtl="isRTL" @scroll-to="scrollTo" />
      <BlogSection :t="t" :isRtl="isRTL" @scroll-to="scrollTo" />
      <ContactSection   :t="t" :isRtl="isRTL" />
      <FloatingConsultButton :t="t" />
    </main>

    <AppFooter :t="t" :isRtl="isRTL" @scroll-to="scrollTo" />
    <!-- <FloatingWhatsApp /> -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppNavbar       from './AppNavbar.vue'
import MobileNav       from './MobileNav.vue'
import ProgressBar     from '../common/ProgressBar.vue'
import AppFooter       from './AppFooter.vue'
import HomeSection     from '../sections/HomeSection.vue'
import AboutSection    from '../sections/AboutSection.vue'
import PortfolioSection from '../sections/PortfolioSection.vue'
import ServicesSection from '../sections/ServicesSection.vue'
import BlogSection from '../sections/BlogSection.vue'
import ContactSection from '../sections/ContactSection.vue'
//import FloatingWhatsApp from '@/components/common/FloatingWhatsApp.vue'
import FloatingConsultButton from '../common/FloatingConsultButton.vue'


/* ── State ──────────────────────────────────────── */
const isDark          = ref(false)
const isRTL           = ref(false)
const isMobileMenuOpen = ref(false)
const progressWidth   = ref(0)
const activeSection   = ref('home')

/* ── Translations ───────────────────────────────── */
const translations = {
  en: {
    /* Navbar & general */
    logoText:    'Mustafa',
    home:        'Home',
    about:       'About Me',
    services:    'Services',
    portfolio:   'Portfolio',
    blog:        'Blog',
    contactMe:     'Contact Me',

    /* Hero */
    welcomeBadge:      'Welcome to My World',
    heroTitlePrefix:   "I'm",
    heroName:          'Mustafa',
    iAm:               "I'm a",
    heroDescription: 'I help you grow your brand and achieve your marketing goals through innovative and effective digital strategies, creating impactful content that reaches faster, drives conversions, increases your sales, and pushes business growth.',
    viewWork:          'My Work',
    yearsExperience:   '3',
    yearsLabel:        'Years Experience',
    projectsCompleted: '100',
    projectsLabel:     'Projects Done',
    happyClients:      '300',
    clientsLabel:      'Happy Clients',
    clientSatisfaction:'Client Satisfaction',
    avgRating:         'Avg. Rating',
    scroll:            'Scroll',
    goldArcBadge:      'DIGITAL MARKETING • EXPERT •',

    // About
    aboutBadge: 'About Me',
    aboutTitle: 'Who I Am',
    aboutSubtitle: 'Specialized in digital marketing and brand management with over 3 years of experience',
    aboutMainTitle: 'I am a professional digital growth marketing specialist',
    aboutText2: 'I help businesses and individuals build a strong digital presence and achieve their marketing goals through innovative, tailor-made strategies. With my experience managing successful marketing campaigns across multiple platforms, I offer comprehensive solutions that combine planning, creativity, and data.',
    missionTitle: 'Mission',
    missionText: 'To drive business growth through innovative and customized marketing solutions that achieve marketing objectives, propel growth, and deliver measurable results.',
    visionTitle: 'Vision',
    visionText:'To be a recognized authority in digital marketing, based on the strength of experience, excellence, and tangible results.',
    coreValuesTitle: 'Values',
    value1: 'Excellence',
    value2: 'Innovation',
    value3: 'Integrity',
    value4: 'Accuracy',
    value5: 'Transparency',
    signature: 'Quality You Can Trust',
    startProject: 'Start Your Project',
    yearsOfExcellence: 'Years Experience',
    expertTeam: 'Success Partners',
    countriesServed: 'Countries',
    projects_Completed: 'projects Completed',
    happy_Clients: 'happy Clients',
    trustedBy: 'Trusted by 50+ companies',

    /* Services */
    ServiceBadge: 'My Services',
    ServiceTitlePrefix: 'Services',
    ServiceTitleHighlight: 'What I Offer',
    ServiceSubtitle: 'I provide a comprehensive suite of digital marketing services to boost your online presence and achieve your goals',
    readMore: 'Learn More',
    requestService: 'Request',
    morePoints: 'more items',
    cta: 'Let me help you choose the right service.',
    // cta: 'Not sure which service is right for you? Message me on WhatsApp for a free 30-minute consultation.',
    ctaTagline: 'Chat on WhatsApp',

    error: 'Failed to load services, please try again.',
    retry: 'Retry',
    serviceDetail: 'Service Details',
    whatIncluded: "What's Included",
    requestNow: 'Request This Service',
    close: 'Close',
    requestEyebrow: 'Request Service',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'e.g. 0912345678',
    emailLabel: 'Email Address',
    emailPlaceholder: 'example@email.com',
    optional: 'optional',
    messageLabel: 'Your Message',
    messagePlaceholder: 'Tell us about your project or what you need...',
    sending: 'Sending...',
    sendRequest: 'Send Request',
    successTitle: 'Sent Successfully!',
    successMsg: "Thank you! We'll get back to you as soon as possible.",
    nameRequired: 'Name is required',
    phoneRequired: 'Phone number is required',
    orderService: 'Order Service',
    popular: 'Most Popular',
    bannerTitle: "Not sure which service is right for you?",
    bannerDesc: 'Contact me and get a free 30-minute consultation',
    freeConsult: 'Get Free Consultation',
    srvMarketingTitle: 'Digital Marketing', srvMarketingDesc: 'Integrated marketing strategies to boost sales and achieve your goals',
    srvMarketingF1: 'Ad campaign management', srvMarketingF2: 'Performance analytics', srvMarketingF3: 'Precise targeting',
    srvSeoTitle: 'SEO Services', srvSeoDesc: 'Improve your website visibility in search results and grow organic traffic',
    srvSeoF1: 'Keyword research', srvSeoF2: 'Content optimization', srvSeoF3: 'Link building',
    srvBrandTitle: 'Brand Building', srvBrandDesc: 'Build a strong visual identity and distinctive digital presence that reflects your value',
    srvBrandF1: 'Brand strategy', srvBrandF2: 'Identity definition', srvBrandF3: 'Content plan',
    srvLinkedinTitle: 'Professional LinkedIn', srvLinkedinDesc: 'Optimize your profile and build a strong professional network',
    srvLinkedinF1: 'Profile optimization', srvLinkedinF2: 'Content strategy', srvLinkedinF3: 'Network building',
    srvCvTitle: 'Professional CV', srvCvDesc: 'Design and write a CV that highlights your skills and attracts employers',
    srvCvF1: 'Modern design', srvCvF2: 'Professional writing', srvCvF3: 'Arabic & English versions',
    srvCoursesTitle: 'Training Courses', srvCoursesDesc: 'Specialized courses in digital marketing and brand building',
    srvCoursesF1: 'Digital marketing', srvCoursesF2: 'Social media management', srvCoursesF3: 'Certified certificate',
    srvConsultTitle: 'Marketing Consulting', srvConsultDesc: 'Tailored consultation sessions to identify growth opportunities',
    srvConsultF1: 'Current situation analysis', srvConsultF2: 'Clear action plan', srvConsultF3: 'Ongoing follow-up',
    srvWebTitle: 'Website Optimization', srvWebDesc: 'Help your website reach target customers and increase conversions',
    srvWebF1: 'Conversion rate optimization', srvWebF2: 'Visitor behavior analysis', srvWebF3: 'A/B testing',

    /* Portfolio */
    portfolioBadge: 'Portfolio',
    portfolioTitlePrefix: 'Work That',
    portfolioTitleHighlight: 'Delivered Real Results',
    portfolioSubtitle: 'Completed projects with measurable results for clients across various sectors',
    filterAll: 'All', filterMarketing: 'Marketing', filterBrand: 'Branding',
    filterSeo: 'SEO', filterCourses: 'Courses',
    viewProject: 'View Project', viewDetails: 'Details',
    loadMore: 'Load More', resultLabel: 'Result:',
    close: 'Close',
    proj1Title: 'Integrated Campaign for E-commerce Store',
    proj1Desc: 'Managing Meta and Google Ads campaigns to boost sales and improve ROI',
    proj2Title: 'Brand Identity for a Startup',
    proj2Desc: 'Full brand strategy, visual identity and digital content from scratch',
    proj3Title: 'SEO for a Service Website',
    proj3Desc: 'Growing organic traffic and improving Google search visibility',
    proj4Title: 'Social Media Management for a Brand',
    proj4Desc: 'Creative content, reels and live sessions to grow engagement',
    proj5Title: 'Complete Digital Marketing Course',
    proj5Desc: 'Comprehensive Arabic course covering all modern marketing tools',
    proj6Title: 'Personal Brand on LinkedIn',
    proj6Desc: 'Transforming a regular account into a recognized industry authority',
    proj7Title: 'Local SEO for Restaurant Chain',
    proj7Desc: 'Improving local presence on Google Maps and nearby search results',
    proj8Title: 'Email Marketing Campaign for B2B',
    proj8Desc: 'Building an email list and automating campaigns to increase conversions',

    /* Blog */
    blogBadge: 'Blog',
    blogTitlePrefix: 'Marketing',
    blogTitleHighlight: 'Insights',
    blogSubtitle: 'Expert content on digital marketing, branding, and growth strategies',
    filterLinkedin: 'LinkedIn', filterTips: 'Tips',
    featured: 'Featured', minRead: 'min read', readMore: 'Read Article',
    loadMore: 'Load More', close: 'Close',

    blog0Title: 'How to Double Your ROI from Meta Ads in 2025',
    blog0Excerpt: 'A comprehensive guide to setting up and managing effective Meta Ads campaigns that deliver real return on investment.',
    blog1Title: '5 SEO Mistakes That Are Destroying Your Google Ranking',
    blog1Excerpt: 'The most common mistakes website owners make and how to avoid them to improve your search rankings.',
    blog2Title: 'How to Build an Unforgettable Brand Identity in 7 Steps',
    blog2Excerpt: 'A strong visual identity is not a luxury but a necessity for every business that wants to grow and stand out.',
    blog3Title: 'The Complete Guide to a LinkedIn Profile That Attracts Clients',
    blog3Excerpt: 'How to transform your LinkedIn profile into a magnet for clients and professional opportunities.',
    blog4Title: '10 Free Tools Every Professional Marketer Uses',
    blog4Excerpt: 'Free tools that help you complete your marketing work with higher efficiency and less time.',
    blog5Title: 'Email Marketing in 2025: Is It Still Effective?',
    blog5Excerpt: 'The honest answer with recent numbers and statistics plus best automation practices.',
    blog6Title: 'The Content Strategy That Doubles Your Website Traffic',
    blog6Excerpt: 'A comprehensive content plan combining SEO and creativity to attract visitors and convert them into clients.',
    blog7Title: 'Your Personal Story: The Most Powerful Marketing Tool You Own',
    blog7Excerpt: 'How to turn your personal experience into content that builds deep trust with your audience.',
    blog8Title: 'The 8 Best AI Tools for Marketers in 2025',
    blog8Excerpt: 'AI tools that are changing the way marketing works and saving hours of work.',

    /* Contact */
    contactBadge: 'Contact Me',
    contactTitlePrefix: 'Ready to Grow Your',
    contactTitleHighlight: 'Business?',
    contactSubtitle: 'Let’s discuss your project and create an effective marketing strategy that helps you reach your audience and achieve your goals',
    phoneLabel: 'Phone', phoneValue: '+249 924535131', phoneNote: 'Available 24/7',
    emailLabel: 'Email', emailValue: 'info@mustafahasbsido.com', emailNote: 'Reply within 24 hours',
    locationLabel: 'Location', locationCity: 'Khortoum Sudan', locationNote: 'Available for remote work',
    hoursLabel: 'Working Days', weekdays: 'Available All Days',
    sendMessage: 'Send Me a Message', formSubtitle: "I'll get back to you within 24 hours",
    nameLabel: 'Name', namePlaceholder: 'Enter your full name',
    emailPlaceholder: 'Enter your email address',
    subjectLabel: 'Subject', subjectPlaceholder: 'Write a Service that you want',
    messageLabel: 'Message', messagePlaceholder: 'Tell me about your project...',
    sending: 'Sending...', send: 'Send Message',
    sendError: 'An error occurred, please try again.',
    followUs: 'Follow Me', availableNow: 'Available now for new projects',
    errorRequired: 'This field is required', errorEmail: 'Invalid email address', errorMessage: 'Message is too short',
    subjMarketing: 'Digital Marketing', subjBrand: 'Brand Building', subjSeo: 'SEO Services',
    subjLinkedin: 'Professional LinkedIn', subjCv: 'CV Writing', subjCourses: 'Training Course',
    subjConsult: 'Marketing Consultation', subjOther: 'Other',
    sendSuccess: 'Your message has been sent successfully! I will contact you soon.',
    consultButton: 'Get a Free Consultation',

    /* Footer */
    footerTagline:    'Mustafa Hasb Sido',
    footerDescription:'Marketing Specialist | Social Media Marketing Specialist | Content Creator & Copywriter & Scriptwriter | 3+ Years | HubSpot & Google 10+ CertifiedIn | Helping SMEs & Agencies Growth On Social Media Gulf & Middle East & North Africa.',
    quickLinks:       'Quick Links',
    ourServices:      'My Services',
    contactInfo:      'Contact Info',
    workHours:        'Sun - Thu : 9:00 AM - 9:00 PM',
    newsletterTitle:  'Subscribe to Newsletter',
    newsletterDesc:   'Get the latest updates and offers',
    subscribe:        'Subscribe',
    allRightsReserved:'All Rights Reserved',
    locationAddress: 'Khortoum - Sudan',
    privacyPolicy:    'Privacy Policy',
    termsOfService:   'Terms of Service',
    cookiesPolicy:    'Cookies Policy',
    footerService1: 'Digital Marketing Strategy',
    footerService2: 'Paid Advertising Management',
    footerService3: 'Social Media Marketing',
    footerService4: 'Search Engine Optimization',
    footerService5: 'Content Marketing',
    footerService6: 'Brand Management',
    footerService7: 'Marketing Analytics',
    footerService8: 'LinkedIn Marketing',
    footerService9: 'Digital Presence Development',
    footerService10: 'Marketing Consultation',
  },

  ar: {
    /* Navbar & general */
    logoText:    'مصطفى',
    home:        'الرئيسية',
    about:       'عني',
    services:    'خدماتني',
    portfolio:   'معرض أعمالي',
    blog:        'المدونة',
    courses:     'الدورات',
    contact:     'اتصل بي',
    contactMe:   'تواصل معي',

    /* Hero */
    welcomeBadge:      'مرحباً بك في عالمي',
    heroTitlePrefix:   'أنا',
    heroName:          'مصطفى',
    iAm:               'أعمل كـ',
    heroDescription: 'أساعدك على تنمية علامتك التجارية وتحقيق أهدافك التسويقية من خلال استراتيجيات رقمية مبتكرة وفعّالة، وصناعة محتوى مؤثر يصل أسرع، ويحقق التحويل ويزيد مبيعاتك ويدفع نمو أعمالك.',
    viewWork:          'أعمالي',
    yearsExperience:   '3',
    yearsLabel:        'سنوات خبرة',
    projectsCompleted: '100',
    projectsLabel:     'مشروع منجز',
    happyClients:      '300',
    clientsLabel:      'عميل سعيد',
    clientSatisfaction:'رضا العملاء',
    avgRating:         'متوسط التقييم',
    scroll:            'تمرير',
    goldArcBadge:      'خبير التسويق الرقمي •',

        // About
    aboutBadge: 'من أنا',
    aboutSubtitle: 'متخصص في التسويق الرقمي وإدارة العلامات التجارية بخبرة تتجاوز 3 سنوات.',
    aboutMainTitle: 'أخصائي تسويق محترف في النمو الرقمي ',
    aboutText2:'أساعد الشركات والأفراد علي بناء حضور رقمي قوي وتحقيق اهدافهم التسويقية من خلال استراتيجيات مبتكرة ومخصصة . مع خبرة في إدارة حملات تسويقية ناجحة عبر منصات متعددة . أقدم حلولا متكاملة تجمع بين التخطيط والإبداع والبيانات .',
    missionTitle: 'رسالتي',
    missionText: 'تعزيز نمو الأعمال من خلال حلول تسويقية مبتكرة ومخصصة لتحقق الأهداف التسويقية و تدفع نحو النمو وتحقق نتائج قابلة للقياس.',
    visionTitle: 'رؤيتي',
    visionText: 'أن أكون مرجعا معترفا به في التسويق الرقمي، مستندا بقوة الخبرة والتميز والنتائج الملموسة.',
    coreValuesTitle: 'قيمي',
    value1: 'التميز',
    value2: 'الابتكار',
    value3: 'الأمانة',
    value4: 'الدقة',
    value5: 'الشفافية',
    signature: 'جودة يمكنك الوثوق بها',
    startProject: 'ابدأ مشروعك',
    projects_Completed: 'مشروع منجز',
    happy_Clients: 'عميل سعيد',
    yearsOfExcellence: 'سنوات خبرة',
    expertTeam: 'شريك نجاح',
    countriesServed: 'دول',
    trustedBy: 'موثوق من أكثر من 50 شركة',

    /* Services */
    ServiceBadge: 'خدماتي',
    ServiceTitlePrefix: 'ماذا',
    ServiceTitleHighlight: 'أقدم لك؟',
    ServiceSubtitle: 'خدمات تسويقية متكاملة تساعدك على النمو وبناء حضور رقمي قوي ومؤثر',
    readMore: 'اعرف المزيد',
    requestService: 'اطلب الخدمة',
    morePoints: 'نقاط أخرى',
    cta: 'دعني أساعدك في اختيار الخدمة المناسبة.',
    // cta: 'لست متأكداً من الخدمة المناسبة لك؟ راسلني عبر الواتساب واحصل على استشارة مجانية لمدة 30 دقيقة.',
    ctaTagline: 'تواصل عبر الواتساب',
    error: 'تعذّر تحميل الخدمات، يرجى المحاولة مجدداً',
    retry: 'إعادة المحاولة',
    serviceDetail: 'تفاصيل الخدمة',
    whatIncluded: 'ما يشمله هذا البرنامج',
    requestNow: 'اطلب هذه الخدمة الآن',
    close: 'إغلاق',
    requestEyebrow: 'طلب خدمة',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'أدخل اسمك الكامل',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: 'مثال: 0912345678',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'example@email.com',
    optional: 'اختياري',
    messageLabel: 'رسالتك',
    messagePlaceholder: 'أخبرنا عن مشروعك أو ما تحتاجه...',
    sending: 'جارٍ الإرسال...',
    sendRequest: 'إرسال الطلب',
    successTitle: 'تم الإرسال بنجاح!',
    successMsg: 'شكراً لك، سنتواصل معك في أقرب وقت ممكن.',
    nameRequired: 'الاسم مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    orderService: 'اطلب الخدمة',
    popular: 'الأكثر طلباً',
    bannerTitle: 'لست متأكداً من الخدمة المناسبة لك؟',
    bannerDesc: 'تواصل معي واحصل على استشارة مجانية لمدة 30 دقيقة',
    freeConsult: 'احصل على استشارة مجانية',
    srvMarketingTitle: 'التسويق الإلكتروني',
    srvMarketingDesc: 'استراتيجيات تسويقية متكاملة لزيادة المبيعات وتحقيق أهدافك',
    srvMarketingF1: 'إدارة حملات إعلانية', srvMarketingF2: 'تحليل الأداء', srvMarketingF3: 'استهداف دقيق',
    srvSeoTitle: 'خدمات SEO', srvSeoDesc: 'تحسين ظهور موقعك في نتائج البحث وزيادة الزيارات العضوية',
    srvSeoF1: 'تحليل الكلمات المفتاحية', srvSeoF2: 'تحسين المحتوى', srvSeoF3: 'بناء الروابط',
    srvBrandTitle: 'بناء البراند', srvBrandDesc: 'بناء هوية بصرية قوية وحضور رقمي مميز يعكس قيمتك',
    srvBrandF1: 'استراتيجية العلامة التجارية', srvBrandF2: 'تحديد الهوية', srvBrandF3: 'خطة المحتوى',
    srvLinkedinTitle: 'LinkedIn احترافي', srvLinkedinDesc: 'تحسين حسابك وبناء شبكة علاقات مهنية قوية ومؤثرة',
    srvLinkedinF1: 'تحسين الملف الشخصي', srvLinkedinF2: 'استراتيجية المحتوى', srvLinkedinF3: 'بناء الشبكة',
    srvCvTitle: 'سيرة ذاتية احترافية', srvCvDesc: 'تصميم وكتابة سيرة ذاتية تبرز مهاراتك وتجذب أصحاب العمل',
    srvCvF1: 'تصميم عصري', srvCvF2: 'صياغة احترافية', srvCvF3: 'نسخة عربية وإنجليزية',
    srvCoursesTitle: 'الكورسات التدريبية', srvCoursesDesc: 'كورسات متخصصة في التسويق الرقمي وبناء العلامة التجارية',
    srvCoursesF1: 'تسويق رقمي', srvCoursesF2: 'إدارة السوشيال ميديا', srvCoursesF3: 'شهادة معتمدة',
    srvConsultTitle: 'الاستشارات التسويقية', srvConsultDesc: 'جلسات استشارية مخصصة لتحديد فرص النمو وحل التحديات',
    srvConsultF1: 'تحليل الوضع الحالي', srvConsultF2: 'خطة عمل واضحة', srvConsultF3: 'متابعة مستمرة',
    srvWebTitle: 'تحسين المواقع والصفحات', srvWebDesc: 'مساعدة مواقعك في الوصول لعملائك المستهدفين وزيادة التحويلات',
    srvWebF1: 'تحسين معدل التحويل', srvWebF2: 'تحليل سلوك الزوار', srvWebF3: 'اختبار A/B',

    /* Portfolio */
    portfolioBadge: 'معرض أعمالي',
    portfolioTitlePrefix: 'أعمال',
    portfolioTitleHighlight: 'حققت نتائج حقيقية',
    portfolioSubtitle: 'مشاريع منجزة بنتائج قابلة للقياس لعملاء من مختلف القطاعات',
    filterAll: 'الكل', filterMarketing: 'تسويق', filterBrand: 'براندينج',
    filterSeo: 'SEO', filterCourses: 'كورسات',
    viewProject: 'عرض المشروع', viewDetails: 'التفاصيل',
    loadMore: 'عرض المزيد', resultLabel: 'النتيجة:',
    close: 'إغلاق',
    proj1Title: 'حملة تسويقية متكاملة لمتجر إلكتروني',
    proj1Desc: 'إدارة حملات Meta وGoogle Ads لزيادة المبيعات وتحسين العائد على الاستثمار',
    proj2Title: 'بناء هوية براند لشركة ناشئة',
    proj2Desc: 'استراتيجية كاملة للهوية البصرية والمحتوى الرقمي من الصفر',
    proj3Title: 'تحسين محركات البحث لموقع خدمي',
    proj3Desc: 'رفع الزيارات العضوية وتحسين الظهور في نتائج Google',
    proj4Title: 'إدارة منصات التواصل لعلامة تجارية',
    proj4Desc: 'محتوى إبداعي ورولز وبث مباشر لزيادة التفاعل والمتابعين',
    proj5Title: 'كورس التسويق الرقمي المتكامل',
    proj5Desc: 'كورس عربي شامل يغطي كل أدوات التسويق الحديثة بأسلوب عملي',
    proj6Title: 'بناء براند شخصي على LinkedIn',
    proj6Desc: 'تحويل حساب عادي لمرجع متخصص ومؤثر في مجاله',
    proj7Title: 'SEO محلي لمطعم وسلسلة فروع',
    proj7Desc: 'تحسين الظهور المحلي في Google Maps ونتائج البحث القريبة',
    proj8Title: 'حملة Email Marketing لشركة B2B',
    proj8Desc: 'بناء قائمة بريدية وأتمتة الحملات لزيادة التحويلات والمبيعات',

    /* Blog */
    blogBadge: 'المدونة',
    blogTitlePrefix: 'رؤى تسويقية',
    blogTitleHighlight: 'لنمو أعمالك',
    blogSubtitle: 'محتوى متخصص في التسويق الرقمي وبناء العلامة التجارية واستراتيجيات النمو.',
    filterLinkedin: 'LinkedIn', filterTips: 'نصائح',
    featured: 'مميز', minRead: 'دقائق', readMore: 'اقرأ المقال',
    loadMore: 'عرض المزيد', close: 'إغلاق',

    blog0Title: 'كيف تحقق ROI مضاعف من إعلانات Meta في 2025؟',
    blog0Excerpt: 'دليل شامل لإعداد وإدارة حملات Meta Ads الفعّالة التي تحقق عائداً حقيقياً على الاستثمار مع أمثلة عملية من مشاريع حقيقية.',
    blog0Content: 'المحتوى الكامل للمقال يُضاف هنا من لوحة التحكم أو CMS.',
    blog1Title: '5 أخطاء SEO تدمر ترتيبك في Google',
    blog1Excerpt: 'تعرّف على أكثر الأخطاء شيوعاً التي يرتكبها أصحاب المواقع وكيف تتجنبها لتحسين ترتيبك.',
    blog2Title: 'كيف تبني هوية براند لا تُنسى في 7 خطوات',
    blog2Excerpt: 'الهوية البصرية القوية ليست رفاهية بل ضرورة لكل مشروع يريد النمو والتميز.',
    blog3Title: 'الدليل الكامل لحساب LinkedIn يجذب العملاء',
    blog3Excerpt: 'كيف تحوّل ملفك الشخصي على LinkedIn إلى مغناطيس لجذب العملاء والفرص المهنية.',
    blog4Title: '10 أدوات مجانية يستخدمها كل مسوّق محترف',
    blog4Excerpt: 'أدوات مجانية تساعدك على إنجاز عملك التسويقي بكفاءة أعلى ووقت أقل.',
    blog5Title: 'Email Marketing في 2025: هل لا يزال فعالاً؟',
    blog5Excerpt: 'الإجابة الصريحة مع أرقام وإحصاءات حديثة وأفضل ممارسات الأتمتة.',
    blog6Title: 'استراتيجية المحتوى التي تضاعف زيارات موقعك',
    blog6Excerpt: 'خطة محتوى متكاملة تجمع بين SEO والإبداع لجذب الزوار وتحويلهم لعملاء.',
    blog7Title: 'قصتك الشخصية: أقوى أداة تسويقية تمتلكها',
    blog7Excerpt: 'كيف تحوّل تجربتك الشخصية إلى محتوى يبني ثقة عميقة مع جمهورك.',
    blog8Title: 'أفضل 8 أدوات AI للمسوّقين في 2025',
    blog8Excerpt: 'أدوات الذكاء الاصطناعي التي تغيّر طريقة العمل التسويقي وتوفر ساعات من العمل.',
    /* Contact */
    contactBadge: 'تواصل معي',
    contactTitlePrefix: 'هل أنت مستعد لتنمية',
    contactTitleHighlight: 'أعمالك؟',
    contactSubtitle: 'دعنا نناقش مشروعك ونضع استراتيجية تسويقية فعّالة تساعدك على الوصول إلى جمهورك وتحقيق أهدافك.',    phoneLabel: 'الهاتف', phoneValue: '+249 924535131', phoneNote: 'متاح 24/7',
    emailLabel: 'البريد الإلكتروني', emailValue: 'info@mustafahasbsido.com', emailNote: 'رد خلال 24 ساعة',
    locationLabel: 'الموقع', locationCity: 'الخرطوم - السودان', locationNote: 'متاح للعمل عن بُعد',
    hoursLabel: 'أيام المعل', weekdays: 'متاح كل الأيام',
    sendMessage: 'أرسل لي رسالة', formSubtitle: 'سأرد عليك خلال 24 ساعة',
    nameLabel: 'الاسم', namePlaceholder: 'أدخل اسمك الكامل',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    subjectLabel: 'الموضوع', subjectPlaceholder: 'اخبرني عن الخدمة المطلوبة',
    messageLabel: 'الرسالة', messagePlaceholder: 'أخبرني عن مشروعك...',
    sending: 'جاري الإرسال...', send: 'إرسال الرسالة',
    sendSuccess: 'تم إرسال رسالتك بنجاح! سأتواصل معك قريباً',
    followUs: 'تابعني على', availableNow: 'متاح الآن لمشاريع جديدة',
    errorRequired: 'هذا الحقل مطلوب', errorEmail: 'بريد إلكتروني غير صحيح', errorMessage: 'الرسالة قصيرة جداً',
    subjMarketing: 'تسويق إلكتروني', subjBrand: 'بناء براند', subjSeo: 'خدمات SEO',
    subjLinkedin: 'LinkedIn احترافي', subjCv: 'سيرة ذاتية', subjCourses: 'كورس تدريبي',
    subjConsult: 'استشارة تسويقية', subjOther: 'أخرى',
    sendError: 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى.',
    consultButton: 'احصل علي استشارة',

    /* Footer */
    footerTagline:    'مصطفى حسب سيدو',
    footerDescription:
    'أخصائي تسويق | أخصائي تسويق عبر وسائل التواصل الاجتماعي | كاتب محتوى وكاتب نصوص إعلانية وكاتب اسكربت | خبرة تزيد عن 3 سنوات | حاصل على أكثر من 10 شهادات معتمدة من HubSpot وGoogle | أساعد الشركات الصغيرة والمتوسطة والوكالات على النمو على وسائل التواصل الاجتماعي في منطقة الخليج والشرق الأوسط وشمال افريقيا.',
    quickLinks:       'روابط سريعة',
    ourServices:      'خدماتي',
    contactInfo:      'معلومات الاتصال',
    workHours:        'الأحد - الخميس : 9:00 ص - 9:00 م',
    newsletterTitle:  'اشترك في النشرة البريدية',
    newsletterDesc:   'احصل على أحدث التحديثات والعروض',
    subscribe:        'اشترك',
    allRightsReserved:'جميع الحقوق محفوظة',
    privacyPolicy:    'سياسة الخصوصية',
    termsOfService:   'شروط الخدمة',
    cookiesPolicy:    'سياسة ملفات تعريف الارتباط',
    locationAddress: 'الخرطوم - السودان',

    footerService1: 'استراتيجية التسويق الرقمي',
    footerService2: 'إدارة الحملات الإعلانية',
    footerService3: 'التسويق عبر وسائل التواصل الاجتماعي',
    footerService4: 'تحسين محركات البحث',
    footerService5: 'التسويق بالمحتوى',
    footerService6: 'إدارة العلامة التجارية',
    footerService7: 'تحليل البيانات التسويقية',
    footerService8: 'التسويق عبر لينكدإن',
    footerService9: 'بناء الحضور الرقمي',
    footerService10: 'الاستشارات التسويقية',
  }
}

const t = computed(() => isRTL.value ? translations.ar : translations.en)

/* ── Scroll progress ────────────────────────────── */
const updateProgressBar = () => {
  const winH  = window.innerHeight
  const docH  = document.documentElement.scrollHeight
  const top   = window.scrollY || document.documentElement.scrollTop
  progressWidth.value = Math.min(100, Math.max(0, (top / (docH - winH)) * 100))
}

/* ── Active section tracker ─────────────────────── */
const updateActiveSection = () => {
  const sections = ['home', 'about', 'services', 'portfolio', 'blog', 'contactMe']
  for (const id of sections) {
    const el = document.getElementById(id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom >= 100) {
      activeSection.value = id
      break
    }
  }
}

/* ── Actions ────────────────────────────────────── */
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleLang = () => {
  isRTL.value = !isRTL.value
  document.documentElement.dir = isRTL.value ? 'rtl' : 'ltr'
  localStorage.setItem('language', isRTL.value ? 'ar' : 'en')
  closeMobileMenu()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const scrollTo = (sectionId) => {
  const el = document.getElementById(sectionId)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const scrollToSection = scrollTo

const handleResize = () => {
  if (window.innerWidth > 768 && isMobileMenuOpen.value) closeMobileMenu()
}

const handleScroll = () => {
  updateProgressBar()
  updateActiveSection()
}

/* ── Lifecycle ──────────────────────────────────── */
onMounted(() => {
  if (localStorage.getItem('theme') === 'dark') isDark.value = true

  if (localStorage.getItem('language') === 'ar') {
    isRTL.value = true
    document.documentElement.dir = 'rtl'
  }

  window.addEventListener('scroll',  handleScroll,  { passive: true })
  window.addEventListener('resize',  handleResize)
  updateProgressBar()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<!-- ═══════════════════════════════════════════════
     GLOBAL STYLES
════════════════════════════════════════════════ -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Almarai:wght@300;400;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

:root {
  /* Brand colors */
  --blue:          #162FBB;
  --blue-dark:     #0e1a6e;
  --blue-light:    #1a3acc;
  --gold:          #E7AE18;
  --gold-light:    #f5c842;
  --bg-light:      #F0F0F0;
  --neutral:       #D0D6E5;

  /* Legacy aliases (keep for old components) */
  --primary-color:    #162FBB;
  --primary-dark:     #0e1a6e;
  --primary-light:    #1a3acc;
  --secondary-color:  #162FBB;
  --color-teal:       #162FBB;
  --color-teal-dark:  #0e1a6e;
  --gold-color:       #E7AE18;
  --gradient-gold:    linear-gradient(135deg, #E7AE18, #f5c842);
  --gradient-primary: linear-gradient(135deg, #162FBB, #0e1a6e);

  /* Fonts */
  --font-en-heading: 'Playfair Display', Georgia, serif;
  --font-en-body:    'Plus Jakarta Sans', 'Segoe UI', sans-serif;
  --font-ar-heading: 'Noto Naskh Arabic', 'Times New Roman', serif;
  --font-ar-body:    'Almarai', 'Tahoma', sans-serif;
}

/* English fonts */
.app:not(.rtl) {
  font-family: var(--font-en-body);
}
.app:not(.rtl) h1,
.app:not(.rtl) h2,
.app:not(.rtl) h3,
.app:not(.rtl) h4,
.app:not(.rtl) h5,
.app:not(.rtl) h6 {
  font-family: var(--font-en-heading);
  font-weight: 700;
}

/* Arabic fonts */
.app.rtl {
  font-family: var(--font-ar-body);
  direction: rtl;
  text-align: right;
  letter-spacing: 0.3px;
}
.app.rtl h1,
.app.rtl h2,
.app.rtl h3,
.app.rtl h4,
.app.rtl h5,
.app.rtl h6 {
  font-family: var(--font-ar-heading);
  font-weight: 700;
}

/* Dark mode */
.app.dark {
  background: #0d0d0d;
  color: #e0e0e0;
}

button {
  font-family: inherit;
  font-weight: 600;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<!-- ═══════════════════════════════════════════════
     SCOPED STYLES
════════════════════════════════════════════════ -->
<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  line-height: 1.6;
  background: #f8f9fa;
  color: #212529;
  transition: background-color 0.3s, color 0.3s;
}

.main {
  flex: 1;
  margin-top: 73px;
}

@media (max-width: 768px) {
  .main { margin-top: 63px; }
}
</style>

<template>
  <section id="products" class="products-section" :class="{ 'rtl-products': isRtl }">
    <div class="container">
      <div class="section-header">
        <h2>{{ t.productsTitle }}</h2>
        <p class="section-subtitle">{{ t.productsSubtitle }}</p>
      </div>

      <!-- Filter Buttons -->
      <div class="filter-buttons">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['filter-btn', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id"
        >
          <i :class="cat.icon"></i>
          <span>{{ isRtl ? cat.nameAr : cat.nameEn }}</span>
        </button>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="openProductModal(product)"
        >
          <div class="product-image">
            <img :src="product.image" :alt="isRtl ? product.titleAr : product.titleEn">
            <div class="product-badge" :class="product.badgeClass">
              {{ isRtl ? product.badgeAr : product.badgeEn }}
            </div>
          </div>
          <div class="product-content">
            <div class="product-category">
              <i :class="product.categoryIcon"></i>
              <span>{{ isRtl ? product.categoryAr : product.categoryEn }}</span>
            </div>
            <h3 class="product-title">{{ isRtl ? product.titleAr : product.titleEn }}</h3>
            <p class="product-description">{{ isRtl ? product.descriptionAr : product.descriptionEn }}</p>
            <div class="product-footer">
              <button class="btn-details">
                {{ t.viewDetails }}
                <i class="bi bi-arrow-right"></i>
              </button>
              <div class="product-tag" :style="{ background: product.tagColor }">
                <i :class="product.tagIcon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="view-all">
        <button class="btn-view-all" @click="viewAllProducts">
          <span>{{ t.viewAllProducts }}</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="selectedProduct" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="modal-image">
          <img :src="selectedProduct.image" :alt="isRtl ? selectedProduct.titleAr : selectedProduct.titleEn">
        </div>
        <div class="modal-body">
          <div class="modal-category">
            <i :class="selectedProduct.categoryIcon"></i>
            <span>{{ isRtl ? selectedProduct.categoryAr : selectedProduct.categoryEn }}</span>
          </div>
          <h2 class="modal-title">{{ isRtl ? selectedProduct.titleAr : selectedProduct.titleEn }}</h2>
          <p class="modal-description">{{ isRtl ? selectedProduct.fullDescriptionAr : selectedProduct.fullDescriptionEn }}</p>
          <div class="modal-features">
            <div class="features-title">
              <i class="bi bi-star-fill"></i>
              <span>{{ t.keyFeatures }}</span>
            </div>
            <ul class="features-list">
              <li v-for="feature in selectedProduct.features" :key="feature.en">
                <i class="bi bi-check-circle-fill"></i>
                <span>{{ isRtl ? feature.ar : feature.en }}</span>
              </li>
            </ul>
          </div>
          <div class="modal-actions">
            <button class="btn-inquire" @click="inquireProduct">
              <i class="bi bi-envelope"></i>
              {{ t.inquireNow }}
            </button>
            <button class="btn-catalog" @click="downloadCatalog">
              <i class="bi bi-download"></i>
              {{ t.downloadCatalog }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  t: { type: Object, required: true },
  isRtl: { type: Boolean, default: false }
})

import product1 from '@/assets/images/product/medicines-3.PNG'
import product2 from '@/assets/images/product/healthcare-3.JPG'
import product3 from '@/assets/images/product/healthcare-2.PNG'
import product4 from '@/assets/images/product/clothes-1.JPG'
import product5 from '@/assets/images/product/shoes.JPG'
import product6 from '@/assets/images/product/askeme.PNG'

const activeCategory = ref('all')
const selectedProduct = ref(null)

const categories = [
  { id: 'all',        nameEn: 'All Products',  nameAr: 'جميع المنتجات',   icon: 'bi bi-grid-3x3-gap-fill' },
  { id: 'healthcare', nameEn: 'Healthcare',     nameAr: 'الرعاية الصحية',  icon: 'bi bi-heart-pulse' },
  { id: 'fashion',    nameEn: 'Fashion',        nameAr: 'الأزياء',         icon: 'bi bi-bag-heart' },
  { id: 'services',   nameEn: 'Services',       nameAr: 'الخدمات',         icon: 'bi bi-briefcase' }
]

const products = ref([
  {
    id: 1,
    category: 'healthcare',
    categoryEn: 'Healthcare',
    categoryAr: 'الرعاية الصحية',
    categoryIcon: 'bi bi-capsule',
    titleEn: 'Premium Pharmaceuticals',
    titleAr: 'الأدوية المتميزة',
    descriptionEn: 'High-quality pharmaceutical products manufactured under strict quality standards.',
    descriptionAr: 'منتجات صيدلانية عالية الجودة يتم تصنيعها وفق أشد معايير الجودة صرامة.',
    fullDescriptionEn: 'Our pharmaceutical range includes prescription medications, over-the-counter drugs, and specialty medicines. All products are sourced from WHO-approved manufacturers and stored in temperature-controlled facilities.',
    fullDescriptionAr: 'تشمل مجموعتنا الصيدلانية الأدوية الموصوفة والأدوية التي لا تستلزم وصفة طبية والأدوية المتخصصة. جميع المنتجات مصدرها مصنعون معتمدون من منظمة الصحة العالمية ويتم تخزينها في مرافق محكومة الحرارة.',
    image: product1,
    badgeEn: 'New',
    badgeAr: 'جديد',
    badgeClass: 'badge-new',
    tagColor: '#18B2BC',
    tagIcon: 'bi bi-capsule',
    features: [
      { en: 'WHO Certified',                  ar: 'معتمد من منظمة الصحة العالمية' },
      { en: 'Temperature Controlled Storage', ar: 'تخزين بدرجة حرارة محكومة' },
      { en: '24/7 Customer Support',          ar: 'دعم العملاء على مدار الساعة' }
    ]
  },
  {
    id: 2,
    category: 'healthcare',
    categoryEn: 'Healthcare',
    categoryAr: 'الرعاية الصحية',
    categoryIcon: 'bi bi-heart-pulse',
    titleEn: 'Medical Supplies',
    titleAr: 'المستلزمات الطبية',
    descriptionEn: 'Complete range of medical supplies and equipment for hospitals and clinics.',
    descriptionAr: 'مجموعة كاملة من المستلزمات والمعدات الطبية للمستشفيات والعيادات.',
    fullDescriptionEn: 'From surgical instruments to diagnostic equipment, we supply everything healthcare professionals need. Our products meet international medical standards.',
    fullDescriptionAr: 'من الأدوات الجراحية إلى معدات التشخيص، نوفر كل ما يحتاجه المتخصصون في الرعاية الصحية. منتجاتنا تلبي المعايير الطبية الدولية.',
    image: product2,
    badgeEn: 'Best Seller',
    badgeAr: 'الأكثر مبيعاً',
    badgeClass: 'badge-popular',
    tagColor: '#324A6F',
    tagIcon: 'bi bi-hospital',
    features: [
      { en: 'ISO Certified',    ar: 'معتمد من ISO' },
      { en: 'Fast Delivery',    ar: 'توصيل سريع' },
      { en: 'Warranty Included', ar: 'ضمان شامل' }
    ]
  },
  {
    id: 3,
    category: 'disability-aids',
    categoryEn: 'Disability Aids',
    categoryAr: 'مستلزمات ذوي الإعاقة',
    categoryIcon: 'bi bi-person-wheelchair',
    titleEn: 'Disability Equipment',
    titleAr: 'معدات ذوي الإعاقة',
    descriptionEn: 'Comprehensive range of mobility aids and assistive devices for people with disabilities.',
    descriptionAr: 'تشكيلة شاملة من أدوات التنقل والأجهزة المساعدة لذوي الإعاقة.',
    fullDescriptionEn: 'From wheelchairs and mobility scooters to walking aids and daily living equipment, we provide everything needed to support independence and quality of life for people with disabilities. All products meet international safety standards.',
    fullDescriptionAr: 'من الكراسي المتحركة والدراجات الخاصة إلى عكازات المشي ومعدات الحياة اليومية، نوفر كل ما يلزم لدعم استقلالية وجودة حياة ذوي الإعاقة. جميع منتجاتنا تلبي معايير السلامة الدولية.',
    image: product3,
    badgeEn: 'Best Seller',
    badgeAr: 'الأكثر مبيعاً',
    badgeClass: 'badge-popular',
    tagColor: '#2E7D6B',
    tagIcon: 'bi bi-person-wheelchair',
    features: [
      { en: 'Safety Certified',      ar: 'معتمد من حيث السلامة' },
      { en: 'Fast Delivery',         ar: 'توصيل سريع' },
      { en: 'Warranty Included',     ar: 'ضمان شامل' }
    ]
  },
  {
    id: 4,
    category: 'fashion',
    categoryEn: 'Fashion',
    categoryAr: 'الأزياء',
    categoryIcon: 'bi bi-tshirt',
    titleEn: 'Premium Clothing',
    titleAr: 'الملابس الفاخرة',
    descriptionEn: 'Elegant and comfortable clothing for all occasions and seasons.',
    descriptionAr: 'ملابس أنيقة ومريحة لجميع المناسبات والفصول.',
    fullDescriptionEn: 'Our fashion collection features premium fabrics, modern designs, and exceptional craftsmanship. From casual wear to formal attire.',
    fullDescriptionAr: 'تتميز مجموعتنا من الأزياء بالأقمشة الفاخرة والتصاميم العصرية والحرفية الاستثنائية. من الملابس غير الرسمية إلى الملابس الرسمية.',
    image: product4,
    badgeEn: 'Trending',
    badgeAr: 'رائج',
    badgeClass: 'badge-trending',
    tagColor: '#E07B5A',
    tagIcon: 'bi bi-star-fill',
    features: [
      { en: 'Premium Fabrics',  ar: 'أقمشة فاخرة' },
      { en: 'Modern Designs',   ar: 'تصاميم عصرية' },
      { en: 'Free Alterations', ar: 'تعديلات مجانية' }
    ]
  },
  {
    id: 5,
    category: 'fashion',
    categoryEn: 'Fashion',
    categoryAr: 'الأزياء',
    categoryIcon: 'bi bi-shoe-prints',
    titleEn: 'Footwear Collection',
    titleAr: 'مجموعة الأحذية',
    descriptionEn: 'Comfortable and stylish footwear for every step of your journey.',
    descriptionAr: 'أحذية مريحة وأنيقة لكل خطوة في رحلتك.',
    fullDescriptionEn: 'Our footwear line combines style with comfort. Designed for all-day wear with premium materials and ergonomic support.',
    fullDescriptionAr: 'تجمع مجموعتنا من الأحذية بين الأناقة والراحة. مصممة للارتداء طوال اليوم باستخدام مواد فاخرة ودعم مريح.',
    image: product5,
    badgeEn: 'New',
    badgeAr: 'جديد',
    badgeClass: 'badge-new',
    tagColor: '#17284A',
    tagIcon: 'bi bi-shoe-prints',
    features: [
      { en: 'Ergonomic Design', ar: 'تصميم مريح' },
      { en: 'Durable Materials', ar: 'مواد متينة' },
      { en: 'Multiple Sizes',   ar: 'مقاسات متعددة' }
    ]
  },
  {
    id: 6,
    category: 'services',
    categoryEn: 'Services',
    categoryAr: 'الخدمات',
    categoryIcon: 'bi bi-capsule',
    titleEn: 'Pharmacy & Drug Agency Consulting',
    titleAr: 'الخدمات الإستشارية',
    descriptionEn: 'Specialized consulting services tailored for pharmacies and pharmaceutical distribution agencies.',
    descriptionAr: 'خدمات استشارية مجانية متخصصة للعملاء',
    fullDescriptionEn: 'We provide expert consulting to pharmacy owners and drug distribution agencies, covering regulatory compliance, inventory management, supplier negotiations, and business growth strategies in the pharmaceutical sector.',
    fullDescriptionAr: 'نقدم استشارات متخصصة للعملاء واصحاب الصيدليات ووكالات توزيع الأدوية، تشمل الامتثال التنظيمي وإدارة المخزون والتفاوض مع الموردين واستراتيجيات النمو في القطاع الصيدلاني.',
    image: product6,
    badgeEn: 'Expert',
    badgeAr: 'خبير',
    badgeClass: 'badge-expert',
    tagColor: '#1A6B8A',
    tagIcon: 'bi bi-capsule-pill',
    features: [
      { en: 'Regulatory Compliance',     ar: 'الامتثال التنظيمي' },
      { en: 'Inventory Management',      ar: 'إدارة المخزون' },
      { en: 'Supplier Negotiations',     ar: 'التفاوض مع الموردين' }
    ]
  },
  // {
  //   id: 6,
  //   category: 'services',
  //   categoryEn: 'Services',
  //   categoryAr: 'الخدمات',
  //   categoryIcon: 'bi bi-briefcase',
  //   titleEn: 'Business Consulting',
  //   titleAr: 'الاستشارات التجارية',
  //   descriptionEn: 'Expert consulting services to grow your business and optimize operations.',
  //   descriptionAr: 'خدمات استشارية متخصصة لنمو أعمالك وتحسين عملياتك.',
  //   fullDescriptionEn: 'Our business consulting services help companies achieve their goals through strategic planning, market analysis, and operational excellence.',
  //   fullDescriptionAr: 'تساعد خدمات الاستشارات التجارية الشركات على تحقيق أهدافها من خلال التخطيط الاستراتيجي وتحليل السوق والتميز التشغيلي.',
  //   image: product6,
  //   badgeEn: 'Expert',
  //   badgeAr: 'خبير',
  //   badgeClass: 'badge-expert',
  //   tagColor: '#18B2BC',
  //   tagIcon: 'bi bi-graph-up',
  //   features: [
  //     { en: 'Strategic Planning',        ar: 'تخطيط استراتيجي' },
  //     { en: 'Market Analysis',           ar: 'تحليل السوق' },
  //     { en: 'Performance Optimization',  ar: 'تحسين الأداء' }
  //   ]
  // },
])

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

const openProductModal = (product) => {
  selectedProduct.value = product
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedProduct.value = null
  document.body.style.overflow = ''
}

const viewAllProducts = () => {
  console.log('View all products')
}

const inquireProduct = () => {
  alert(props.isRtl ? 'سيتم التواصل معك قريباً' : 'We will contact you soon')
}

const downloadCatalog = () => {
  alert(props.isRtl ? 'جاري تحميل الكتالوج...' : 'Downloading catalog...')
}
</script>

<style scoped>
.products-section {
  padding: 5rem 0;
  background: var(--color-bg, #F0F0F0);
  position: relative;
  overflow: hidden;
}

/* RTL Support */
.products-section.rtl-products { direction: rtl; }
.products-section.rtl-products .filter-btn i { margin-left: 0.5rem; margin-right: 0; }
.products-section.rtl-products .product-footer { flex-direction: row-reverse; }
.products-section.rtl-products .btn-details i { transform: rotate(180deg); display: inline-block; }
.products-section.rtl-products .features-list li { flex-direction: row-reverse; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

/* Section Header */
.section-header { text-align: center; margin-bottom: 3rem; }

.section-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(24, 178, 188, 0.1);
  color: var(--color-teal, #18B2BC);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 2.5rem;
  color: var(--color-navy, #17284A);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
}

.section-subtitle { font-size: 1rem; color: #64748b; margin-top: 1.5rem; }

/* Filter Buttons */
.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: #475569;
}

.filter-btn i { font-size: 1rem; }

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(24, 178, 188, 0.3);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.product-image { position: relative; overflow: hidden; height: 250px; }

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img { transform: scale(1.05); }

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
}

.rtl-products .product-badge { right: auto; left: 1rem; }

.badge-new      { background: linear-gradient(135deg, #18B2BC, #13888D); }
.badge-popular  { background: linear-gradient(135deg, #f59e0b, #d97706); }
.badge-trending { background: linear-gradient(135deg, #ec4899, #db2777); }
.badge-expert   { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.product-content { padding: 1.5rem; }

.product-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.75rem;
  color: var(--color-teal, #18B2BC);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-navy, #17284A);
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.product-description { color: #64748b; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; }

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.btn-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: var(--color-teal, #18B2BC);
  font-weight: 600;
  cursor: pointer;
  transition: gap 0.3s;
}

.btn-details:hover { gap: 0.8rem; }

.product-tag {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

/* View All Button */
.view-all { text-align: center; }

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid var(--color-teal, #18B2BC);
  color: var(--color-teal, #18B2BC);
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-view-all:hover {
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  color: white;
  gap: 0.8rem;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(24, 178, 188, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 20px;
  position: relative;
  animation: modalIn 0.3s ease;
}

.dark .modal-content { background: #1e1e1e; }

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s;
  z-index: 10;
}

.modal-close:hover { background: #ef4444; transform: scale(1.05); }

.modal-image img { width: 100%; max-height: 300px; object-fit: cover; }

.modal-body { padding: 2rem; }

.modal-category {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 1rem;
  background: rgba(24, 178, 188, 0.1);
  color: var(--color-teal, #18B2BC);
  border-radius: 20px;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.modal-title { font-size: 1.5rem; color: var(--color-navy, #17284A); margin-bottom: 1rem; }
.modal-description { color: #64748b; line-height: 1.6; margin-bottom: 1.5rem; }
.modal-features { margin-bottom: 1.5rem; }

.features-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: var(--color-navy, #17284A);
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.features-list li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #475569; }
.features-list li i { color: #10b981; font-size: 0.8rem; }

.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-inquire, .btn-catalog {
  flex: 1;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-inquire {
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  color: white;
  border: none;
}

.btn-inquire:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(24, 178, 188, 0.3); }

.btn-catalog {
  background: transparent;
  border: 2px solid var(--color-teal, #18B2BC);
  color: var(--color-teal, #18B2BC);
}

.btn-catalog:hover { background: var(--color-teal, #18B2BC); color: white; }

/* Dark Mode */
.dark .product-card { background: #1e1e1e; }
.dark .product-title { color: white; }
.dark .modal-content h2, .dark .features-title { color: white; }
.dark .modal-description, .dark .features-list li { color: #aaa; }

/* Animations */
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .products-grid { grid-template-columns: 1fr; }
  .filter-buttons { gap: 0.5rem; }
  .filter-btn { padding: 0.4rem 1rem; font-size: 0.8rem; }
  .features-list { grid-template-columns: 1fr; }
  .modal-actions { flex-direction: column; }
  .section-header h2 { font-size: 2rem; }
  .container { padding: 0 1rem; }
}
</style>

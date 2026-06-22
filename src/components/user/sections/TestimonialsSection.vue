<template>
  <section id="testimonials" class="testimonials-section">
    <div class="container">
      <div class="section-header">
        <h2>{{ t.testimonialsTitle }}</h2>
        <p class="section-subtitle">{{ t.testimonialsSubtitle }}</p>
      </div>

      <!-- Testimonials Slider -->
      <div class="testimonials-slider">
        <button
          class="slider-btn prev-btn"
          @click="prevSlide"
          :disabled="currentSlide === 0"
        >
          ❮
        </button>

        <div class="slider-container">
          <div
            class="slider-wrapper"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="testimonial-slide"
            >
              <div class="testimonial-card">
                <div class="testimonial-quote-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                <div class="testimonial-content">
                  <p class="testimonial-text">{{ testimonial.text }}</p>
                </div>

                <div class="testimonial-author">
                  <div class="author-image">
                    <img :src="testimonial.image" :alt="testimonial.name">
                  </div>
                  <div class="author-info">
                    <h4>{{ testimonial.name }}</h4>
                    <p class="author-role">{{ testimonial.role }}</p>
                    <div class="author-rating">
                      <span v-for="star in 5" :key="star" class="star">
                        {{ star <= testimonial.rating ? '★' : '☆' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          class="slider-btn next-btn"
          @click="nextSlide"
          :disabled="currentSlide === testimonials.length - 1"
        >
          ❯
        </button>
      </div>

      <!-- Dots Navigation -->
      <div class="slider-dots">
        <button
          v-for="(_, index) in testimonials"
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          @click="goToSlide(index)"
        ></button>
      </div>

      <!-- Auto-play indicator -->
      <div class="auto-play-indicator" v-if="isAutoPlaying">
        <div class="auto-play-bar" :style="{ width: autoPlayProgress + '%' }"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({
  t: Object
})

const currentSlide = ref(0)
const isAutoPlaying = ref(true)
const autoPlayProgress = ref(0)
let autoPlayInterval = null
let progressInterval = null

const testimonials = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    text: 'Absolutely outstanding work! Mustafa transformed our digital presence completely. His attention to detail and creative approach exceeded our expectations. The team is thrilled with the results!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Marketing Director',
    text: 'Working with Mustafa has been a game-changer for our brand. His content strategy increased our engagement by 200%. Professional, creative, and always delivers on time.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Small Business Owner',
    text: 'I was struggling with my online presence until I found Mustafa. He helped me create amazing content and built a beautiful website. My sales have doubled! Highly recommended.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Creative Agency',
    text: 'One of the most talented content creators I\'ve worked with. Mustafa brings ideas to life and always adds that special touch that makes the difference. Will definitely work with him again.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Brand Manager',
    text: 'Exceptional service and outstanding results! Mustafa understood our vision perfectly and delivered beyond what we imagined. The attention to detail is remarkable.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/5.jpg'
  }
])

const nextSlide = () => {
  if (currentSlide.value < testimonials.value.length - 1) {
    currentSlide.value++
    resetAutoPlay()
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
    resetAutoPlay()
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoPlay()
}

const resetAutoPlay = () => {
  if (isAutoPlaying.value) {
    clearInterval(autoPlayInterval)
    clearInterval(progressInterval)
    autoPlayProgress.value = 0
    startAutoPlay()
  }
}

const startAutoPlay = () => {
  if (isAutoPlaying.value) {
    autoPlayInterval = setInterval(() => {
      if (currentSlide.value < testimonials.value.length - 1) {
        currentSlide.value++
      } else {
        currentSlide.value = 0
      }
    }, 5000)

    // Progress bar animation
    progressInterval = setInterval(() => {
      if (autoPlayProgress.value < 100) {
        autoPlayProgress.value += 2
      } else {
        autoPlayProgress.value = 0
      }
    }, 100)
  }
}

const stopAutoPlay = () => {
  isAutoPlaying.value = false
  clearInterval(autoPlayInterval)
  clearInterval(progressInterval)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
.testimonials-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.dark .testimonials-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-top: 1.5rem;
}

.dark .section-subtitle {
  color: #aaa;
}

/* Slider Styles */
.testimonials-slider {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.slider-container {
  flex: 1;
  overflow: hidden;
  border-radius: 20px;
}

.slider-wrapper {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-slide {
  flex: 0 0 100%;
  padding: 1rem;
}

.testimonial-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.dark .testimonial-card {
  background: #1e1e1e;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.15);
}

.testimonial-quote-icon {
  color: #667eea;
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.dark .testimonial-quote-icon {
  color: #764ba2;
}

.testimonial-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.dark .testimonial-text {
  color: #e0e0e0;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.dark .testimonial-author {
  border-top-color: #333;
}

.author-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #667eea;
}

.author-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: #333;
}

.dark .author-info h4 {
  color: white;
}

.author-role {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.3rem;
}

.dark .author-role {
  color: #aaa;
}

.author-rating {
  display: flex;
  gap: 0.2rem;
}

.star {
  color: #ffc107;
  font-size: 0.9rem;
}

/* Slider Buttons */
.slider-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dark .slider-btn {
  background: #2a2a2a;
  color: white;
}

.slider-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

.slider-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Dots Navigation */
.slider-dots {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 2rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  width: 30px;
  border-radius: 10px;
  background: #667eea;
}

.dot:hover:not(.active) {
  background: #999;
  transform: scale(1.2);
}

/* Auto-play Indicator */
.auto-play-indicator {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(102, 126, 234, 0.2);
  z-index: 100;
}

.auto-play-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.1s linear;
}

/* RTL Support */
.rtl .testimonial-author {
  flex-direction: row-reverse;
  text-align: right;
}

.rtl .author-rating {
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .slider-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .testimonial-card {
    padding: 1.5rem;
  }

  .testimonial-text {
    font-size: 1rem;
  }

  .author-image {
    width: 50px;
    height: 50px;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .testimonials-slider {
    gap: 0.5rem;
  }
}

/* Animation for cards */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.testimonial-slide {
  animation: slideIn 0.5s ease-out;
}
</style>


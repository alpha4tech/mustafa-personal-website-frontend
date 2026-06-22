import { ref, onMounted, onUnmounted, watch } from 'vue'
import { unref } from 'vue'


// Ease-out curve: starts fast, settles smoothly — gives that "professional"
// snappy feel instead of a flat linear count.
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Animates a numeric value from `start` up to `end`, triggered automatically
 * the moment the bound element (`targetEl`) scrolls into the viewport.
 * Runs only once per page load.
 *
 * Usage:
 *   const { targetEl, displayValue } = useCountUp({ end: 300 })
 *   <span ref="targetEl">{{ displayValue }}</span>
 *
 * @param {Object}  options
 * @param {Number}  options.end       - target number to count up to
 * @param {Number}  [options.start]   - starting number (default 1)
 * @param {Number}  [options.duration]- animation length in ms (default 1500)
 * @param {Number}  [options.decimals]- decimal places to keep (default 0)
 */
// export function useCountUp({ end, start = 1, duration = 1500, decimals = 0 } = {}) {

  export function useCountUp(options = {}) {
  const {
    end,
    start = 1,
    duration = 1500,
    decimals = 0
  } = options

  const targetEl = ref(null)
  const displayValue = ref(start)
  const hasAnimated = ref(false)

  let observer = null
  let rafId = null

  const animate = (endValue) => {
    const startValue = start
    const diff = endValue - startValue
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = startValue + diff * eased

      displayValue.value = Number(current.toFixed(decimals))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        displayValue.value = Number(endValue.toFixed(decimals))
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  onMounted(() => {
    // const numericEnd = Number(end) || 0
    const numericEnd = Number(unref(end)) || 0

    // Defensive fallback if the element ref or IntersectionObserver isn't available
    if (!targetEl.value || typeof IntersectionObserver === 'undefined') {
      animate(numericEnd)
      
      watch(
  () => Number(unref(end)),
  (newValue) => {
    if (hasAnimated.value) {
      displayValue.value = start
      animate(newValue)
    }
  }
)
  //       watch(
  //   () => Number(end),
  //   (newValue) => {
  //     if (hasAnimated.value) {
  //       displayValue.value = start
  //       animate(newValue)
  //     }
  //   }
  // )
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            displayValue.value = start
            animate(Number(end) || 0)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(targetEl.value)
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { targetEl, displayValue, hasAnimated }
}

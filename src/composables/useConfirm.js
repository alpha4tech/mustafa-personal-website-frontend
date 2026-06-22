import { ref } from 'vue'

const show = ref(false)
const options = ref({})
let resolver = null

export function useConfirm() {

  const confirm = (config = {}) => {
    show.value = true
    options.value = config

    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  const accept = () => {
    show.value = false
    resolver?.(true)
  }

  const cancel = () => {
    show.value = false
    resolver?.(false)
  }

  return {
    show,
    options,
    confirm,
    accept,
    cancel
  }
}

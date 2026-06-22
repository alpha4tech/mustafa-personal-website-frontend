<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
        @click="$emit('cancel')"
      >
        <div
          class="confirm-dialog"
          @click.stop
        >
          <div class="confirm-icon">
            <i class="bi bi-trash3-fill"></i>
          </div>

          <h3>{{ title }}</h3>

          <p>
            {{ message }}
          </p>

          <div class="confirm-buttons">
            <button
              class="cancel-btn"
              @click="$emit('cancel')"
            >
              {{ cancelText }}
            </button>

            <button
              class="confirm-btn"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,

  title: {
    type: String,
    default: 'Confirm Delete'
  },

  message: {
    type: String,
    default: 'Are you sure you want to delete this item?'
  },

  cancelText: {
    type: String,
    default: 'Cancel'
  },

  confirmText: {
    type: String,
    default: 'Delete'
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-dialog {
  width: 420px;
  max-width: 95%;
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,.15);
}

.confirm-icon {
  width: 70px;
  height: 70px;
  margin: auto;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.confirm-dialog h3 {
  margin-top: 20px;
  font-weight: 700;
}

.confirm-dialog p {
  color: #64748b;
  margin-top: 10px;
}

.confirm-buttons {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
}

.cancel-btn {
  background: #f1f5f9;
}

.confirm-btn {
  background: #dc2626;
  color: white;
}

.modal-enter-active,
.modal-leave-active {
  transition: all .25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(.9);
}
</style>

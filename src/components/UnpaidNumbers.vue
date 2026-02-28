<template>
    <transition name="slide-fade">
        <div v-if="visible" class="card border-1 mb-3">
            <div class="card-body text-dark">
                <label class="form-label fw-bold">
                    Números não pagos <span class="badge text-bg-danger p-2">{{ totalUnpaid }}</span>
                </label>
                <div class="border p-3 rounded bg-light mb-3">
                    <div class="small text-monospace">
                        <div v-for="(numeros, comprador) in unpaidGrouped" :key="comprador" class="mb-2">
                            <strong>{{ comprador }}:</strong> {{ numeros.sort((a, b) => a - b).join(', ') }} <span class="badge text-bg-secondary ms-1">({{ numeros.length }})</span>
                        </div>
                    </div>
                    <hr class="my-2" />
                    <div class="small text-muted"><strong>Total:</strong> {{ totalUnpaid }} números não pagos</div>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-info" style="min-width: 300px" @click="emit('copy')" title="Copiar números não pagos">
                        <i class="bi bi-files"></i> Copiar números não pagos
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    visible: Boolean,
    unpaidGrouped: Object
})

const emit = defineEmits(['copy'])

const totalUnpaid = computed(() => {
    if (!props.unpaidGrouped) return 0
    return Object.values(props.unpaidGrouped).flat().length
})
</script>

<style scoped lang="scss">
.slide-fade-enter-active {
    animation: fadeSlideIn 0.6s ease;
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

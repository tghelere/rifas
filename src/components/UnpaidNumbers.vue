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
                <div class="d-flex justify-content-center action-btns">
                    <button class="btn btn-info action-btn" @click="emit('copy')" title="Copiar números não pagos">
                        <i class="bi bi-files"></i> Copiar números não pagos
                    </button>
                    <button class="btn btn-success ms-2 action-btn" @click="emit('share')" title="Compartilhar via WhatsApp">
                        <i class="bi bi-whatsapp"></i> Enviar por WhatsApp
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

const emit = defineEmits(['copy','share'])

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

.action-btns {
    gap: 0.5rem;
    flex-wrap: wrap;
}
.action-btn {
    min-width: 300px;
}
@media (max-width: 576px) {
    .action-btns {
        flex-direction: column !important;
        align-items: stretch;
    }
    .action-btn {
        min-width: unset;
        width: 100%;
        margin-left: 0 !important;
    }
    .action-btn + .action-btn {
        margin-top: 0.5rem;
    }
}
</style>

<template>
    <transition name="slide-fade">
        <div v-if="visible" class="card border-1 mb-3 fade-in">
            <div class="card-body">
                <label class="form-label fw-bold text-dark">Números sorteados</label>
                <div class="d-grid gap-4">
                    <div v-for="item in history" :key="item.chave" class="border p-4 mx-auto w-100 text-center" :class="{ destaque: item.chave === highlightedKey }">
                        <div class="text-dark fs-5">{{ item.grupo.join(', ') }}</div>
                        <div class="text-secondary small">{{ item.dataHora }}</div>
                        <div class="mx-auto w-100">
                            <button class="btn btn-info mt-2" @click="emit('copy', item.grupo)" title="Copiar números sorteados">
                                <i class="bi bi-files"></i> Copiar números sorteados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    visible: Boolean,
    history: Array,
    highlightedKey: String
})

const emit = defineEmits(['copy'])
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

.fade-in {
    animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.destaque {
    border-color: #6f6f8f !important;
    background-color: aliceblue;
    animation: desliza-destaque 1s ease;
}

@keyframes desliza-destaque {
    from {
        opacity: 0;
        transform: translateY(-40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

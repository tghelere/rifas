<template>
    <transition name="slide-fade">
        <div v-if="visible" class="card border-1 mb-3">
            <div class="card-body text-dark">
                <label class="form-label fw-bold">
                    Números disponíveis <span class="badge text-bg-primary p-2">{{ numeros.length }}</span>
                </label>
                <div class="border p-4 w-100 text-center">
                    <p class="text-warning">{{ numeros.join(', ') }}</p>
                    <div class="mx-auto w-100">
                        <button class="btn btn-info mt-2" @click="emit('copy')" title="Copiar números disponíveis">
                            <i class="bi bi-files"></i> Copiar números disponíveis
                        </button>
                    </div>
                </div>
                <div class="row g-3 mt-3">
                    <div class="col-md-6">
                        <label for="qtd" class="form-label">Quantidade a sortear:</label>
                        <div class="input-group">
                            <button class="btn btn-danger" type="button" @click="emit('decrementQuantity')" title="Diminuir quantidade">
                                <i class="bi bi-dash-circle"></i>
                            </button>
                            <input
                                id="qtd"
                                type="number"
                                class="form-control text-center"
                                :value="quantity"
                                @input="emit('updateQuantity', Number($event.target.value))"
                                :min="1"
                                :max="numeros.length"
                                title="Digite a quantidade de números a sortear"
                            />
                            <button class="btn btn-success" type="button" @click="emit('incrementQuantity')" title="Aumentar quantidade">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                        </div>
                        <div class="text-danger small mt-1" style="min-height: 20px">{{ validationError }}</div>
                    </div>
                    <div class="col-md-6">
                        <label for="" class="form-label d-none d-md-block">&nbsp;</label>
                        <button
                            class="btn btn-primary w-100"
                            @click="emit('draw')"
                            :disabled="!!validationError"
                            title="Sortear números aleatoriamente"
                        >
                            <i class="bi bi-shuffle"></i> Sortear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    visible: Boolean,
    numeros: Array,
    quantity: Number,
    validationError: String
})

const emit = defineEmits(['copy', 'incrementQuantity', 'decrementQuantity', 'updateQuantity', 'draw'])
</script>

<style scoped lang="scss">
.slide-fade-enter-active {
    animation: fadeSlideIn 0.6s ease;
}

input[type='number'] {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
    appearance: textfield;
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

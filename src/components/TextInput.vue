<template>
    <div class="card border-1 mb-3">
        <div class="card-header border-1 d-flex justify-content-between align-items-center">
            <label for="texto" class="form-label fw-bold text-dark mb-0">Cole o texto com os números</label>
            <button type="button" class="btn btn-sm btn-info" @click="emit('openHelp')" title="Ajuda" aria-label="Abrir ajuda">
                <i class="bi bi-question text-white"></i>
            </button>
        </div>
        <div class="card-body">
            <textarea v-model="texto" id="texto" class="form-control" rows="6" required placeholder="Cole o texto aqui"></textarea>
        </div>
        <div class="card-footer border-1">
            <div class="row g-2">
                <div class="col-12 col-md-auto flex-grow-1">
                    <button type="button" class="btn btn-warning w-100 d-flex justify-content-center align-items-center gap-2" @click="emit('paste')" title="Colar texto">
                        <i class="bi bi-clipboard"></i> Colar
                    </button>
                </div>
                <div class="col-12 col-md-auto flex-grow-1">
                    <button type="button" class="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2" @click="emit('search')" title="Buscar números disponíveis">
                        <i class="bi bi-search"></i> Buscar disponíveis
                    </button>
                </div>
                <div class="col-12 col-md-auto flex-grow-1">
                    <button type="button" class="btn btn-secondary w-100 d-flex justify-content-center align-items-center gap-2" @click="emit('searchUnpaid')" title="Buscar números não pagos">
                        <i class="bi bi-cash-coin"></i> Não pagos
                    </button>
                </div>
                <div class="col-12 col-md-auto flex-grow-1">
                    <button type="button" class="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2" @click="emit('clear')" title="Limpar tudo">
                        <i class="bi bi-trash"></i> Limpar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: String
})

const emit = defineEmits(['update:modelValue', 'openHelp', 'paste', 'search', 'searchUnpaid', 'clear'])

const texto = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped lang="scss">
.form-control:focus {
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
}

textarea {
    resize: vertical;
    &::placeholder {
        padding-top: 50px;
        font-weight: bold;
        text-align: center;
        color: #b4b4b4;
    }
}
</style>

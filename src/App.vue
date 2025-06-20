<template>
    <div :class="['container']">
        <div class="my-3 text-center">
            <h2 class="fw-bold mb-0 text-primary-emphasis">Sorteio de números disponíveis</h2>
        </div>

        <div class="card bg-light border-1 mb-4">
            <div class="card-body">
                <label for="texto" class="form-label fw-bold">Cole o texto com os números</label>
                <textarea v-model="texto" id="texto" class="form-control" rows="6" required></textarea>
            </div>
            <div class="card-footer bg-light d-flex justify-content-center gap-2 border-1">
                <button type="button" class="btn btn-outline-warning d-flex align-items-center gap-2" @click="colarTexto"><i class="bi bi-clipboard"></i> Colar</button>
                <button type="button" class="btn btn-outline-primary d-flex align-items-center gap-2" @click="executar"><i class="bi bi-search"></i> Buscar</button>
                <button type="button" class="btn btn-outline-danger d-flex align-items-center gap-2" @click="limparTudo"><i class="bi bi-trash"></i> Limpar</button>
            </div>
        </div>

        <div v-if="numerosDisponiveis.length" class="card bg-light border-1 mb-4">
            <div class="card-body">
                <label class="form-label fw-bold">
                    Números disponíveis <span class="badge text-bg-primary p-2">{{ numerosDisponiveis.length }}</span>
                </label>
                <p class="text-muted">{{ numerosDisponiveis.join(', ') }}</p>
                <div class="row g-3 mt-3">
                    <div class="col-md-6">
                        <label for="qtd" class="form-label">Quantidade a sortear:</label>
                        <div class="input-group">
                            <button class="btn btn-outline-danger" type="button" @click="decrementarQuantidade">
                                <i class="bi bi-dash-circle"></i>
                            </button>
                            <input id="qtd" type="number" class="form-control text-center" v-model.number="quantidadeGerar" :min="1" :max="numerosDisponiveis.length" />
                            <button class="btn btn-outline-success" type="button" @click="incrementarQuantidade">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                        </div>
                        <div class="text-danger small mt-1" style="min-height: 20px">{{ erroValidacao }}</div>
                    </div>
                    <div class="col-md-6">
                        <label for="" class="form-label d-none d-md-block">&nbsp;</label>
                        <button class="btn btn-outline-primary w-100" @click="gerarAleatorios" :disabled="!!erroValidacao">
                            <i class="bi bi-shuffle"></i> Sortear
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="historico.length" class="card bg-body-tertiary border-1 mb-4 fade-in">
            <div class="card-body">
                <label for="texto" class="form-label fw-bold">Números sorteados</label>
                <div class="d-flex flex-wrap gap-4">
                    <div v-for="(grupo, index) in historico" :key="index" class="border rounded p-4 bg-white mx-auto d-grid w-100">
                        <div class="text-muted text-center fs-5">{{ grupo.join(', ') }}</div>
                        <button class="btn btn-sm btn-outline-primary mt-2" @click="copiarGrupo(grupo)"><i class="bi bi-files"></i> Copiar números</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="toast" class="toast-custom position-fixed bottom-0 end-0 m-3 fade-in">
            <div class="alert alert-dark py-2 px-3 shadow-sm mb-0">{{ toast }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

document.title = 'Sorteio de números disponíveis'

const texto = ref('')
const numerosDisponiveis = ref([])
const quantidadeGerar = ref(1)
const historico = ref([])
const toast = ref('')

const erroValidacao = computed(() => {
    if (quantidadeGerar.value < 1) return 'A quantidade mínima é 1.'
    if (quantidadeGerar.value > numerosDisponiveis.value.length) return 'A quantidade excede os números disponíveis.'
    return ''
})

function executar() {
    const linhas = texto.value.split(/\r?\n/)
    const disponiveis = []
    for (const linha of linhas) {
        const match = linha.match(/^\s*(\d{1,3})\s*-\s*$/)
        if (match) disponiveis.push(Number(match[1]))
    }
    numerosDisponiveis.value = disponiveis
    historico.value = []
    quantidadeGerar.value = 1
}

function gerarAleatorios() {
    if (erroValidacao.value) return
    const copia = [...numerosDisponiveis.value]
    const resultado = []
    for (let i = 0; i < quantidadeGerar.value && copia.length; i++) {
        const index = Math.floor(Math.random() * copia.length)
        resultado.push(copia.splice(index, 1)[0])
    }
    historico.value.unshift(resultado.sort((a, b) => a - b))
}

function limparTudo() {
    texto.value = ''
    numerosDisponiveis.value = []
    historico.value = []
    quantidadeGerar.value = 1
}

async function colarTexto() {
    try {
        texto.value = await navigator.clipboard.readText()
        mostrarToast('Texto colado.')
    } catch (err) {
        mostrarToast('Erro ao acessar a área de transferência.')
    }
}

function copiarGrupo(grupo) {
    navigator.clipboard
        .writeText(grupo.join(', '))
        .then(() => {
            mostrarToast('Números copiados.')
        })
        .catch(() => {
            mostrarToast('Erro ao copiar os números.')
        })
}

function mostrarToast(msg) {
    toast.value = msg
    setTimeout(() => (toast.value = ''), 2500)
}

function incrementarQuantidade() {
    if (quantidadeGerar.value < numerosDisponiveis.value.length) {
        quantidadeGerar.value++
    }
}

function decrementarQuantidade() {
    if (quantidadeGerar.value > 1) {
        quantidadeGerar.value--
    }
}
</script>

<style scoped>
textarea {
    resize: vertical;
}
.toast-custom {
    transition: opacity 0.5s ease;
    z-index: 1055;
}
.fade-in {
    animation: fadeIn 0.4s ease-in-out;
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
</style>

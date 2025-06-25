<template>
    <div :class="['container', 'py-2']">
        <div class="my-3 text-center">
            <h2 class="fw-semi-bold mb-0 text-light titulo">Sorteio de números disponíveis</h2>
        </div>

        <div class="card bg-transparent border-warning rounded-0 border-1 mb-5">
            <div class="card-body">
                <label for="texto" class="form-label fw-bold text-light">Cole o texto com os números</label>
                <textarea v-model="texto" id="texto" class="form-control rounded-0" rows="6" required placeholder="Cole o texto aqui"></textarea>
            </div>
            <div class="card-footer d-flex justify-content-center gap-2 border-warning rounded-0 border-1">
                <button type="button" class="btn btn-warning d-flex align-items-center gap-2 px-5" @click="colarTexto"><i class="bi bi-clipboard"></i> Colar</button>
                <button type="button" class="btn btn-primary d-flex align-items-center gap-2 px-5" @click="executar"><i class="bi bi-search"></i> Buscar</button>
                <button type="button" class="btn btn-danger d-flex align-items-center gap-2 px-5" @click="limparTudo"><i class="bi bi-trash"></i> Limpar</button>
            </div>
        </div>

        <div v-if="numerosDisponiveis.length" class="card bg-transparent border-warning rounded-0 border-1 mb-5">
            <div class="card-body text-light">
                <label class="form-label fw-bold">
                    Números disponíveis <span class="badge text-bg-primary p-2">{{ numerosDisponiveis.length }}</span>
                </label>
                <div class="border p-4 escuro border-warning w-100 text-center">
                    <p class="text-warning">{{ numerosDisponiveis.join(', ') }}</p>
                    <div class="mx-auto w-100">
                        <button class="btn btn-info mt-2" @click="copiarNumeros(numerosDisponiveis)"><i class="bi bi-files"></i> Copiar números disponíveis</button>
                    </div>
                </div>
                <div class="row g-3 mt-3">
                    <div class="col-md-6">
                        <label for="qtd" class="form-label">Quantidade a sortear:</label>
                        <div class="input-group">
                            <button class="btn btn-danger" type="button" @click="decrementarQuantidade">
                                <i class="bi bi-dash-circle"></i>
                            </button>
                            <input id="qtd" type="number" class="form-control text-center" v-model.number="quantidadeGerar" :min="1" :max="numerosDisponiveis.length" />
                            <button class="btn btn-success" type="button" @click="incrementarQuantidade">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                        </div>
                        <div class="text-danger small mt-1" style="min-height: 20px">{{ erroValidacao }}</div>
                    </div>
                    <div class="col-md-6">
                        <label for="" class="form-label d-none d-md-block">&nbsp;</label>
                        <button class="btn btn-primary w-100" @click="gerarAleatorios" :disabled="!!erroValidacao"><i class="bi bi-shuffle"></i> Sortear</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="historico.length" class="card bg-transparent rounded-0 border-warning border-1 mb-5 fade-in">
            <div class="card-body">
                <label for="texto" class="form-label fw-bold text-light">Números sorteados</label>
                <div class="d-flex flex-wrap gap-4">
                    <div v-for="(grupo, index) in historico" :key="index" class="border p-4 escuro border-warning mx-auto w-100 text-center">
                        <div class="text-light fs-5">{{ grupo.join(', ') }}</div>
                        <div class="mx-auto w-100">
                            <button class="btn btn-info mt-2" @click="copiarNumeros(grupo)"><i class="bi bi-files"></i> Copiar números sorteados</button>
                        </div>
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

function copiarNumeros(numeros) {
    navigator.clipboard
        .writeText(numeros.join(', '))
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

<style lang="scss" scoped>
textarea {
    resize: vertical;
    background-color: #4e1a0e98;
    color: #fff;
    &::placeholder {
        font-weight: bold;
        text-align: center;
        font-size: 1.8rem;
        opacity: 0.3;
        color: rgb(255, 77, 0);
        text-transform: uppercase;
        font-style: italic;
    }
    &:focus {
        background-color: #4e1a0ecd;
    }
}
.card-body,
.card-footer {
    background-color: #4e1a0e98;
}
.escuro {
    background-color: #4e1a0ecd;
}
.titulo {
    text-shadow: 1px 1px 1px #ce9253;
    font-size: 2.5em;
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

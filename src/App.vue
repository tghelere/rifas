<template>
    <header class="container">
        <div class="card border-1 mb-3 topo">
            <div class="py-3 text-center card-body">
                <h1 class="fw-semi-bold mb-0 text-dark d-flex justify-content-center align-items-center gap-2">
                    <img src="/apple-touch-icon.png" alt="Logo" style="height: 40px; width: auto" />
                    Sorteador de rifas
                </h1>
            </div>
        </div>
    </header>
    <div :class="['container', 'main']">
        <div class="card border-1 mb-3">
            <div class="card-body">
                <label for="texto" class="form-label fw-bold text-dark">Cole o texto com os números</label>
                <textarea v-model="texto" id="texto" class="form-control" rows="6" required placeholder="Cole o texto aqui"></textarea>
            </div>
            <div class="card-footer border-1">
                <div class="row g-2">
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-warning w-100 d-flex justify-content-center align-items-center gap-2" @click="colarTexto"><i class="bi bi-clipboard"></i> Colar</button>
                    </div>
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2" @click="executar"><i class="bi bi-search"></i> Buscar</button>
                    </div>
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2" @click="limparTudo"><i class="bi bi-trash"></i> Limpar</button>
                    </div>
                </div>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-if="numerosDisponiveis.length" class="card anunciar border-1 mb-3 py-4 bg-secondary">
                <div class="card-body">
                    <h5 class="text-muted text-center">
                        <i class="bi bi-currency-dollar text-success" />
                        <small><em>Anuncie seus produtos ou serviços aqui!</em></small>
                        <i class="bi bi-currency-dollar text-success" />
                    </h5>
                    <div class="row g-2 mt-2 justify-content-center">
                        <div class="col-12 col-md-2">
                            <a class="btn btn-sm btn-success w-100 d-flex justify-content-center align-items-center gap-2" :href="linkWhats" target="_blank" title="Entrar em contato pelo WhatsApp">
                                <i class="bi bi-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                        <div class="col-12 col-md-2">
                            <a class="btn btn-sm btn-dark w-100 d-flex justify-content-center align-items-center gap-2" :href="linkEmail" target="_blank" title="Entrar em contato por e-mail">
                                <i class="bi bi-envelope-at text-light"></i> E-mail
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="slide-fade">
            <div v-if="numerosDisponiveis.length" class="card border-1 mb-3" ref="disponiveisRef">
                <div class="card-body text-dark">
                    <label class="form-label fw-bold">
                        Números disponíveis <span class="badge text-bg-primary p-2">{{ numerosDisponiveis.length }}</span>
                    </label>
                    <div class="border p-4 w-100 text-center">
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
        </transition>

        <transition name="slide-fade">
            <div v-if="historico.length" class="card border-1 mb-3 fade-in" ref="historicoRef">
                <div class="card-body">
                    <label class="form-label fw-bold text-dark">Números sorteados</label>
                    <div class="d-grid gap-4">
                        <div v-for="item in historico" :key="item.chave" class="border p-4 mx-auto w-100 text-center" :class="{ destaque: item.chave === ultimoGrupoAnimado }">
                            <div class="text-dark fs-5">{{ item.grupo.join(', ') }}</div>
                            <div class="text-secondary small">{{ item.dataHora }}</div>
                            <div class="mx-auto w-100">
                                <button class="btn btn-info mt-2" @click="copiarNumeros(item.grupo)"><i class="bi bi-files"></i> Copiar números sorteados</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <div v-if="toast" class="toast-custom position-fixed bottom-0 end-0 m-3 fade-in">
            <div class="alert alert-info py-2 px-3 shadow-sm mb-0">{{ toast }}</div>
        </div>
    </div>
    <footer class="bg-black mt-auto py-3">
        <div class="container text-center text-light italic">
            <small>
                Developed with <i class="bi bi-heart-fill text-danger"></i> by
                <a href="https://www.linkedin.com/in/ghelere/" title="Desenvolvedor Thyago Ghelere - LinkedIn" target="_blank">TGhelere</a> for you
            </small>
        </div>
    </footer>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

document.title = 'Sorteador de rifas'

const texto = ref('')
const numerosDisponiveis = ref([])
const quantidadeGerar = ref(1)
const historico = ref([])
const ultimoGrupoAnimado = ref(null)
const toast = ref('')
const disponiveisRef = ref(null)
const historicoRef = ref(null)
const numeroWhats = '5543991312016' // seu número em formato internacional
const enderecoEmail = 'thng@outlook.com'
const assuntoEmail = encodeURIComponent('Anúncio no Sorteador de Rifas')
const mensagem = encodeURIComponent('Gostaria de anunciar meu produto ou serviço no Sorteador de Rifas.')
const linkWhats = `https://wa.me/${numeroWhats}?text=${mensagem}`
const linkEmail = `mailto:${enderecoEmail}?subject=${assuntoEmail}&body=${mensagem}`

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
    nextTick(() => {
        disponiveisRef.value?.scrollIntoView({ behavior: 'smooth' })
    })
    mostrarToast(`${disponiveis.length} número(s) disponíveis(s).`)
}

function gerarAleatorios() {
    if (erroValidacao.value) return
    const copia = [...numerosDisponiveis.value]
    const resultado = []
    for (let i = 0; i < quantidadeGerar.value && copia.length; i++) {
        const index = Math.floor(Math.random() * copia.length)
        resultado.push(copia.splice(index, 1)[0])
    }
    const grupo = resultado.sort((a, b) => a - b)
    const agora = new Date()
    const dataHora = agora.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
    const chave = `${grupo.join(',')}-${Date.now()}`
    historico.value.unshift({ chave, grupo, dataHora })
    ultimoGrupoAnimado.value = chave
    nextTick(() => {
        historicoRef.value?.scrollIntoView({ behavior: 'smooth' })
    })
    mostrarToast(quantidadeGerar.value == 1 ? `Um novo número foi sorteado` : `${quantidadeGerar.value} novos números foram sorteados`)
}

function limparTudo() {
    texto.value = ''
    numerosDisponiveis.value = []
    historico.value = []
    quantidadeGerar.value = 1
    mostrarToast('Tudo foi limpo.')
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
    const mensagem = numeros === numerosDisponiveis.value ? `Ainda existem ${numeros.length} números disponíveis, são eles: ${numeros.join(', ')}.` : numeros.join(', ')
    navigator.clipboard
        .writeText(mensagem)
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
        mostrarToast(`Quantidade: ${quantidadeGerar.value}`)
    }
}

function decrementarQuantidade() {
    if (quantidadeGerar.value > 1) {
        quantidadeGerar.value--
        mostrarToast(`Quantidade: ${quantidadeGerar.value}`)
    }
}
</script>

<style scoped lang="scss">
.main {
    flex: 1;
}
.form-control:focus {
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.card.topo {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
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
header h1 {
    font-size: 2em;
}
.card.anunciar h5{
    font-size: 1em;
}
.toast-custom {
    transition: opacity 0.5s ease;
    z-index: 1055;
}
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

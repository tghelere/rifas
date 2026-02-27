<template>
    <header class="container">
        <div class="card border-1 mb-3 topo">
            <div class="py-3 text-center card-body">
                <h1 class="fw-semi-bold mb-0 text-dark d-flex justify-content-center align-items-center gap-2">
                    <img src="/apple-touch-icon.png" alt="Logo" style="height: 40px; width: auto" />
                    Sorteador de Rifas
                </h1>
            </div>
        </div>
    </header>

    <div v-if="mostrarHelp" class="modal-overlay" @click="mostrarHelp = false">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h5 class="modal-title">Como usar o Sorteador de Rifas</h5>
                <button type="button" class="btn-close text-danger" @click="mostrarHelp = false" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <h6>📋 Formato de entrada esperado</h6>
                <p>A aplicação trabalha com um formato de texto específico:</p>
                <pre><code>1- João Silva 💰</code><br /><code>2- Maria Santos 💸</code><br /><code>3- Pedro Oliveira</code><br /><code>4-</code><br /><code>5- Ana Costa 💰</code></pre>
                <h6 class="mt-4">🔍 Símbolos</h6>
                <ul>
                    <li>💰 ou 💸 = Número pago</li>
                    <li>Sem símbolo = Número não pago</li>
                    <li>Linha vazia (apenas número e hífen) = Número disponível/não vendido</li>
                </ul>
                <h6 class="mt-4">💡 Dicas</h6>
                <ul>
                    <li>O texto para colar pode ser a mensagem do WhatsApp completa com os prêmios, formas de pagamento e tudo mais, apenas os números serão utilizados</li>
                </ul>
            </div>
        </div>
    </div>

    <div :class="['container', 'main']">
        <div class="card border-1 mb-3">
            <div class="card-header border-1 d-flex justify-content-between align-items-center">
                <label for="texto" class="form-label fw-bold text-dark mb-0">Cole o texto com os números</label>
                <button type="button" class="btn btn-sm btn-info" @click="mostrarHelp = true" title="Ajuda" aria-label="Abrir ajuda">
                    <i class="bi bi-question text-white"></i>
                </button>
            </div>
            <div class="card-body">
                <textarea v-model="texto" id="texto" class="form-control" rows="6" required placeholder="Cole o texto aqui"></textarea>
            </div>
            <div class="card-footer border-1">
                <div class="row g-2">
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-warning w-100 d-flex justify-content-center align-items-center gap-2" @click="colarTexto"><i class="bi bi-clipboard"></i> Colar</button>
                    </div>
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2" @click="executar">
                            <i class="bi bi-search"></i> Buscar disponíveis
                        </button>
                    </div>
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-secondary w-100 d-flex justify-content-center align-items-center gap-2" @click="executarNaoPagos">
                            <i class="bi bi-cash-coin"></i> Não pagos
                        </button>
                    </div>
                    <div class="col-12 col-md-auto flex-grow-1">
                        <button type="button" class="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2" @click="limparTudo"><i class="bi bi-trash"></i> Limpar</button>
                    </div>
                </div>
            </div>
        </div>

        <transition name="slide-fade">
            <div v-if="numerosDisponiveis.length && config.exibirAd" class="card ad border-1 mb-3 py-4">
                <div class="card-body">
                    <h5 class="text-muted text-center">
                        <i class="bi bi-currency-dollar text-success" />
                        <small><em>Anuncie seus produtos ou serviços aqui!</em></small>
                        <i class="bi bi-currency-dollar text-success" />
                    </h5>
                    <div class="row g-2 mt-2 justify-content-center">
                        <div class="col-12 col-md-2">
                            <a
                                class="btn btn-sm btn-success w-100 d-flex justify-content-center align-items-center gap-2"
                                @click="
                                    registrarEvento('abrir_whatsapp', {
                                        event_category: 'Anúncio',
                                        event_label: 'Clique em WhatsApp'
                                    })
                                "
                                :href="linkWhats"
                                target="_blank"
                                title="Entrar em contato pelo WhatsApp"
                            >
                                <i class="bi bi-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                        <div class="col-12 col-md-2">
                            <a
                                class="btn btn-sm btn-dark w-100 d-flex justify-content-center align-items-center gap-2"
                                @click="
                                    registrarEvento('abrir_email', {
                                        event_category: 'Anúncio',
                                        event_label: 'Clique em E-mail'
                                    })
                                "
                                :href="linkEmail"
                                target="_blank"
                                title="Entrar em contato por e-mail"
                            >
                                <i class="bi bi-envelope-at text-light"></i> E-mail
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="slide-fade">
            <div v-if="tipoUltimaBusca === 'disponivel' && numerosDisponiveis.length" class="card border-1 mb-3" ref="disponiveisRef">
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

            <div v-else-if="tipoUltimaBusca === 'nao_pago' && Object.keys(numerosNaoPagosAgrupados).length" class="card border-1 mb-3" ref="disponiveisRef">
                <div class="card-body text-dark">
                    <label class="form-label fw-bold">
                        Números não pagos <span class="badge text-bg-danger p-2">{{ totalNaoPagos }}</span>
                    </label>
                    <div class="border p-3 rounded bg-light mb-3">
                        <div class="small text-monospace">
                            <div v-for="(numeros, comprador) in numerosNaoPagosAgrupados" :key="comprador" class="mb-2">
                                <strong>{{ comprador }}:</strong> {{ numeros.sort((a, b) => a - b).join(', ') }} <span class="badge text-bg-secondary ms-1">({{ numeros.length }})</span>
                            </div>
                        </div>
                        <hr class="my-2" />
                        <div class="small text-muted"><strong>Total:</strong> {{ totalNaoPagos }} números não pagos</div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-info" style="min-width: 300px" @click="copiarTodosNaoPagos"><i class="bi bi-files"></i> Copiar números não pagos</button>
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
    <footer class="mt-auto py-2">
        <div class="container text-center text-light italic">
            <small>
                Developed by
                <a href="https://www.linkedin.com/in/ghelere/" title="Desenvolvedor Thyago Ghelere - LinkedIn" target="_blank">TGhelere</a>
            </small>
        </div>
    </footer>
</template>

<script setup>
import { ref, computed, nextTick, getCurrentInstance } from 'vue'
import { config } from './config'

// Constantes
const REGEX_NUMERO_VAZIO = /^\s*(\d{1,3})\s*-\s*$/
const REGEX_NUMERO_COM_NOME = /^\s*(\d{1,3})\s*-\s*(.*)$/
const ICONE_PAGO = ['💰', '💸']
const TOAST_DURATION = 2500

document.title = 'Sorteador de Rifas'

const instance = getCurrentInstance()
const app = instance.appContext.config.globalProperties

// Refs
const texto = ref('')
const numerosDisponiveis = ref([])
const numerosNaoPagosAgrupados = ref({})
const tipoUltimaBusca = ref(null)
const quantidadeGerar = ref(1)
const historico = ref([])
const ultimoGrupoAnimado = ref(null)
const toast = ref('')
const disponiveisRef = ref(null)
const historicoRef = ref(null)
const mostrarHelp = ref(false)

// Links construídos
const linkWhats = computed(() => {
    const mensagem = encodeURIComponent(config.emailBody)
    return `https://wa.me/${config.whatsappNumber}?text=${mensagem}`
})

const linkEmail = computed(() => {
    return `mailto:${config.emailAddress}?subject=${encodeURIComponent(config.emailSubject)}&body=${encodeURIComponent(config.emailBody)}`
})

// Computados
const erroValidacao = computed(() => {
    if (quantidadeGerar.value < 1) return 'A quantidade mínima é 1.'
    if (quantidadeGerar.value > numerosDisponiveis.value.length) return 'A quantidade excede os números disponíveis.'
    return ''
})

const totalNaoPagos = computed(() => {
    return Object.values(numerosNaoPagosAgrupados.value).flat().length
})

const totalCompradores = computed(() => {
    return Object.keys(numerosNaoPagosAgrupados.value).length
})

// Funções auxiliares
function registrarEvento(nomeEvento, dados = {}) {
    try {
        if (app.$trackEvent) {
            app.$trackEvent(nomeEvento, {
                ...dados,
                timestamp: new Date().toISOString()
            })
        }
    } catch (err) {
        console.warn('Erro ao registrar evento:', err)
    }
}

function limparResultados() {
    numerosDisponiveis.value = []
    numerosNaoPagosAgrupados.value = {}
    tipoUltimaBusca.value = null
    historico.value = []
}

function extrairNumerosDisponiveis(linhas) {
    const disponiveis = []
    for (const linha of linhas) {
        const match = linha.match(REGEX_NUMERO_VAZIO)
        if (match) {
            disponiveis.push(Number(match[1]))
        }
    }
    return disponiveis
}

function extrairNumerosNaoPagos(linhas) {
    const naoPagosAgrupados = {}

    for (const linha of linhas) {
        const match = linha.match(REGEX_NUMERO_COM_NOME)
        if (!match) continue

        const numero = Number(match[1])
        const resto = match[2].trim()

        // Ignora números disponíveis (vazios)
        if (!resto) continue

        // Ignora números pagos (contém icone de pagamento)
        if (ICONE_PAGO.some((icone) => resto.includes(icone))) continue

        // Remove espaços em branco extra
        const nome = resto.replace(/\s+/g, ' ').trim()

        if (!naoPagosAgrupados[nome]) {
            naoPagosAgrupados[nome] = []
        }
        naoPagosAgrupados[nome].push(numero)
    }

    return naoPagosAgrupados
}

function rolarParaResultados() {
    nextTick(() => {
        disponiveisRef.value?.scrollIntoView({ behavior: 'smooth' })
    })
}

function mostrarToast(msg) {
    toast.value = msg
    setTimeout(() => (toast.value = ''), TOAST_DURATION)
}

// Ações principais
function executar() {
    const linhas = texto.value.split(/\r?\n/)
    const disponiveis = extrairNumerosDisponiveis(linhas)

    limparResultados()
    numerosDisponiveis.value = disponiveis
    tipoUltimaBusca.value = 'disponivel'

    rolarParaResultados()
    registrarEvento('buscar_numeros', {
        event_category: 'Interação',
        event_label: 'Clique em Buscar',
        quantidade_numeros: disponiveis.length
    })
    mostrarToast(`${disponiveis.length} número(s) disponíveis(s).`)
}

function executarNaoPagos() {
    const linhas = texto.value.split(/\r?\n/)
    const naoPagosAgrupados = extrairNumerosNaoPagos(linhas)

    limparResultados()
    numerosNaoPagosAgrupados.value = naoPagosAgrupados
    tipoUltimaBusca.value = 'nao_pago'

    rolarParaResultados()
    registrarEvento('buscar_nao_pagos', {
        event_category: 'Interação',
        event_label: 'Clique em Não Pagos',
        quantidade_nao_pagos: totalNaoPagos.value,
        quantidade_compradores: totalCompradores.value
    })
    mostrarToast(`${totalNaoPagos.value} número(s) não pago(s) de ${totalCompradores.value} comprador(es).`)
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

    registrarEvento('sortear_numeros', {
        event_category: 'Interação',
        event_label: 'Sorteio executado',
        quantidade_sorteada: quantidadeGerar.value,
        numeros: grupo.join(',')
    })

    const mensagemToast = quantidadeGerar.value === 1 ? 'Um novo número foi sorteado' : `${quantidadeGerar.value} novos números foram sorteados`
    mostrarToast(mensagemToast)
}

function limparTudo() {
    historico.value = []
    numerosDisponiveis.value = []
    numerosNaoPagosAgrupados.value = {}
    tipoUltimaBusca.value = null
    texto.value = ''
    quantidadeGerar.value = 1

    registrarEvento('limpar_tudo', {
        event_category: 'Interação',
        event_label: 'Clique em Limpar'
    })
    mostrarToast('Tudo foi limpo.')
}

async function colarTexto() {
    try {
        texto.value = await navigator.clipboard.readText()
        registrarEvento('colar_texto', {
            event_category: 'Interação',
            event_label: 'Clique em Colar'
        })
        mostrarToast('Texto colado.')
    } catch (err) {
        mostrarToast('Erro ao acessar a área de transferência.')
    }
}

function copiarNumeros(numeros) {
    const mensagem = numeros === numerosDisponiveis.value ? `Ainda existem ${numeros.length} números disponíveis, são eles: ${numeros.join(', ')}.` : `Números escolhidos: ${numeros.join(', ')}`
    navigator.clipboard
        .writeText(mensagem)
        .then(() => {
            const tipoNumeros = numeros === numerosDisponiveis.value ? 'disponíveis' : 'sorteados'
            registrarEvento('copiar_numeros', {
                event_category: 'Interação',
                event_label: `Copiou números ${tipoNumeros}`,
                quantidade_numeros: numeros.length
            })
            mostrarToast('Números copiados.')
        })
        .catch(() => {
            mostrarToast('Erro ao copiar os números.')
        })
}

function copiarTodosNaoPagos() {
    if (!totalNaoPagos.value) {
        mostrarToast('Nenhum número não pago para copiar.')
        return
    }

    const linhas = []
    for (const [comprador, numeros] of Object.entries(numerosNaoPagosAgrupados.value)) {
        const numerosOrdenados = numeros.sort((a, b) => a - b).join(', ')
        const quantidadeTexto = numeros.length === 1 ? 'número' : 'números'
        linhas.push(`${comprador}: ${numeros.length} ${quantidadeTexto} (${numerosOrdenados})`)
    }

    const mensagem = `Números que ainda faltam pagar:

${linhas.join('\n')}

Total: ${totalNaoPagos.value} números de ${totalCompradores.value} comprador(es)`

    navigator.clipboard
        .writeText(mensagem)
        .then(() => {
            registrarEvento('copiar_todos_nao_pagos', {
                event_category: 'Interação',
                event_label: 'Copiou números não pagos',
                quantidade_numeros: totalNaoPagos.value,
                quantidade_compradores: totalCompradores.value
            })
            mostrarToast('Números não pagos foram copiados!')
        })
        .catch(() => {
            mostrarToast('Erro ao copiar os números.')
        })
}

function incrementarQuantidade() {
    if (quantidadeGerar.value < numerosDisponiveis.value.length) {
        quantidadeGerar.value++
        registrarEvento('incrementar_quantidade', {
            event_category: 'Interação',
            event_label: 'Incrementou quantidade',
            quantidade: quantidadeGerar.value
        })
        mostrarToast(`Quantidade: ${quantidadeGerar.value}`)
    }
}

function decrementarQuantidade() {
    if (quantidadeGerar.value > 1) {
        quantidadeGerar.value--
        registrarEvento('decrementar_quantidade', {
            event_category: 'Interação',
            event_label: 'Decrementou quantidade',
            quantidade: quantidadeGerar.value
        })
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
    font-size: 1.8em;
}

.card.ad h5 {
    font-size: 1em;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 1.2rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-weight: 600;
    font-size: 1em;
}

.btn-close {
    border: none;
    cursor: pointer;
    font-size: 1.2em;
}

.modal-body {
    font-size: 0.9em;
    padding: 1.2rem;

    h6 {
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    pre {
        background-color: #dfdfdf;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
    }

    code {
        font-family: 'Courier New', monospace;
        font-style: italic;
    }

    li {
        margin-bottom: 0.25rem;
    }
}

.toast-custom {
    transition: opacity 0.5s ease;
    z-index: 1055;
}

.slide-fade-enter-active {
    animation: fadeSlideIn 0.6s ease;
}

footer{
    background-color: #000000ad;
    font-size: .9em;
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

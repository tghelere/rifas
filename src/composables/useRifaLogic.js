import { ref, computed, nextTick, getCurrentInstance } from 'vue'

const REGEX_NUMERO_VAZIO = /^\s*(\d{1,3})\s*-?\s*$/
const REGEX_NUMERO_COM_NOME = /^\s*(\d{1,3})\s*-\s*(.*)$/
const ICONE_PAGO = ['💰', '💸']
const TOAST_DURATION = 2500

export function useRifaLogic() {
    const instance = getCurrentInstance()
    const app = instance?.appContext.config.globalProperties || {}

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
            rolarPara(disponiveisRef)
        })
    }

    function rolarParaHistorico() {
        nextTick(() => {
            rolarPara(historicoRef)
        })
    }

    function rolarPara(refWrapper) {
        try {
            const target = refWrapper?.value
            if (!target) return

            if (typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ behavior: 'smooth' })
                return
            }

            if (target.$el && typeof target.$el.scrollIntoView === 'function') {
                target.$el.scrollIntoView({ behavior: 'smooth' })
                return
            }

            const root = target.$el || target
            if (root && typeof root.querySelector === 'function') {
                const inner = root.querySelector('div, section, main, article, ul, ol') || root
                if (inner && typeof inner.scrollIntoView === 'function') {
                    inner.scrollIntoView({ behavior: 'smooth' })
                }
            }
        } catch (err) {
            console.warn('Erro ao rolar para elemento:', err)
        }
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

        rolarParaHistorico()

        registrarEvento('sortear_numeros', {
            event_category: 'Interação',
            event_label: 'Sorteio executado',
            quantidade_sorteada: quantidadeGerar.value
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
            console.error(err);
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

    async function enviarPorWhatsapp(mensagem) {
        const encoded = encodeURIComponent(mensagem)

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

        if (isMobile && navigator.share) {
            try {
                await navigator.share({ text: mensagem })
                return true
            } catch (err) {
                console.warn('Web Share API falhou:', err)
                // fall through to whatsapp:// fallback on mobile
            }
        }

        const url = isMobile ? `whatsapp://send?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`

        try {
            window.open(url, '_blank')
            return true
        } catch (e) {
            console.warn('Erro ao abrir WhatsApp:', e)
            return false
        }
    }

    async function compartilharNumeros(numeros) {
        const mensagem = numeros === numerosDisponiveis.value ? `Ainda existem ${numeros.length} números disponíveis, são eles: ${numeros.join(', ')}.` : `Números escolhidos: ${numeros.join(', ')}`
        if (await enviarPorWhatsapp(mensagem)) {
            mostrarToast('Abrindo WhatsApp...')
            const tipoNumeros = numeros === numerosDisponiveis.value ? 'disponíveis' : 'sorteados'
            registrarEvento('compartilhar_numeros', {
                event_category: 'Interação',
                event_label: `Compartilhou números ${tipoNumeros}`,
                quantidade_numeros: numeros.length
            })
        }
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

        const mensagem = `Números que ainda faltam pagar: ${linhas.join('\n')} Total: ${totalNaoPagos.value} números de ${totalCompradores.value} comprador(es)`

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

    async function compartilharTodosNaoPagos() {
        if (!totalNaoPagos.value) {
            mostrarToast('Nenhum número não pago para compartilhar.')
            return
        }

        const linhas = []
        for (const [comprador, numeros] of Object.entries(numerosNaoPagosAgrupados.value)) {
            const numerosOrdenados = numeros.sort((a, b) => a - b).join(', ')
            const quantidadeTexto = numeros.length === 1 ? 'número' : 'números'
            linhas.push(`${comprador}: ${numeros.length} ${quantidadeTexto} (${numerosOrdenados})`)
        }

        const mensagem = `Números que ainda faltam pagar: ${linhas.join('\n')} Total: ${totalNaoPagos.value} números de ${totalCompradores.value} comprador(es)`

        if (await enviarPorWhatsapp(mensagem)) {
            mostrarToast('Abrindo WhatsApp...')
            registrarEvento('compartilhar_todos_nao_pagos', {
                event_category: 'Interação',
                event_label: 'Compartilhou números não pagos',
                quantidade_numeros: totalNaoPagos.value,
                quantidade_compradores: totalCompradores.value
            })
        }
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

    return {
        // Refs
        texto,
        numerosDisponiveis,
        numerosNaoPagosAgrupados,
        tipoUltimaBusca,
        quantidadeGerar,
        historico,
        ultimoGrupoAnimado,
        toast,
        disponiveisRef,
        historicoRef,
        mostrarHelp,
        // Computados
        erroValidacao,
        totalNaoPagos,
        totalCompradores,
        // Funções
        executar,
        executarNaoPagos,
        gerarAleatorios,
        limparTudo,
        colarTexto,
        copiarNumeros,
        copiarTodosNaoPagos,
        compartilharTodosNaoPagos,
        compartilharNumeros,
        incrementarQuantidade,
        decrementarQuantidade,
        registrarEvento
    }
}

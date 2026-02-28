<template>
    <AppHeader />

    <HelpModal v-model="mostrarHelp" />

    <div :class="['container', 'main']">
        <TextInput v-model="texto" @openHelp="mostrarHelp = true" @paste="colarTexto" @search="executar" @searchUnpaid="executarNaoPagos" @clear="limparTudo" />

        <AdBanner
            :visible="numerosDisponiveis.length > 0 && config.exibirAd"
            :whatsappLink="linkWhats"
            :emailLink="linkEmail"
            @contactWhatsapp="registrarEvento('abrir_whatsapp', { event_category: 'Anúncio', event_label: 'Clique em WhatsApp' })"
            @contactEmail="registrarEvento('abrir_email', { event_category: 'Anúncio', event_label: 'Clique em E-mail' })"
        />

        <AvailableNumbers
            :visible="tipoUltimaBusca === 'disponivel' && numerosDisponiveis.length > 0"
            :numeros="numerosDisponiveis"
            :quantity="quantidadeGerar"
            :validationError="erroValidacao"
            ref="disponiveisRef"
            @copy="copiarNumeros(numerosDisponiveis)"
            @share="compartilharNumeros(numerosDisponiveis)"
            @incrementQuantity="incrementarQuantidade"
            @decrementQuantity="decrementarQuantidade"
            @updateQuantity="quantidadeGerar = $event"
            @draw="gerarAleatorios"
        />

        <UnpaidNumbers
            :visible="tipoUltimaBusca === 'nao_pago' && Object.keys(numerosNaoPagosAgrupados).length > 0"
            :unpaidGrouped="numerosNaoPagosAgrupados"
            ref="disponiveisRef"
            @copy="copiarTodosNaoPagos"
            @share="compartilharTodosNaoPagos"
        />

        <DrawHistory :visible="historico.length > 0" :history="historico" :highlightedKey="ultimoGrupoAnimado" ref="historicoRef" @copy="copiarNumeros" @share="compartilharNumeros" />

        <Toast :toast="toast" />
    </div>
    <AppFooter />
</template>

<script setup>
import { computed } from 'vue'
import { config } from './config'
import { useRifaLogic } from './composables/useRifaLogic'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HelpModal from './components/HelpModal.vue'
import TextInput from './components/TextInput.vue'
import AdBanner from './components/AdBanner.vue'
import AvailableNumbers from './components/AvailableNumbers.vue'
import UnpaidNumbers from './components/UnpaidNumbers.vue'
import DrawHistory from './components/DrawHistory.vue'
import Toast from './components/Toast.vue'

document.title = 'Sorteador de Rifas'

const {
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
    erroValidacao,
    executar,
    executarNaoPagos,
    gerarAleatorios,
    limparTudo,
    colarTexto,
    copiarNumeros,
    copiarTodosNaoPagos,
    compartilharNumeros,
    compartilharTodosNaoPagos,
    incrementarQuantidade,
    decrementarQuantidade,
    registrarEvento
} = useRifaLogic(config)

const linkWhats = computed(() => {
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.emailBody)}`
})

const linkEmail = computed(() => {
    return `mailto:${config.emailAddress}?subject=${encodeURIComponent(config.emailSubject)}&body=${encodeURIComponent(config.emailBody)}`
})
</script>

<style scoped lang="scss">
.main {
    flex: 1;
}
</style>

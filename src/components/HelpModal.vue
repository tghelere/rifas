<template>
    <div v-if="modelValue" class="modal-overlay" @click="emit('update:modelValue', false)">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h5 class="modal-title">Como usar o Sorteador de Rifas</h5>
                <button type="button" class="btn-close text-danger" @click="emit('update:modelValue', false)" aria-label="Fechar"></button>
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
</template>

<script setup>
defineProps({
    modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
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

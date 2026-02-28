<template>
    <transition name="slide-fade">
        <div v-if="visible" class="card ad border-1 mb-3 py-4">
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
                            @click="emit('contactWhatsapp')"
                            :href="whatsappLink"
                            target="_blank"
                            title="Entrar em contato pelo WhatsApp"
                        >
                            <i class="bi bi-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                    <div class="col-12 col-md-2">
                        <a
                            class="btn btn-sm btn-dark w-100 d-flex justify-content-center align-items-center gap-2"
                            @click="emit('contactEmail')"
                            :href="emailLink"
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
</template>

<script setup>
const props = defineProps({
    visible: Boolean,
    whatsappLink: String,
    emailLink: String
})

const emit = defineEmits(['contactWhatsapp', 'contactEmail'])
</script>

<style scoped lang="scss">
.card.ad h5 {
    font-size: 1em;
}

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
</style>

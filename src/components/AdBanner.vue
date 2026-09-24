<template>
    <div class="card border-1 mb-3">
        <div class="card-body text-center">
            <transition name="fade" mode="out-in">
                <div :key="currentSlide.id">
                    <i :class="['bi', currentSlide.icone, 'slide-icon', 'text-success']"></i>
                    <h5 class="mt-2 mb-1 text-truncate">{{ currentSlide.nome }}</h5>
                    <p class="text-muted small descricao-clamp mb-1">{{ currentSlide.descricao }}</p>
                    <p class="small text-success destaque-line mb-2" :style="{ visibility: currentSlide.destaque ? 'visible' : 'hidden' }">
                        {{ currentSlide.destaque || '.' }}
                    </p>
                    <div class="row g-2 justify-content-center">
                        <div class="col-12 col-md-2">
                            <a
                                class="btn btn-sm btn-success w-100 d-flex justify-content-center align-items-center gap-2"
                                :href="currentSlide.whatsappHref"
                                target="_blank"
                                rel="noopener"
                                title="Entrar em contato pelo WhatsApp"
                                @click="onWhatsappClick"
                            >
                                <i class="bi bi-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                        <div class="col-12 col-md-2">
                            <a
                                class="btn btn-sm btn-dark w-100 d-flex justify-content-center align-items-center gap-2"
                                :href="currentSlide.secondHref"
                                target="_blank"
                                rel="noopener"
                                :title="currentSlide.secondLabel"
                                @click="onSecondClick"
                            >
                                <i :class="['bi', currentSlide.secondIcon]"></i> {{ currentSlide.secondLabel }}
                            </a>
                        </div>
                    </div>
                </div>
            </transition>
            <div v-if="slides.length > 1" class="dots mt-3 d-flex justify-content-center gap-2">
                <span v-for="(slide, idx) in slides" :key="slide.id" class="dot" :class="{ active: idx === currentIndex }"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { anunciantes } from '../data/anunciantes.js'

const ROTATION_INTERVAL = 7000

const props = defineProps({
    whatsappLink: String,
    emailLink: String
})

const emit = defineEmits(['contactWhatsapp', 'contactEmail'])

function embaralhar(array) {
    const resultado = [...array]
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[resultado[i], resultado[j]] = [resultado[j], resultado[i]]
    }
    return resultado
}

const anunciantesAtivos = embaralhar(anunciantes.filter((a) => a.ativo))
const isVagaDisponivel = anunciantesAtivos.length === 0

const slides = isVagaDisponivel
    ? [
          {
              id: 'vaga-disponivel',
              nome: 'Sua empresa aqui',
              descricao: 'Anuncie seu produto ou serviço para quem usa esta ferramenta',
              icone: 'bi-megaphone',
              destaque: '',
              whatsappHref: props.whatsappLink,
              secondHref: props.emailLink,
              secondLabel: 'E-mail',
              secondIcon: 'bi-envelope-at'
          }
      ]
    : anunciantesAtivos.map((a) => ({
          id: a.id,
          nome: a.nome,
          descricao: a.descricao,
          icone: a.icone,
          destaque: a.destaque || '',
          whatsappHref: `https://wa.me/${a.whatsapp}`,
          secondHref: a.site,
          secondLabel: 'Site',
          secondIcon: 'bi-box-arrow-up-right'
      }))

const currentIndex = ref(0)
const currentSlide = computed(() => slides[currentIndex.value])

let intervalId = null

onMounted(() => {
    if (slides.length > 1) {
        intervalId = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % slides.length
        }, ROTATION_INTERVAL)
    }
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})

function onWhatsappClick() {
    if (isVagaDisponivel) emit('contactWhatsapp')
}

function onSecondClick() {
    if (isVagaDisponivel) emit('contactEmail')
}
</script>

<style scoped lang="scss">
.slide-icon {
    font-size: 1.5rem;
}

.descricao-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4em;
    height: 2.8em;
}

.destaque-line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ced4da;
    transition: background-color 0.3s ease;

    &.active {
        background-color: #198754;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

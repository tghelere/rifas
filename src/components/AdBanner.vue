<template>
    <div v-if="visible" class="card border-1 mb-3">
        <div class="card-body p-0 pb-3 text-center">
            <div id="ad-carousel" ref="carouselRef" class="carousel slide carousel-fade">
                <div class="carousel-inner">
                    <div v-for="(slide, idx) in slides" :key="slide.id" :class="['carousel-item', { active: idx === 0 }]">
                        <div class="slide-body">
                            <a
                                v-if="slide.tipo === 'imagem'"
                                class="slide-image-link"
                                :href="slide.linkHref"
                                target="_blank"
                                rel="noopener"
                                :title="slide.nome || 'Anúncio'"
                            >
                                <img :src="slide.imagemUrl" :alt="slide.nome || 'Anúncio'" class="slide-image" />
                            </a>
                            <template v-else>
                                <div class="slide-photo" :style="fotoStyle(slide)">
                                    <span class="ad-label">Publicidade</span>
                                    <i v-if="!slide.foto" :class="['bi', slide.icone, 'slide-photo-icon']"></i>
                                </div>
                                <div class="slide-info px-3 pt-2">
                                    <h5 class="mb-1 text-truncate">{{ slide.nome }}</h5>
                                    <p class="text-muted small descricao-clamp mb-1">{{ slide.descricao }}</p>
                                    <p class="small text-success destaque-line mb-2" :style="{ visibility: slide.destaque ? 'visible' : 'hidden' }">
                                        {{ slide.destaque || '.' }}
                                    </p>
                                    <a
                                        class="btn btn-sm w-100 d-flex justify-content-center align-items-center gap-2"
                                        :style="ctaStyle(slide)"
                                        :href="slide.ctaHref"
                                        target="_blank"
                                        rel="noopener"
                                        :title="slide.ctaLabel"
                                        @click="onCtaClick"
                                    >
                                        <i :class="['bi', slide.ctaIcon]"></i> {{ slide.ctaLabel }}
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div v-if="slides.length > 1" class="carousel-indicators">
                    <button
                        v-for="(slide, idx) in slides"
                        :key="slide.id"
                        type="button"
                        data-bs-target="#ad-carousel"
                        :data-bs-slide-to="idx"
                        :class="{ active: idx === 0 }"
                        :aria-label="`Anunciante ${idx + 1}`"
                    ></button>
                </div>
                <template v-if="slides.length > 1">
                    <button class="carousel-control-prev" type="button" data-bs-target="#ad-carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#ad-carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Próximo</span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted, watch, nextTick } from 'vue'
import { Carousel } from 'bootstrap'
import { anunciantes } from '../data/anunciantes.js'
import { anunciantesExemplo } from '../data/anunciantes.exemplo.js'

const ROTATION_INTERVAL = 7000
const COR_PADRAO = '#198754'

const props = defineProps({
    visible: Boolean,
    modoDemo: Boolean,
    whatsappLink: String
})

const emit = defineEmits(['contactWhatsapp'])

function embaralhar(array) {
    const resultado = [...array]
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[resultado[i], resultado[j]] = [resultado[j], resultado[i]]
    }
    return resultado
}

function corTextoContraste(hex) {
    if (!hex) return '#ffffff'
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminancia > 0.6 ? '#212529' : '#ffffff'
}

const listaAnunciantes = props.modoDemo ? anunciantesExemplo : anunciantes
const anunciantesAtivos = embaralhar(listaAnunciantes.filter((a) => a.ativo))
const isVagaDisponivel = anunciantesAtivos.length === 0

const slides = isVagaDisponivel
    ? [
          {
              id: 'vaga-disponivel',
              tipo: 'card',
              nome: 'Sua empresa aqui',
              descricao: 'Anuncie seu produto ou serviço para quem usa esta ferramenta',
              icone: 'bi-megaphone',
              cor: COR_PADRAO,
              foto: '',
              destaque: '',
              ctaHref: props.whatsappLink,
              ctaLabel: 'Quero anunciar',
              ctaIcon: 'bi-whatsapp',
              imagemUrl: '',
              linkHref: ''
          }
      ]
    : anunciantesAtivos.map((a) => ({
          id: a.id,
          tipo: a.tipo || 'card',
          nome: a.nome,
          descricao: a.descricao,
          icone: a.icone,
          cor: a.cor || COR_PADRAO,
          foto: a.foto || '',
          destaque: a.destaque || '',
          ctaHref: a.site || (a.whatsapp ? `https://wa.me/${a.whatsapp}` : ''),
          ctaLabel: a.site ? 'Visitar site' : 'Chamar no WhatsApp',
          ctaIcon: a.site ? 'bi-box-arrow-up-right' : 'bi-whatsapp',
          imagemUrl: a.imagemUrl || '',
          linkHref: a.site || (a.whatsapp ? `https://wa.me/${a.whatsapp}` : '')
      }))

function fotoStyle(slide) {
    if (slide.foto) {
        return { backgroundImage: `url(${slide.foto})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    return { backgroundColor: slide.cor || COR_PADRAO }
}

function ctaStyle(slide) {
    const cor = slide.cor || COR_PADRAO
    return { backgroundColor: cor, borderColor: cor, color: corTextoContraste(cor) }
}

const carouselRef = ref(null)
let carouselInstance = null

function iniciarCarousel() {
    if (slides.length > 1 && carouselRef.value && !carouselInstance) {
        carouselInstance = new Carousel(carouselRef.value, {
            interval: ROTATION_INTERVAL,
            ride: 'carousel',
            pause: 'hover',
            touch: true,
            wrap: true
        })
    }
}

function pararCarousel() {
    if (carouselInstance) {
        carouselInstance.dispose()
        carouselInstance = null
    }
}

watch(
    () => props.visible,
    async (visivel) => {
        if (visivel) {
            await nextTick()
            iniciarCarousel()
        } else {
            pararCarousel()
        }
    },
    { immediate: true }
)

onUnmounted(() => {
    pararCarousel()
})

function onCtaClick() {
    if (isVagaDisponivel) emit('contactWhatsapp')
}
</script>

<style scoped lang="scss">
.slide-body {
    height: 260px;
}

.slide-photo {
    position: relative;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.slide-photo-icon {
    color: #ffffff;
    font-size: 2rem;
}

.ad-label {
    position: absolute;
    top: 6px;
    left: 8px;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1px 6px;
    border-radius: 4px;
    letter-spacing: 0.02em;
}

.slide-image-link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.slide-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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

.carousel-indicators {
    position: static;
    margin: 0.5rem 0 0;
}

.carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 0;
    opacity: 0.5;
    background-color: #adb5bd;
    margin: 0 4px;

    &.active {
        opacity: 1;
        background-color: #198754;
    }
}

.carousel-control-prev,
.carousel-control-next {
    top: 0;
    bottom: auto;
    height: 120px;
}
</style>

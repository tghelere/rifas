<template>
    <div v-if="visible" class="card border-1 mb-3">
        <div class="card-body p-0 pb-3 text-center">
            <div id="ad-carousel" ref="carouselRef" class="carousel slide carousel-fade" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="onPointerCancel">
                <div class="carousel-inner">
                    <div v-for="(slide, idx) in slides" :key="slide.id" :class="['carousel-item', { active: idx === 0 }]">
                        <div class="slide-body">
                            <div v-if="slide.tipo === 'imagem'" class="slide-image-bg" :style="imagemBgStyle(slide)">
                                <template v-if="slide.temOverlayImagem">
                                    <div class="slide-image-overlay"></div>
                                    <div class="slide-image-content">
                                        <h5 v-if="slide.titulo" class="slide-image-titulo mb-1">{{ slide.titulo }}</h5>
                                        <p v-if="slide.subtitulo" class="slide-image-subtitulo mb-2">{{ slide.subtitulo }}</p>
                                        <div v-if="slide.botoes.length" class="d-flex justify-content-center gap-2 flex-wrap">
                                            <a
                                                v-for="(btn, bi) in slide.botoes"
                                                :key="bi"
                                                class="btn btn-sm d-inline-flex align-items-center gap-1"
                                                :style="ctaStyle(slide)"
                                                :href="btn.href"
                                                target="_blank"
                                                rel="noopener"
                                                :title="btn.label"
                                                @click="onCtaClick"
                                            >
                                                <i :class="['bi', btn.icon]"></i> {{ btn.label }}
                                            </a>
                                        </div>
                                    </div>
                                </template>
                                <a v-else class="slide-image-link" :href="slide.linkHref" target="_blank" rel="noopener" :title="slide.nome || 'Anúncio'"></a>
                            </div>
                            <template v-else>
                                <div class="slide-photo" :style="fotoStyle(slide)">
                                    <div v-if="slide.foto" class="slide-photo-gradient" :style="gradienteStyle(slide)"></div>
                                    <span class="ad-label">Publicidade</span>
                                    <i v-if="slide.isVaga" :class="['bi', slide.icone, 'slide-photo-icon']"></i>
                                </div>
                                <div class="slide-info px-3 pt-2">
                                    <h5 class="mb-1 text-truncate">{{ slide.nome }}</h5>
                                    <p class="text-muted small descricao-clamp mb-1">{{ slide.descricao }}</p>
                                    <p class="small text-success destaque-line mb-2" :style="{ visibility: slide.destaque ? 'visible' : 'hidden' }">
                                        {{ slide.destaque || '.' }}
                                    </p>
                                    <div v-if="slide.botoes.length" class="d-flex justify-content-center gap-2 flex-wrap">
                                        <a
                                            v-for="(btn, bi) in slide.botoes"
                                            :key="bi"
                                            class="btn btn-sm d-inline-flex align-items-center gap-1"
                                            :style="ctaStyle(slide)"
                                            :href="btn.href"
                                            target="_blank"
                                            rel="noopener"
                                            :title="btn.label"
                                            @click="onCtaClick"
                                        >
                                            <i :class="['bi', btn.icon]"></i> {{ btn.label }}
                                        </a>
                                    </div>
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
const LIMIAR_ARRASTO = 50

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

function botoesDoAnunciante(a) {
    const botoes = []
    if (a.whatsapp) botoes.push({ href: `https://wa.me/${a.whatsapp}`, label: 'WhatsApp', icon: 'bi-whatsapp' })
    if (a.site) botoes.push({ href: a.site, label: 'Visitar site', icon: 'bi-box-arrow-up-right' })
    return botoes
}

const listaAnunciantes = props.modoDemo ? anunciantesExemplo : anunciantes
const anunciantesAtivos = embaralhar(listaAnunciantes.filter((a) => a.ativo))
const isVagaDisponivel = anunciantesAtivos.length === 0

const slides = isVagaDisponivel
    ? [
          {
              id: 'vaga-disponivel',
              tipo: 'card',
              isVaga: true,
              nome: 'Sua empresa aqui',
              descricao: 'Anuncie seu produto ou serviço para quem usa esta ferramenta',
              icone: 'bi-megaphone',
              cor: COR_PADRAO,
              foto: '',
              destaque: '',
              botoes: [{ href: props.whatsappLink, label: 'Quero anunciar', icon: 'bi-whatsapp' }],
              imagemUrl: '',
              titulo: '',
              subtitulo: '',
              temOverlayImagem: false,
              linkHref: ''
          }
      ]
    : anunciantesAtivos.map((a) => {
          const botoes = botoesDoAnunciante(a)
          return {
              id: a.id,
              tipo: a.tipo || 'card',
              isVaga: false,
              nome: a.nome,
              descricao: a.descricao,
              icone: a.icone,
              cor: a.cor || COR_PADRAO,
              foto: a.foto || '',
              destaque: a.destaque || '',
              botoes,
              imagemUrl: a.imagemUrl || '',
              titulo: a.titulo || '',
              subtitulo: a.subtitulo || '',
              temOverlayImagem: !!(a.titulo || a.subtitulo || botoes.length),
              linkHref: a.site || (a.whatsapp ? `https://wa.me/${a.whatsapp}` : '')
          }
      })

function fotoStyle(slide) {
    if (slide.foto) {
        return { backgroundImage: `url(${slide.foto})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    return { backgroundColor: slide.cor || COR_PADRAO }
}

function gradienteStyle(slide) {
    const cor = slide.cor || COR_PADRAO
    return { background: `linear-gradient(to right, ${cor} 0%, transparent 25%, transparent 75%, ${cor} 100%)` }
}

function imagemBgStyle(slide) {
    return { backgroundImage: `url(${slide.imagemUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
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

// Arrastar com o mouse no desktop (o Carousel do Bootstrap só arrasta por toque real).
let arrastoInicioX = null

function onPointerDown(e) {
    if (e.pointerType === 'touch' || !carouselInstance) return
    if (e.target.closest('a, button')) return
    arrastoInicioX = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
}

function onPointerUp(e) {
    if (e.pointerType === 'touch' || arrastoInicioX === null || !carouselInstance) return
    const deltaX = e.clientX - arrastoInicioX
    arrastoInicioX = null
    if (Math.abs(deltaX) < LIMIAR_ARRASTO) return
    if (deltaX < 0) {
        carouselInstance.next()
    } else {
        carouselInstance.prev()
    }
}

function onPointerCancel() {
    arrastoInicioX = null
}
</script>

<style scoped lang="scss">
.slide-body {
    height: 260px;
}

#ad-carousel {
    cursor: grab;
}

.slide-photo {
    position: relative;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.slide-photo-gradient {
    position: absolute;
    inset: 0;
}

.slide-photo-icon {
    color: #ffffff;
    font-size: 2rem;
    position: relative;
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

.slide-image-bg {
    position: relative;
    height: 100%;
    width: 100%;
}

.slide-image-link {
    position: absolute;
    inset: 0;
}

.slide-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 40%, transparent 70%);
}

.slide-image-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 16px 14px;
    color: #ffffff;
}

.slide-image-titulo {
    font-weight: 700;
}

.slide-image-subtitulo {
    font-size: 0.85em;
    opacity: 0.9;
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
    position: absolute;
    top: 92px;
    bottom: auto;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: auto;
    margin: 0;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 999px;
    gap: 6px;
}

.carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 0;
    opacity: 0.6;
    background-color: #ffffff;
    margin: 0;

    &.active {
        opacity: 1;
    }
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 50%;
    width: 2.25rem;
    height: 2.25rem;
    background-size: 60%;
}
</style>

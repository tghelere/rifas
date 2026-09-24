# CLAUDE.md

## 1. Objetivo deste arquivo

Este arquivo contém o contexto completo do projeto para uso com Claude Code.

Antes de alterar qualquer código:

- Leia este arquivo.
- Preserve as decisões e padrões já adotados.
- Não faça refatorações ou mudanças arquiteturais sem necessidade.
- Faça alterações pequenas, objetivas e compatíveis com a estrutura atual.
- Não substitua tecnologias ou bibliotecas sem solicitação explícita.
- Não "melhore" partes não relacionadas ao problema solicitado.
- Não altere nomes de funções, variáveis ou arquivos sem necessidade.
- Evite gerar código excessivamente complexo para uma aplicação simples.

O projeto é propositalmente simples.

Este arquivo deve ser mantido atualizado. Se uma alteração de código mudar algo descrito aqui, atualizar a seção correspondente no mesmo momento (ou avisar que ficou desatualizada).

---

# 2. Projeto

## Nome

Sorteador de Rifas

## Objetivo

Aplicação web para realizar sorteios de números de rifas.

O usuário cola uma lista de números em um textarea, no formato:

```text
1 -
2 - Maria Santos 💰
3 - Pedro Oliveira
4 -
5 - Ana Costa 💸
```

Cada linha pode representar:

- um número **disponível** (sem nome depois do hífen);
- um número **reservado e não pago** (nome depois do hífen, sem 💰/💸);
- um número **pago** (nome depois do hífen, com 💰 ou 💸) — atualmente ignorado pelas duas buscas, ou seja, não aparece nem como disponível nem como não pago.

A aplicação tem dois fluxos de busca (ver seção 17):

- **Buscar disponíveis**: identifica os números livres e permite sortear um ou vários números aleatoriamente.
- **Não pagos**: identifica os números reservados mas ainda não pagos, agrupados por comprador.

Os números sorteados são registrados no histórico durante a sessão.

---

# 3. Características principais

A aplicação é:

- SPA (Single Page Application)
- Front-end only
- Sem banco de dados
- Sem backend próprio
- Sem autenticação
- Sem login
- Sem API própria
- Pode funcionar completamente como aplicação estática
- Pretende ser transformada em PWA (ver seção 35 — parcialmente iniciada)
- Deve funcionar muito bem em desktop e principalmente celular
- Deve ser simples e barata de hospedar
- Deve ter deploy automatizado posteriormente

A aplicação não precisa de processamento no servidor para realizar o sorteio.

---

# 4. Stack atual

## Framework

Vue 3 (Composition API, `<script setup>`)

## Build tool

Vite

## CSS

Bootstrap 5

## Ícones

Bootstrap Icons

## Pré-processador

SCSS

## Linguagem

JavaScript

## Lint / formatação

- ESLint (`eslint.config.js`, `npm run lint`)
- Prettier (`.prettierrc`)

## Analytics

Google Analytics 4 usando Google tag / gtag.js diretamente, carregado manualmente (sem biblioteca de terceiros).

### Importante

Foi testado o pacote `vue-gtag-next`, mas ele causou problemas no projeto, incluindo tela branca.

Por isso, NÃO voltar a utilizar `vue-gtag-next` sem uma razão muito forte.

A implementação atual usa `src/plugins/gtag.js` (ver seção 8).

---

# 5. Estrutura real

```text
src/
    App.vue                          # orquestração: liga o composable aos componentes de UI
    main.js
    config.js                        # dados de contato do anúncio (via env vars)
    data/
        anunciantes.js               # array de anunciantes do AdBanner (hoje vazio, seção 16)
        anunciantes.exemplo.js       # dados ilustrativos p/ testar o AdBanner visualmente (não usado em produção)
    composables/
        useRifaLogic.js              # todo o estado e a lógica de negócio da aplicação
    plugins/
        gtag.js                      # setupAnalytics(app) + app.config.globalProperties.$trackEvent
    components/
        AppHeader.vue
        AppFooter.vue
        HelpModal.vue                # modal "Como usar"
        TextInput.vue                # textarea + botões Colar / Buscar disponíveis / Não pagos / Limpar
        AdBanner.vue                 # carrossel de anunciantes + estado de "vaga disponível" (seção 16)
        AvailableNumbers.vue         # card de números disponíveis + sorteio
        UnpaidNumbers.vue            # card de números não pagos, agrupados por comprador
        DrawHistory.vue              # histórico de sorteios
        Toast.vue
    assets/
        styles/
            main.scss

public/
    apple-touch-icon.png
    favicon-16x16.png / favicon-32x32.png
    android-chrome-192x192.png / android-chrome-512x512.png
    site.webmanifest
    bg.jpg

index.html
vite.config.js
jsconfig.json
eslint.config.js
.prettierrc
.env / .env.example
```

Também existem arquivos padrão do Vite.

**A aplicação já foi componentizada** (commit "Componentização da aplicação"). O `App.vue` não é mais um componente monolítico: ele importa o composable `useRifaLogic` e passa o estado/funções como props/eventos para os componentes de `src/components/`. Não assumir que toda a lógica está em `App.vue` — a lógica de negócio (busca, sorteio, clipboard, compartilhamento, analytics) vive em `src/composables/useRifaLogic.js`.

Não assumir que esta estrutura é exaustiva. Verificar os arquivos reais antes de modificar.

---

# 6. main.js

O `main.js` atual:

```js
import { createApp } from 'vue'
import App from './App.vue'
import { setupAnalytics } from './plugins/gtag.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'

const app = createApp(App)

setupAnalytics(app)

app.mount('#app')
```

**Import do JS do Bootstrap**: `import 'bootstrap'` (build ESM, `bootstrap/dist/js/bootstrap.esm.js`), não mais `import 'bootstrap/dist/js/bootstrap.js'` (build UMD). Mudou porque `AdBanner.vue` (seção 16) importa a classe `Carousel` via `import { Carousel } from 'bootstrap'` para controlar o carrossel de anúncios programaticamente; usar builds diferentes (UMD em `main.js` + ESM em `AdBanner.vue`) fazia o Vite empacotar o Bootstrap JS duas vezes (bundle ~240 KB em vez de ~178 KB). Mesma versão do Bootstrap, mesmo comportamento — só o formato do módulo mudou, para permitir deduplicação.

## Problema histórico (resolvido)

Durante o desenvolvimento houve um problema relacionado ao carregamento do Analytics: a aplicação ficava com tela branca, e apenas comentar a chamada de inicialização não resolvia — era necessário comentar também o `import` do módulo de analytics.

Isso indicava que o problema podia ocorrer durante a avaliação/importação do módulo, não apenas na execução da função de inicialização.

A implementação atual (`setupAnalytics`, seção 8) já foi escrita levando isso em conta: toda a lógica de carregamento do script fica dentro de um `try/catch`, e a função nunca lança exceção durante a avaliação do módulo. Se uma tela branca relacionada a Analytics voltar a ocorrer, o primeiro ponto a investigar continua sendo `src/plugins/gtag.js`.

---

# 7. Google Analytics

Measurement ID atual:

```text
G-Z43X80HZFT
```

É uma propriedade Google Analytics 4.

A intenção não é analisar navegação entre páginas, porque atualmente existe apenas uma página.

O objetivo principal do Analytics é entender:

- quantas pessoas usam a ferramenta;
- quantas sessões acontecem;
- quantos usuários retornam;
- quantas vezes a ferramenta é utilizada;
- quantas pessoas executam uma busca (disponíveis ou não pagos);
- quantas pessoas realizam sorteios;
- quantidade de números sorteados;
- quantos números são copiados/compartilhados;
- quantas pessoas utilizam os botões de anúncio;
- quais funcionalidades são mais utilizadas.

---

# 8. gtag.js

Localização: `src/plugins/gtag.js`.

A implementação atual expõe `setupAnalytics(app)`, chamada uma vez em `main.js`:

```js
export function setupAnalytics(app) {
    const initGtag = () => {
        try {
            window.dataLayer = window.dataLayer || []

            function gtag() {
                window.dataLayer.push(arguments)
            }
            window.gtag = gtag

            const script = document.createElement('script')
            script.async = true
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z43X80HZFT'
            script.onload = () => {
                gtag('js', new Date())
                gtag('config', 'G-Z43X80HZFT', {
                    anonymize_ip: true,
                    page_path: window.location.pathname,
                    page_title: document.title
                })
            }
            script.onerror = () => {
                console.warn('Google Analytics script falhou ao carregar (pode estar bloqueado)')
            }
            document.head.appendChild(script)
        } catch (err) {
            console.warn('Erro ao inicializar Google Analytics:', err)
        }
    }

    initGtag()

    app.config.globalProperties.$trackEvent = function (eventName, eventData = {}) {
        try {
            if (window.gtag && typeof window.gtag === 'function') {
                window.gtag('event', eventName, eventData)
            }
        } catch (err) {
            console.debug('Analytics indisponível:', err)
        }
    }
}
```

Pontos importantes desta implementação:

- `anonymize_ip: true` já está configurado (relevante para LGPD, ver seção 47).
- Toda a inicialização está dentro de `try/catch` — uma falha aqui nunca deve impedir o `app.mount('#app')`.
- `$trackEvent` é registrado em `app.config.globalProperties`, e é acessado dentro do composable via `getCurrentInstance()` (ver seção 10). Não é uma variável global solta nem um plugin Pinia/Vuex.
- Se `window.gtag` não existir, `$trackEvent` simplesmente não faz nada.

Se uma alteração precisar mexer neste arquivo, testar `npm run build` e `npm run dev`, e confirmar no Network do navegador que o script do GA carrega.

---

# 9. Eventos atualmente disparados

```text
buscar_numeros
buscar_nao_pagos
sortear_numeros
limpar_tudo
colar_texto
copiar_numeros
copiar_todos_nao_pagos
compartilhar_numeros
compartilhar_todos_nao_pagos
incrementar_quantidade
decrementar_quantidade
abrir_whatsapp
```

A intenção é medir interações reais da aplicação, sem excesso (ver seção 69).

**`abrir_email` foi removido** (seção 16): o `AdBanner` passou a ter um único botão de CTA por slide em vez de dois (WhatsApp + E-mail), então não há mais um clique de "E-mail" para disparar esse evento. `config.emailAddress`/`emailSubject` continuam em `config.js` (não alterado), mas hoje não são lidos por nenhum componente.

---

# 10. Função registrarEvento

Vive dentro de `src/composables/useRifaLogic.js` (não em `App.vue`):

```js
const instance = getCurrentInstance()
const app = instance?.appContext.config.globalProperties || {}

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
```

Diferenças em relação a uma versão anterior mais simples:

- A assinatura mudou de `registrarEvento(nome, categoria, rotulo, valor)` para `registrarEvento(nomeEvento, dados = {})`, onde `dados` é um objeto de parâmetros GA4 (ver seção 11).
- Todo evento recebe automaticamente um `timestamp` ISO.
- O acesso ao analytics é via `$trackEvent` (injetado em `setupAnalytics`, seção 8), obtido através de `getCurrentInstance()`. Isso só funciona porque `useRifaLogic()` é chamado durante o `setup()` de um componente (em `App.vue`).
- Se `$trackEvent` não existir, a aplicação simplesmente ignora o evento.

Analytics nunca deve ser capaz de quebrar a aplicação.

---

# 11. Modelagem de eventos GA4

O projeto usa modelagem semântica baseada em objetos de parâmetros, e não mais no padrão antigo `event_category` / `event_label` / `value` do Universal Analytics como argumentos posicionais.

Exemplo real (`gerarAleatorios`):

```js
registrarEvento('sortear_numeros', {
    event_category: 'Interação',
    event_label: 'Sorteio executado',
    quantidade_sorteada: quantidadeGerar.value
})
```

Note que `event_category`/`event_label` continuam sendo usados como campos dentro do objeto `dados` (não foram abandonados), mas agora convivem com campos mais descritivos como `quantidade_sorteada`, `quantidade_numeros`, `quantidade_compradores`, etc.

Não é necessário refatorar tudo apenas por isso. Se os eventos forem revisados, fazer a mudança de maneira consistente.

Se parâmetros personalizados forem utilizados em relatórios do GA4, registrar as dimensões/métricas personalizadas necessárias no próprio GA4.

---

# 12. Eventos atualmente utilizados (detalhe)

## Buscar disponíveis

```js
registrarEvento('buscar_numeros', {
    event_category: 'Interação',
    event_label: 'Clique em Buscar',
    quantidade_numeros: disponiveis.length
})
```

## Buscar não pagos

```js
registrarEvento('buscar_nao_pagos', {
    event_category: 'Interação',
    event_label: 'Clique em Não Pagos',
    quantidade_nao_pagos: totalNaoPagos.value,
    quantidade_compradores: totalCompradores.value
})
```

## Sortear números

```js
registrarEvento('sortear_numeros', {
    event_category: 'Interação',
    event_label: 'Sorteio executado',
    quantidade_sorteada: quantidadeGerar.value
})
```

## Limpar

```js
registrarEvento('limpar_tudo', {
    event_category: 'Interação',
    event_label: 'Clique em Limpar'
})
```

Este evento está ativo (não comentado).

## Colar texto

```js
registrarEvento('colar_texto', {
    event_category: 'Interação',
    event_label: 'Clique em Colar'
})
```

Está ativo (não comentado).

## Copiar números (disponíveis ou sorteados)

```js
registrarEvento('copiar_numeros', {
    event_category: 'Interação',
    event_label: `Copiou números ${tipoNumeros}`,
    quantidade_numeros: numeros.length
})
```

## Copiar todos os não pagos

```js
registrarEvento('copiar_todos_nao_pagos', {
    event_category: 'Interação',
    event_label: 'Copiou números não pagos',
    quantidade_numeros: totalNaoPagos.value,
    quantidade_compradores: totalCompradores.value
})
```

## Compartilhar números (WhatsApp)

```js
registrarEvento('compartilhar_numeros', {
    event_category: 'Interação',
    event_label: `Compartilhou números ${tipoNumeros}`,
    quantidade_numeros: numeros.length
})
```

## Compartilhar todos os não pagos (WhatsApp)

```js
registrarEvento('compartilhar_todos_nao_pagos', {
    event_category: 'Interação',
    event_label: 'Compartilhou números não pagos',
    quantidade_numeros: totalNaoPagos.value,
    quantidade_compradores: totalCompradores.value
})
```

## Incrementar quantidade

```js
registrarEvento('incrementar_quantidade', {
    event_category: 'Interação',
    event_label: 'Incrementou quantidade',
    quantidade: quantidadeGerar.value
})
```

## Decrementar quantidade

```js
registrarEvento('decrementar_quantidade', {
    event_category: 'Interação',
    event_label: 'Decrementou quantidade',
    quantidade: quantidadeGerar.value
})
```

## WhatsApp (anúncio)

Disparado em `App.vue`, não no composable. Único evento de clique do `AdBanner` (seção 16) — dispara apenas no botão de CTA do estado "vaga disponível", nunca em cliques de anunciantes reais:

```vue
@contactWhatsapp="registrarEvento('abrir_whatsapp', { event_category: 'Anúncio', event_label: 'Clique em WhatsApp' })"
```

**Não existe mais `abrir_email`** (ver seção 9) — o `AdBanner` tinha dois botões (WhatsApp + E-mail) e passou a ter um único CTA por slide.

---

# 13. Não duplicar eventos

Em uma versão anterior do código houve acidentalmente uma duplicação de disparo do mesmo evento em uma mesma ação do usuário.

Isso deve ser evitado. Cada ação do usuário deve gerar apenas um evento.

---

# 14. Arquitetura: App.vue + composable

`App.vue` **não é mais** o componente que concentra toda a lógica. Hoje ele é uma camada fina de orquestração:

- importa `useRifaLogic(config)`, que devolve todo o estado (refs), computeds e funções;
- passa esse estado para os componentes de `src/components/` via props;
- escuta os eventos emitidos pelos componentes e chama as funções do composable.

Toda a lógica de negócio (regex, sorteio, clipboard, compartilhamento, scroll, toast, analytics) vive em `src/composables/useRifaLogic.js`.

Essa é uma mudança arquitetural real, adotada deliberadamente (commit "Componentização da aplicação"). **Não é** um convite para continuar adicionando camadas. Continuam fora do escopo, salvo pedido explícito:

- Pinia / Vuex;
- Vue Router;
- múltiplos composables adicionais sem necessidade concreta;
- camada de services/repositories;
- TypeScript.

A aplicação continua pequena: um composable central e um conjunto pequeno de componentes de apresentação.

---

# 15. Estado principal (em useRifaLogic.js)

```js
const texto = ref('')
const numerosDisponiveis = ref([])
const numerosNaoPagosAgrupados = ref({})
const tipoUltimaBusca = ref(null)          // 'disponivel' | 'nao_pago' | null
const quantidadeGerar = ref(1)
const historico = ref([])
const ultimoGrupoAnimado = ref(null)
const toast = ref('')
const disponiveisRef = ref(null)
const historicoRef = ref(null)
const mostrarHelp = ref(false)
```

Computeds:

```js
erroValidacao       // valida quantidadeGerar
totalNaoPagos        // total de números não pagos (todos os compradores)
totalCompradores      // número de compradores distintos com pendência
```

`tipoUltimaBusca` controla qual card é exibido (`AvailableNumbers` vs `UnpaidNumbers`) — os dois fluxos de busca são mutuamente exclusivos na tela (buscar de novo limpa o resultado anterior, ver `limparResultados()`).

---

# 16. Dados de contato do anúncio

Diferente de versões anteriores, os dados de contato **não estão mais hardcoded** em `App.vue`. Ficam em `src/config.js`, lidos de variáveis de ambiente:

```js
// src/config.js
export const config = {
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER,
    emailAddress: import.meta.env.VITE_EMAIL_ADDRESS,
    emailSubject: 'Anúncio no Sorteador de Rifas',
    emailBody: 'Gostaria de anunciar meu produto ou serviço no Sorteador de Rifas.',
    exibirAd: false
}
```

Os valores reais ficam em `.env` (não versionado, está no `.gitignore`). `.env.example` documenta as chaves esperadas:

```text
VITE_WHATSAPP_NUMBER=
VITE_EMAIL_ADDRESS=
```

As variáveis usam o prefixo `VITE_` (corrigido — anteriormente eram `WHATSAPP_NUMBER`/`EMAIL_ADDRESS` sem prefixo, e por isso não eram expostas ao client via `import.meta.env`, já que o Vite só expõe variáveis prefixadas com `VITE_` por padrão). Confirmado via build que os valores são lidos corretamente.

Links são montados em `App.vue`:

```js
const linkWhats = computed(() => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.emailBody)}`)

const linkEmail = computed(() => `mailto:${config.emailAddress}?subject=${encodeURIComponent(config.emailSubject)}&body=${encodeURIComponent(config.emailBody)}`)
```

Não duplicar ou expor os valores reais de `.env` em documentação externa. Preservar os valores já existentes.

`exibirAd` controla se o `AdBanner` pode aparecer; hoje está fixo em `false` no código-fonte. Ver regra completa de visibilidade abaixo.

## AdBanner: carrossel de anunciantes com estado de "vaga disponível"

`AdBanner.vue` é um carrossel que exibe anunciantes reais em rodízio, com um estado padrão de "vaga disponível" quando não há nenhum anunciante ativo. A partir de uma revisão de visual/navegação, o carrossel usa o **componente Carousel nativo do Bootstrap 5** (não mais `setInterval` + fade escritos manualmente), e cada slide `card` ganhou um bloco de identidade visual por anunciante (foto ou cor de marca).

**Fonte de dados**: `src/data/anunciantes.js`, exportando um array `anunciantes`. Cada item:

```js
{
    id, nome, descricao,
    icone,     // classe do Bootstrap Icons (ex: 'bi-shop'), usada no bloco superior quando não há foto. Só usada quando tipo === 'card'.
    cor,       // string hex, cor de marca do anunciante (ex: '#0F6E56') — usada no bloco superior (fallback sem foto) e no botão de CTA. Só usada quando tipo === 'card'.
    foto,      // opcional; caminho de imagem de fundo do bloco superior. Se ausente, usa `cor` sólida + ícone centralizado em branco. Só usada quando tipo === 'card'.
    categoria, // opcional; 'empresa' | 'produto' | 'servico' — só organizacional, não afeta renderização
    destaque,  // opcional (string)
    tipo,      // 'card' ou 'imagem' (default 'card')
    imagemUrl, // obrigatório só quando tipo === 'imagem'
    whatsapp, site, ativo
}
```

O campo `imagemMiniatura` **foi removido** (substituído pelo esquema `foto`/`cor` acima). Hoje o array está **vazio** — nenhum anunciante real cadastrado ainda.

**Imagens de anunciantes**: `foto` e `imagemUrl` devem apontar para caminhos dentro de `public/anunciantes/` (ex: `/anunciantes/ocelos-pesca.jpg`), **nunca URLs externas**. A pasta `public/anunciantes/` existe (com um `.gitkeep` para ficar versionada mesmo vazia) e não tem subpastas por cliente — os arquivos são nomeados pelo `id` do anunciante. Se o mesmo anunciante tiver foto de card **e** banner (`tipo: 'imagem'`), diferenciar o nome (ex: `ocelos-pesca.jpg` para a foto do card, `ocelos-pesca-banner.jpg` para o banner). Os dados de `anunciantes.exemplo.js` (seção acima) são exceção deliberada a essa regra — usam SVGs embutidos como data URI para não depender de arquivos externos.

Existe também `src/data/anunciantes.exemplo.js`, exportando `anunciantesExemplo` — 4 registros ilustrativos usados só para testar visualmente o componente durante o desenvolvimento: 3 do tipo `card` com cores bem distintas entre si (`#0F6E56` verde-petróleo, `#0D6EFD` azul, `#C1440E` terracota), sem `foto` (usam o fallback de cor sólida + ícone), e 1 do tipo `imagem` com banner horizontal. As imagens desses exemplos são SVGs embutidos como data URI (sem arquivos externos). **Não é importado em nenhum lugar do código de produção** (fora do modo demo) — é usado pela rota `/publicidade` (ver abaixo) e, para testes manuais adicionais, pode-se trocar temporariamente o import de `anunciantes` por `anunciantesExemplo` em `AdBanner.vue`.

**Regras de exibição** (`AdBanner.vue` filtra apenas os itens com `ativo: true`):

- **0 anunciantes ativos** (caso atual, array vazio): mostra um único slide fixo de "vaga disponível" — nome "Sua empresa aqui", descrição "Anuncie seu produto ou serviço para quem usa esta ferramenta", sem destaque, cor padrão verde (`#198754`), e um único CTA "Quero anunciar" apontando para o WhatsApp de `config.js` (`whatsappLink`) — nunca para uma empresa inventada.
- **1 anunciante ativo**: mostra esse anunciante fixo, sem setas nem indicadores (mesmo comportamento de antes).
- **2+ anunciantes ativos**: a ordem da lista é embaralhada (Fisher-Yates) uma vez por carregamento do componente — não é sempre a mesma ordem a cada carregamento (ver nota sobre timing abaixo). Setas de navegação (anterior/próximo) e indicadores (pontinhos) ficam visíveis.

**Dois formatos de slide**:

- **`tipo: 'card'`** (default): bloco superior de ~120px (foto de fundo se `foto` existir, senão `cor` sólida com o ícone centralizado em branco) com um pequeno rótulo "Publicidade" no canto — pequeno, não chamativo. Abaixo: nome, descrição (2 linhas), linha de destaque, e **um único botão de CTA**, com fundo na cor do anunciante e cor do texto escolhida automaticamente para contraste (preto ou branco, conforme a luminância da cor — função `corTextoContraste`). Para anunciante real: `ctaLabel`/`ctaHref` é "Visitar site" (se houver `site`) ou "Chamar no WhatsApp" (fallback via `wa.me`); para "vaga disponível": "Quero anunciar" → WhatsApp.
- **`tipo: 'imagem'`**: renderiza `imagemUrl` dentro de um único link, preenchendo toda a largura e altura do bloco (`object-fit: cover` + `object-position: center` — corta levemente as bordas se a proporção da imagem não for exatamente a do bloco, em vez de deixar espaço em branco como fazia o `contain` anterior), sem nenhum texto, cor, foto ou botão adicional — a arte do anunciante já é a identidade visual. O link vai para `site`, ou para o WhatsApp (`wa.me`) se não houver `site`. Não tem o rótulo "Publicidade" (mantido como já vinha, sem alteração nessa parte).

**Botão único de CTA (mudança de comportamento)**: antes cada slide `card` tinha dois botões (WhatsApp + Site/E-mail). Agora é um só. Consequência: o botão de E-mail do estado "vaga disponível" foi removido, e junto com ele o evento `abrir_email` (seção 9) deixou de ter qualquer disparo no código — só `abrir_whatsapp` continua ativo, disparado pelo CTA único do estado "vaga disponível" (cliques em anunciantes reais não emitem esse evento).

**Altura estável entre slides**: todo slide (incluindo o de "vaga disponível" e o `tipo: 'imagem'`) fica dentro do mesmo wrapper `.slide-body`, com **altura fixa em CSS (`height: 260px`)** — o mesmo valor para os dois formatos, então trocar de slide no rodízio não muda a altura do bloco. Dentro do formato `card`, a linha de destaque **sempre existe no DOM**, mesmo vazia; quando não há destaque, fica com `visibility: hidden` (nunca removida via `v-if`), e a descrição é limitada a 2 linhas via `-webkit-line-clamp` com altura fixa (`height: 2.8em`). Nada disso usa JavaScript para medir ou calcular alturas — é só CSS. O valor `260px` foi medido empiricamente (conteúdo real do formato `card`, sem altura fixa, em um navegador) e não deve ser alterado sem novo teste visual.

**Card**: usa as mesmas classes dos componentes irmãos (`card border-1 mb-3` + `card-body`, aqui com `p-0 pb-3` para o carrossel ocupar a largura inteira até a borda), sem largura máxima customizada — igual a `TextInput`/`AvailableNumbers`/etc.

**Navegação via Bootstrap Carousel**: a marcação usa `.carousel`/`.carousel-inner`/`.carousel-item`/`.carousel-indicators`/`.carousel-control-prev`/`.carousel-control-next` padrão do Bootstrap 5, com `id="ad-carousel"`. Os indicadores foram restilizados via CSS para serem pontinhos redondos pequenos (não a barra retangular padrão do Bootstrap) posicionados **abaixo** do carrossel (`position: static`, não sobrepostos); as setas ficam restritas à altura do bloco de foto (120px), para não cobrir o botão de CTA. Arrastar o dedo em telas de toque é suportado nativamente pelo Bootstrap (`touch: true`, sem lógica de touch manual).

A instância JS (`new Carousel(el, { interval: 7000, ride: 'carousel', pause: 'hover', touch: true, wrap: true })`) é criada/destruída via um `watch(() => props.visible, ...)` em vez de `onMounted`/`onUnmounted` simples — necessário porque o `v-if="visible"` fica **dentro** do próprio template do `AdBanner` (mesmo padrão de `AvailableNumbers`/`UnpaidNumbers`/`DrawHistory`, seção 24), então o componente Vue monta uma vez só (na carga da página) e o elemento do carrossel só existe no DOM quando `visible` fica `true` depois. Usar `onMounted` puro tentaria instanciar o Carousel antes de o elemento existir (bug real encontrado e corrigido durante esta revisão: a rotação automática simplesmente não iniciava). Isso também corrige a documentação: o embaralhamento da lista de anunciantes (Fisher-Yates) acontece no `setup()` do componente — ou seja, **uma vez por carregamento de página**, não a cada vez que `visible` fica `true` (a instância do componente não é recriada quando `numerosDisponiveis` some e volta).

`import 'bootstrap'` em `main.js` e `import { Carousel } from 'bootstrap'` em `AdBanner.vue` usam a mesma build ESM do Bootstrap (ver seção 6) — importante manter assim para não duplicar o bundle.

**Condição de visibilidade**: o `AdBanner` — seja mostrando um anunciante real, seja mostrando o card de "vaga disponível" — só aparece quando `numerosDisponiveis.length > 0` **e** (`config.exibirAd` é `true` **ou** está em modo demo — ver abaixo). `App.vue` passa `:visible="numerosDisponiveis.length > 0 && (modoDemo || config.exibirAd)"` para o componente, que envolve o card inteiro em `v-if="visible"`. Ou seja: mesmo com anunciantes cadastrados e ativos, o bloco só aparece depois de uma busca de "disponíveis" bem-sucedida, e nunca aparece se `config.exibirAd` for `false` **e** não estiver em `/publicidade` (caso atual da rota normal `/`).

## Rota de demonstração `/publicidade`

Existe uma rota estática para demonstrar o `AdBanner` a clientes em potencial, mostrando como o anúncio deles apareceria dentro do fluxo real da ferramenta.

**Não há roteador** (nem Vue Router nem outra biblioteca, seção 61) — a detecção é um computed simples em `useRifaLogic.js`:

```js
const modoDemo = computed(() => window.location.pathname === '/publicidade')
```

Exposto pelo composable e usado em `App.vue` (passado como prop `modoDemo` para o `AdBanner`).

**Comportamento quando `modoDemo` é verdadeiro** (ou seja, em `/publicidade`):

- `AdBanner.vue` usa `anunciantesExemplo` (`src/data/anunciantes.exemplo.js`) no lugar de `anunciantes` — os 4 anúncios ilustrativos, não os reais.
- `config.exibirAd` é ignorado (o bloco pode aparecer mesmo com `exibirAd: false`, caso atual).
- A exigência de `numerosDisponiveis.length > 0` **continua valendo** — o anúncio de exemplo só aparece depois de uma busca de "disponíveis" bem-sucedida, igual ao comportamento real. `/publicidade` sozinho, sem buscar, não mostra nada.

**Fora de `/publicidade`** (ou seja, na rota normal `/`), tudo continua exatamente como descrito acima — `anunciantes.js` (hoje vazio) e `config.exibirAd` (hoje `false`) valendo normalmente.

Como não há roteador, abrir `/publicidade` diretamente pela URL (sem navegar pelo app) depende do rewrite de SPA no `vercel.json` (seção 40) para não dar 404 em produção — em dev, o Vite já serve `index.html` para qualquer caminho por padrão.

---

# 17. Funcionamento da busca

Existem **duas buscas**, ambas operando sobre `texto.value.split(/\r?\n/)`, dentro de `useRifaLogic.js`.

## Buscar disponíveis (`executar`)

Regex:

```js
const REGEX_NUMERO_VAZIO = /^\s*(\d{1,3})\s*-?\s*$/
```

- aceita de 1 a 3 dígitos;
- aceita espaços antes do número, entre o número e o hífen (se houver), e depois do hífen;
- **o hífen é opcional**: tanto `16-` quanto `16` sozinho na linha (sem hífen e sem nome) contam como número disponível;
- exige que a linha contenha somente esse padrão (nada depois do hífen, quando presente, e nenhum outro caractere além do número/hífen/espaços).

Resultado vai para `numerosDisponiveis` (array de `Number`). Depois: `limparResultados()`, `tipoUltimaBusca = 'disponivel'`, scroll suave até o card de disponíveis, evento `buscar_numeros`, toast.

## Buscar não pagos (`executarNaoPagos`)

Regex:

```js
const REGEX_NUMERO_COM_NOME = /^\s*(\d{1,3})\s*-\s*(.*)$/
const ICONE_PAGO = ['💰', '💸']
```

Para cada linha:

- se não houver texto depois do hífen → ignora (é um número disponível, não "não pago");
- se o texto depois do hífen contiver `💰` ou `💸` → ignora (já foi pago);
- caso contrário, normaliza espaços do nome (`replace(/\s+/g, ' ').trim()`) e agrupa o número sob esse nome em `numerosNaoPagosAgrupados` (`{ [nomeComprador]: [numeros...] }`).

Depois: `limparResultados()`, `tipoUltimaBusca = 'nao_pago'`, scroll, evento `buscar_nao_pagos`, toast.

Ambas as buscas chamam `limparResultados()` primeiro, que zera `numerosDisponiveis`, `numerosNaoPagosAgrupados`, `tipoUltimaBusca` e `historico` — ou seja, **trocar de tipo de busca também limpa o histórico de sorteios da sessão**. Não é bug: é o comportamento atual, preservar salvo solicitação.

---

# 18. Sorteio

A função `gerarAleatorios()` (em `useRifaLogic.js`):

1. sai cedo se `erroValidacao.value` estiver preenchido;
2. cria uma cópia de `numerosDisponiveis.value`;
3. escolhe números aleatoriamente, removendo cada escolhido da cópia;
4. ordena o grupo;
5. cria data/hora;
6. adiciona o grupo ao início do histórico;
7. destaca visualmente o último grupo;
8. faz scroll para o histórico;
9. registra evento `sortear_numeros` no Analytics;
10. mostra toast.

```js
const copia = [...numerosDisponiveis.value]
const resultado = []

for (let i = 0; i < quantidadeGerar.value && copia.length; i++) {
    const index = Math.floor(Math.random() * copia.length)
    resultado.push(copia.splice(index, 1)[0])
}

const grupo = resultado.sort((a, b) => a - b)
```

## Regra de negócio confirmada

`copia` é recriada a partir de `numerosDisponiveis.value` a cada novo sorteio, e `numerosDisponiveis` **não é atualizado** depois de um sorteio. Portanto, um número já sorteado **pode aparecer novamente** em um sorteio posterior dentro da mesma sessão. **Esse comportamento é intencional.**

**Por quê?** O sorteio é uma sugestão aleatória para o usuário — uma forma de ajudar a escolher quais números apresentar/oferecer aos compradores, tipicamente via grupo de WhatsApp ou presencialmente. A transação real (compra, reserva, pagamento) acontece fora da aplicação. A única fonte de verdade sobre qual número foi vendido e pago é o texto colado pelo usuário, atualizado manualmente com os símbolos 💰/💸. Logo, um número só deixa de estar "disponível" quando o usuário o marca como vendido/pago no texto — não quando aparece num sorteio.

---

# 19. Validação da quantidade

```js
const erroValidacao = computed(() => {
    if (quantidadeGerar.value < 1) return 'A quantidade mínima é 1.'
    if (quantidadeGerar.value > numerosDisponiveis.value.length) return 'A quantidade excede os números disponíveis.'
    return ''
})
```

O botão Sortear (dentro de `AvailableNumbers.vue`) fica desabilitado quando existe erro. `erroValidacao` só faz sentido para o fluxo de disponíveis/sorteio — não se aplica ao card de não pagos.

---

# 20. Incrementar quantidade

```js
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
```

Não duplicar a chamada do Analytics.

---

# 21. Decrementar quantidade

```js
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
```

---

# 22. Histórico

Cada sorteio gera:

```js
{
    chave,
    grupo,
    dataHora
}
```

A chave atual:

```js
const chave = `${grupo.join(',')}-${Date.now()}`
```

O histórico é inserido no início:

```js
historico.value.unshift({ chave, grupo, dataHora })
```

Portanto o sorteio mais recente aparece primeiro. Lembrar que trocar de tipo de busca (disponíveis ↔ não pagos) também zera o histórico (seção 17).

---

# 23. Data e hora

```js
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
```

Isso produz uma representação localizada para o usuário brasileiro.

---

# 24. Animações

A interface utiliza Vue Transition, agora encapsulado dentro de cada componente de apresentação (`AvailableNumbers.vue`, `UnpaidNumbers.vue`, `DrawHistory.vue`, `AdBanner.vue`), não mais direto em `App.vue`:

```vue
<transition name="slide-fade">
    ...
</transition>
```

O objetivo é que:

- os cards apareçam suavemente;
- o novo conteúdo fique visualmente destacado;
- a página faça scroll suave quando necessário.

Não remover esse comportamento sem solicitação.

---

# 25. Scroll automático

A lógica de scroll vive em `useRifaLogic.js`, e é mais defensiva do que uma versão anterior simples, porque `disponiveisRef`/`historicoRef` agora apontam para **componentes Vue** (via `ref`), não diretamente para elementos DOM:

```js
function rolarParaResultados() {
    nextTick(() => rolarPara(disponiveisRef))
}

function rolarParaHistorico() {
    nextTick(() => rolarPara(historicoRef))
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
```

`AvailableNumbers` e `UnpaidNumbers` compartilham o mesmo `disponiveisRef` (só um dos dois é renderizado por vez, conforme `tipoUltimaBusca`). Preservar esse comportamento.

---

# 26. Destaque do último sorteio

No `DrawHistory.vue`:

```vue
:class="{ destaque: item.chave === highlightedKey }"
```

`highlightedKey` é passado de `App.vue` a partir de `ultimoGrupoAnimado` (estado do composable). Existe uma classe CSS/animação (`@keyframes desliza-destaque`) relacionada ao destaque. Não remover sem necessidade.

---

# 27. Toast

Estado no composable:

```js
const toast = ref('')

function mostrarToast(msg) {
    toast.value = msg
    setTimeout(() => (toast.value = ''), TOAST_DURATION) // 2500ms
}
```

Renderizado pelo componente `Toast.vue`. Usado para mensagens como:

- Texto colado / erro ao acessar clipboard.
- Resultado de busca (quantidade encontrada, disponíveis ou não pagos).
- Números copiados / erro ao copiar.
- "Abrindo WhatsApp..." ao compartilhar.
- Quantidade alterada.
- Sorteio realizado.
- Limpeza executada.
- "Nenhum número não pago para copiar/compartilhar."

---

# 28. Clipboard

Colar:

```js
texto.value = await navigator.clipboard.readText()
```

Copiar:

```js
navigator.clipboard.writeText(mensagem)
```

Como a aplicação será hospedada em HTTPS, a Clipboard API deverá funcionar nos navegadores modernos.

O botão Colar pode falhar por permissões do navegador e isso já é tratado com toast (`catch` + `console.error`).

---

# 29. Copiar e compartilhar números

## Copiar (`copiarNumeros`)

Diferencia números disponíveis de números sorteados **pela identidade do array** (`numeros === numerosDisponiveis.value`), não por um parâmetro explícito de tipo:

- Disponíveis: `Ainda existem X números disponíveis, são eles: 1, 2, 3.`
- Sorteados: `Números escolhidos: 1, 2, 3` (mudou de "Ainda existem X números disponíveis..." vs texto simples para sorteados — o texto de sorteados não usa mais "..., são eles:").

## Copiar não pagos (`copiarTodosNaoPagos`)

Formato:

```text
Números que ainda faltam pagar: Nome: 3 números (1, 5, 9) Total: X números de Y comprador(es)
```

(Uma linha por comprador, números ordenados.)

## Compartilhar via WhatsApp (`compartilharNumeros`, `compartilharTodosNaoPagos`, via `enviarPorWhatsapp`)

Funcionalidade nova (commit "Add opção de compartilhar por whatsapp"), não existente em versões anteriores documentadas aqui:

```js
async function enviarPorWhatsapp(mensagem) {
    const encoded = encodeURIComponent(mensagem)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isMobile && navigator.share) {
        try {
            await navigator.share({ text: mensagem })
            return true
        } catch (err) {
            console.warn('Web Share API falhou:', err)
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
```

Estratégia: no mobile, tenta primeiro a Web Share API nativa (permite escolher qualquer app, não só WhatsApp); se falhar ou não existir, cai para o deep link `whatsapp://send` (mobile) ou `https://api.whatsapp.com/send` (desktop/web). Usa a mesma mensagem de texto que `copiarNumeros`/`copiarTodosNaoPagos` gerariam.

Não alterar esse comportamento sem solicitação — é resultado de uma correção recente, não implementação provisória.

---

# 30. Layout

A aplicação utiliza Bootstrap 5.

Principais classes utilizadas:

- `container`
- `card`, `card-header`, `card-body`, `card-footer`
- `row`
- `col-12`
- `col-md-*`
- `btn`, `btn-sm`
- `badge`
- `d-flex`
- `d-grid`
- `gap-*`
- `text-*`
- `mt-*`, `mb-*`
- `py-*`, `px-*`

Não substituir Bootstrap por outro framework CSS.

---

# 31. Tema visual

A aplicação atualmente possui visual relacionado a:

- sorteio;
- rifas;
- números;
- simplicidade;
- uso fácil;
- aparência de ferramenta;
- funcionamento especialmente bom em celular.

Evitar:

- excesso de gradientes;
- excesso de efeitos;
- aparência genérica de template;
- interfaces "AI generated";
- excesso de animações;
- componentes desnecessariamente sofisticados.

---

# 32. Logo / favicon

Existem imagens públicas em `public/`: `apple-touch-icon.png`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `bg.jpg`.

`favicon.ico` é multi-resolução (16x16 e 32x32), gerado a partir dos PNGs existentes (`favicon-16x16.png`/`favicon-32x32.png`). `index.html` já referenciava `/favicon.ico?v=2`, mas o arquivo não existia em `public/` — foi adicionado para satisfazer essa referência.

O logo é usado hoje dentro de `AppHeader.vue`:

```vue
<img src="/apple-touch-icon.png" alt="Logo" />
```

(o tamanho é controlado via CSS scoped do componente, não mais inline `style` no template.)

Não substituir o logo existente sem solicitação.

---

# 33. Título da página

`index.html` define `<title>Sorteador de Rifas</title>` como título estático. A tag `<html>` usa `lang="pt-BR"` e há uma `<meta name="description">` objetiva sobre a ferramenta. Não há atribuição a `document.title` em runtime no código-fonte atual — o título vem inteiramente do `index.html`.

---

# 34. Footer

Footer atual (`AppFooter.vue`): texto "Desenvolvido por" seguido da logo da Softhing (`public/softhing-fundo-escuro.svg`, versão para fundo escuro — o nome "Softhing" já está desenhado na logo, por isso não há texto duplicado do nome da marca).

A logo linka para `https://www.softhing.com.br/?utm_source=sortrifas&utm_medium=referral&utm_campaign=case_sortrifas` (com parâmetros UTM para rastreamento de referral), com `target="_blank"` e `rel="noopener"`.

**Mudou** em relação a versões anteriores ("Developed by TGhelere" com link para o LinkedIn pessoal do desenvolvedor) — a atribuição pessoal foi substituída pela marca Softhing. Não reverter para a atribuição pessoal sem solicitação.

Existe também `public/softhing-fundo-claro.svg` (versão da logo para fundo claro, com o texto em azul-marinho escuro `#1D1B51` em vez de branco), não utilizada atualmente — mantida em `public/` para uso futuro em contexto de fundo claro.

---

# 35. PWA

Status atual: **parcialmente iniciado**, não configurado por completo.

O que já existe:

- `index.html` já referencia `<link rel="manifest" href="/site.webmanifest">` e os ícones (`apple-touch-icon`, favicons).
- `public/site.webmanifest` existe, com os ícones 192x192 e 512x512 apontados, `display: "standalone"`, `theme_color`/`background_color` em `#ffffff`.
- ✅ `name` e `short_name` no manifest preenchidos com "Sorteador de Rifas" e "Rifas" respectivamente.

O que ainda falta (não implementado):

- Service worker.
- Estratégia de cache / funcionamento offline.
- Plugin de build (ex.: `vite-plugin-pwa`) — não está no `package.json` atual.

Ao continuar o PWA, avaliar `vite-plugin-pwa` como já era a intenção original, mas primeiro preencher `name`/`short_name` do manifest (mudança pequena, sem dependências novas) antes de partir para service worker.

Não adicionar PWA "de mentirinha" (manifest sem service worker funcional sendo anunciado como PWA completo) sem deixar claro para o usuário o que está e o que não está pronto.

---

# 36. Ícones PWA

Já existem em `public/`:

- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `apple-touch-icon.png`
- `favicon-16x16.png` / `favicon-32x32.png`
- `site.webmanifest` (referenciando os dois primeiros)

Usar os assets reais do projeto e não gerar ícones aleatórios sem solicitação.

---

# 37. Hospedagem

A aplicação é essencialmente um site estático.

Não é necessário:

- VPS;
- Docker;
- Nginx;
- Apache;
- banco;
- backend;
- servidor dedicado.

A preferência é por uma plataforma:

- confiável;
- conhecida;
- estável;
- barata ou gratuita;
- simples;
- com HTTPS;
- com deploy automático via Git;
- adequada para Vite;
- com CDN.

Como a aplicação depende de variáveis de ambiente (`WHATSAPP_NUMBER`, `EMAIL_ADDRESS`, seção 16), a plataforma escolhida precisa suportar configurar env vars de build.

---

# 38. Plataformas consideradas

Opções consideradas:

- Vercel;
- Cloudflare Pages;
- Netlify;
- GitHub Pages.

Vercel é uma das principais opções consideradas pela simplicidade.

AWS não é a primeira opção para este projeto porque seria complexidade desnecessária.

DigitalOcean também não é necessária para uma aplicação estática tão simples.

Não criar infraestrutura AWS para este projeto sem solicitação explícita.

---

# 39. Deploy

Fluxo desejado:

```text
Git
 ↓
push
 ↓
plataforma de hospedagem
 ↓
build
 ↓
deploy automático
```

A aplicação deve utilizar:

```bash
npm run build
```

para gerar a versão de produção.

Antes de considerar uma alteração concluída:

```bash
npm run build
```

deve funcionar sem erros.

---

# 40. Vercel

Vercel é a plataforma escolhida para hospedagem.

Razões:

- integração com GitHub;
- deploy automático;
- HTTPS;
- CDN;
- boa integração com Vite;
- simplicidade operacional.

Antes de tomar decisões sobre planos, preços ou limites, verificar a documentação/preços atuais.

## Configuração no projeto

Existe um `vercel.json` mínimo na raiz do projeto:

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

A Vercel já detecta projetos Vite automaticamente (inclusive `outputDirectory: "dist"`, que é o padrão do Vite), mas o arquivo deixa a configuração explícita e documentada em vez de depender só da detecção automática.

O `rewrites` é o fallback padrão de SPA: qualquer caminho que não corresponda a um arquivo estático cai em `/index.html`. Ainda não há Vue Router (seção 61) nem rotas de verdade — mas existe a rota estática `/publicidade` (seção 16, checada via `window.location.pathname`, não por um roteador), e sem esse rewrite, abrir `sortrifas.com.br/publicidade` direto no navegador (sem navegar pelo app) resultaria em 404 na Vercel.

## O que falta configurar no painel da Vercel (fora do código)

Estes passos são feitos pelo usuário diretamente no painel da Vercel, não pelo código do projeto:

1. **Conectar o repositório**: importar o repositório Git do projeto em vercel.com/new.
2. **Variáveis de ambiente de produção** (Project Settings → Environment Variables), necessárias por causa da seção 16:
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_EMAIL_ADDRESS`
3. **Domínio próprio**: em Project Settings → Domains, adicionar `sortrifas.com.br` e apontar o DNS conforme instruído pela Vercel (registro A ou CNAME, dependendo se é domínio raiz ou subdomínio).
4. Confirmar que o build (`npm run build`) roda sem erros no ambiente da Vercel (mesmo comando já validado localmente).

Nenhum desses passos é feito via `vercel.json` ou outro arquivo do repositório — são configurações do painel, específicas da conta/projeto na Vercel.

---

# 41. Desenvolvimento

Servidor local:

```bash
npm run dev
```

Vite normalmente disponibiliza:

```text
http://localhost:5173/
```

---

# 42. Build e lint

Sempre testar:

```bash
npm run build
```

Antes de considerar uma alteração concluída.

Se possível também executar:

```bash
npm run dev
```

e testar a funcionalidade manualmente.

Também existe:

```bash
npm run lint
```

(`eslint . --fix`) — rodar quando fizer sentido para a alteração.

---

# 43. Problema histórico com vue-gtag-next

Foi instalado anteriormente `vue-gtag-next`, pensando em usá-lo para Google Analytics. O nome `next` não significa que o projeto precise utilizar Next.js.

A integração causou tela branca no projeto. Por isso foi decidido abandonar essa abordagem e utilizar `gtag.js` manual (seção 8).

Não reintroduzir o pacote sem necessidade.

---

# 44. Problema histórico com tela branca

O problema mais importante conhecido historicamente é:

A aplicação podia ficar completamente branca sem apresentar erro evidente no terminal ou console, relacionado ao módulo de Analytics (ver seção 6).

A implementação atual em `src/plugins/gtag.js` já foi escrita com `try/catch` envolvendo toda a lógica de inicialização, justamente por causa desse histórico. Se o problema reaparecer, ao diagnosticar:

1. verificar importações;
2. verificar sintaxe;
3. verificar build;
4. verificar o módulo;
5. verificar se o arquivo realmente existe;
6. verificar encoding;
7. verificar conteúdo gerado pelo Vite;
8. testar um `gtag.js` mínimo;
9. usar Network;
10. verificar scripts bloqueados.

---

# 45. Regra fundamental do Analytics

Analytics nunca deve quebrar a aplicação.

Se o Google Analytics falhar, a aplicação deve continuar funcionando normalmente.

Nunca colocar uma chamada de Analytics de forma que uma exceção impeça:

- sorteio;
- busca (disponíveis ou não pagos);
- copiar;
- colar;
- compartilhar;
- limpar;
- carregamento do Vue.

O Analytics é secundário.

---

# 46. Dados que NÃO devem ser enviados para Analytics

Não enviar para Google Analytics:

- texto completo colado pelo usuário;
- lista completa de números;
- dados pessoais (nomes de compradores!);
- conteúdo da área de transferência;
- e-mail do usuário;
- telefone do usuário.

É aceitável enviar métricas agregadas como:

- quantidade de números encontrados;
- quantidade sorteada;
- quantidade copiada/compartilhada;
- quantidade de compradores (contagem, não nomes).

Desde que não permitam identificar o usuário ou conteúdo privado.

O evento `sortear_numeros` (seção 11) já segue esta regra: envia apenas `quantidade_sorteada`, sem os números individuais sorteados.

---

# 47. LGPD / privacidade

Como o projeto pode ser público e brasileiro, a implementação do Analytics deve considerar privacidade e LGPD.

O `gtag.js` atual já envia `anonymize_ip: true` na config (seção 8).

Além disso, o fluxo de "não pagos" agora processa **nomes de compradores** digitados livremente pelo usuário (não apenas números). Esses nomes ficam só no estado da aplicação (`numerosNaoPagosAgrupados`) e são usados em textos copiados/compartilhados — não são enviados ao Analytics (ver seção 46) e não são persistidos (seção 52).

Antes de produção, avaliar:

- política de privacidade;
- uso de cookies/identificadores;
- consentimento quando aplicável;
- configuração de retenção do GA4;
- minimização de dados;
- não envio de conteúdo privado (incluindo nomes de compradores).

Não implementar um sistema complexo de consentimento sem necessidade, mas não ignorar o assunto quando o Analytics entrar em produção.

---

# 48. SEO

Status atual:

- ✅ title (seção 33);
- ✅ meta description;
- ✅ canonical (`https://sortrifas.com.br/`);
- ✅ Open Graph (`og:title`, `og:description`, `og:type=website`, `og:url`, `og:image`) — `og:image` usa `public/bg.jpg` como imagem temporária (863 KB, 4272x2848px). Não é uma imagem dedicada de 1200x630 otimizada para preview social; substituir quando houver uma imagem própria para esse fim.
- ✅ favicon (já existia);
- ✅ manifest (seção 35, já resolvido);
- ✅ robots.txt (`public/robots.txt`, libera tudo e aponta para o sitemap);
- ✅ sitemap.xml (`public/sitemap.xml`, única URL — SPA de página única);
- JSON-LD: ainda não implementado, avaliar se fizer sentido.

Domínio de produção: `https://sortrifas.com.br`.

Não implementar tudo de uma vez sem solicitação.

---

# 49. Responsividade

A aplicação deve priorizar celular.

Testar especialmente:

- Android Chrome;
- iPhone Safari;
- telas estreitas;
- teclado virtual;
- orientação portrait;
- orientação landscape.

Os botões devem ser fáceis de tocar.

Evitar elementos pequenos demais.

O compartilhamento via WhatsApp (seção 29) usa `navigator.share` no mobile — testar especialmente em Android/iOS, já que o comportamento (abre o seletor nativo de apps) é diferente do fallback de desktop (abre `web.whatsapp.com`/`api.whatsapp.com`).

---

# 50. PWA e instalação

Quando o PWA for finalizado (seção 35), testar:

## Android

- adicionar à tela inicial;
- abrir standalone;
- ícone correto;
- splash/loading;
- atualização da aplicação;
- funcionamento offline.

## Desktop

- instalação pelo Chrome/Edge;
- janela standalone;
- ícone.

---

# 51. Comportamento offline

A lógica principal (busca e sorteio) pode funcionar offline, uma vez que roda inteiramente no client.

Entretanto:

- Google Analytics não funcionará normalmente sem internet;
- links WhatsApp (deep link e Web Share) precisam de internet;
- links de e-mail dependem do sistema;
- assets precisam estar no cache (ainda não há service worker — seção 35);
- primeira instalação naturalmente exige carregamento inicial.

Não bloquear o funcionamento da ferramenta se o Analytics estiver indisponível.

---

# 52. Histórico e persistência

O histórico (`historico`) e os resultados de busca existem apenas no estado da aplicação (em memória, no composable).

Ao atualizar a página, tudo é perdido. Ao fechar a aplicação, tudo é perdido.

Não existe persistência atualmente — nem do histórico de sorteios, nem do texto colado, nem dos números não pagos.

Não adicionar `localStorage` automaticamente.

---

# 53. localStorage

Houve anteriormente um problema relacionado a:

```text
SecurityError: Failed to read the 'localStorage' property from 'Window':
Access is denied for this document.
```

Isso ocorreu em outro momento do desenvolvimento. Isso não significa necessariamente que o projeto utiliza `localStorage` — de fato, o projeto atual não usa `localStorage` (seção 52).

Se esse erro aparecer novamente:

- não assumir que o código do projeto usa localStorage;
- verificar extensões do navegador;
- verificar contexto do documento;
- verificar navegador;
- verificar iframe;
- verificar políticas de privacidade;
- verificar bloqueadores.

Não adicionar localStorage como solução automática.

---

# 54. Ambiente Windows

O projeto é desenvolvido principalmente em Windows 11.

Também foi testado em Linux.

Houve situações em que:

- Linux funcionava;
- Windows apresentava problema.

Por isso, mudanças relacionadas a build/dependências devem ser testadas no Windows quando possível.

---

# 55. Node / npm

Projeto usa npm.

Comandos principais:

```bash
npm install
npm run dev
npm run build
npm run lint
```

Não mudar para yarn/pnpm sem solicitação.

---

# 56. Formatação

`.prettierrc` atual do projeto:

```json
{
    "semi": false,
    "singleQuote": true,
    "tabWidth": 4,
    "printWidth": 200,
    "htmlWhitespaceSensitivity": "ignore"
}
```

Preferir:

```js
const exemplo = 'valor'
```

e não:

```js
const exemplo = "valor";
```

Não adicionar ponto e vírgula.

Há também `eslint.config.js` — rodar `npm run lint` quando fizer sentido (seção 42).

---

# 57. JavaScript

Preferir:

```js
const
let
```

Evitar:

```js
var
```

Preferir código simples e moderno. Evitar abstrações excessivas.

---

# 58. Vue

Projeto usa:

```vue
<script setup>
```

Manter Composition API. Não migrar para Options API.

O padrão adotado (composable central `useRifaLogic` + componentes de apresentação simples, seção 14) já é a arquitetura-alvo atual. Novas funcionalidades de estado/lógica devem, em geral, entrar no composable existente; novos elementos de UI, em componentes novos ou existentes em `src/components/`. Evitar criar um segundo composable "paralelo" sem necessidade clara.

---

# 59. Comentários

Não adicionar comentários explicando código óbvio.

Comentários devem existir somente quando agregarem informação relevante.

Não inserir comentários genéricos de IA.

Evitar:

```js
// Aqui criamos uma variável para armazenar os números
```

---

# 60. Não fazer refatoração não solicitada

Se o usuário pedir:

> adicionar Analytics ao botão Sortear

Não:

- migrar para TypeScript;
- criar mais composables/stores;
- criar Vue Router;
- separar componentes que já não fazem sentido separar mais;
- trocar Bootstrap;
- instalar outra biblioteca;
- mudar estrutura de pastas.

Fazer somente a integração solicitada.

---

# 61. Não criar arquitetura desnecessária

Evitar transformar o projeto em:

```text
Vue
 + Pinia
 + Router
 + dezenas de composables
 + dezenas de componentes
 + camada de services
 + camada de repositories
 + abstrações
```

A componentização atual (`App.vue` + `useRifaLogic` + ~9 componentes de apresentação) já é o nível de estrutura considerado adequado para este projeto. Não é um convite para ir além disso sem necessidade concreta.

---

# 62. Regra para sorteio

O sorteio usa `Math.random()` para selecionar números.

A aplicação não tem requisito de criptografia ou sorteio juridicamente auditável neste momento.

Não trocar por sistema criptográfico sem solicitação.

Se no futuro o projeto for usado para sorteios oficiais/regulados, essa questão deverá ser reavaliada.

---

# 63. Regra para links externos

WhatsApp/Site/E-mail (anúncio, `AdBanner`, seção 16): `target="_blank"` e `rel="noopener"`.

WhatsApp (compartilhar números, seção 29): Web Share API no mobile quando disponível, senão `window.open` para deep link/`api.whatsapp.com`.

E-mail: `mailto:`.

LinkedIn (footer): `target="_blank"`.

Manter comportamento atual.

---

# 64. Git

O código deve ser mantido em Git.

Evitar commit de:

```text
node_modules/
dist/
.env
.env.*
anotacoes.txt
```

quando contiverem dados sensíveis (já cobertos pelo `.gitignore` atual).

O Measurement ID do GA4 não é um segredo.

---

# 65. Processo recomendado para alterações

Ao receber uma solicitação:

1. Entender exatamente o que o usuário quer.
2. Verificar os arquivos envolvidos — lembrando que a lógica normalmente está em `src/composables/useRifaLogic.js`, não em `App.vue`.
3. Fazer a menor alteração necessária.
4. Não modificar comportamento não relacionado.
5. Rodar build (`npm run build`).
6. Se houver erro, corrigir somente o necessário.
7. Informar claramente o que foi alterado.

---

# 66. Quando houver erro

Não sair alterando várias coisas ao mesmo tempo.

Preferir:

```text
reproduzir
→ isolar
→ identificar causa
→ corrigir
→ build
→ testar
```

Se a tela estiver branca:

1. verificar importações;
2. verificar erros de runtime;
3. verificar Network;
4. verificar build;
5. testar remoção da última alteração;
6. isolar o arquivo responsável (frequentemente `src/plugins/gtag.js`, seção 44).

---

# 67. Estrutura visual atual do App.vue

```text
<header>                          → AppHeader.vue (título + logo)

<HelpModal>                       → modal "Como usar" (v-model="mostrarHelp")

main/container
    <TextInput>                   → textarea + Colar / Buscar disponíveis / Não pagos / Limpar
    <AdBanner>                    → carrossel de anunciantes / "vaga disponível" (seção 16),
                                     visível apenas após busca de disponíveis e com config.exibirAd = true
    <AvailableNumbers>            → números disponíveis: quantidade, copiar, compartilhar,
                                     quantidade a sortear, incrementar/decrementar, Sortear
                                     (visível quando tipoUltimaBusca === 'disponivel')
    <UnpaidNumbers>                → números não pagos agrupados por comprador: copiar, compartilhar
                                     (visível quando tipoUltimaBusca === 'nao_pago')
    <DrawHistory>                  → números sorteados, data/hora, copiar, compartilhar
    <Toast>

<footer>                          → AppFooter.vue ("Developed by TGhelere")
```

`AvailableNumbers` e `UnpaidNumbers` são mutuamente exclusivos na tela (seção 15/17). Preservar essa estrutura salvo solicitação explícita.

---

# 68. Objetivo do Analytics

As perguntas que o Analytics deve ajudar a responder são:

## Aquisição

- Quantas pessoas acessam?
- De onde vêm?
- Desktop ou celular?
- País/região em nível apropriado?

## Uso

- Quantas executam uma busca (disponíveis vs. não pagos)?
- Quantas realizam sorteios?
- Quantos sorteios por sessão?
- Quantos números normalmente são sorteados?
- Quantas usam copiar/compartilhar?
- Quantas usam colar?

## Retenção

- Pessoas voltam?
- Com que frequência?
- Quantas sessões por usuário?

## Monetização futura

A área do `AdBanner` é o espaço publicitário da aplicação (seção 16): mostra anunciantes reais cadastrados em `src/data/anunciantes.js` em rodízio, ou um estado de "vaga disponível" enquanto esse array estiver vazio (caso atual) — mas só depois de uma busca de disponíveis, e só com `config.exibirAd = true` (hoje `false`).

Eventos `abrir_whatsapp` e `abrir_email` servem para medir interesse comercial — disparados a partir dos cliques no estado "vaga disponível".

---

# 69. Não exagerar no Analytics

Não registrar cada pequena mudança da interface.

Não é necessário registrar:

- cada tecla digitada;
- cada scroll;
- cada mudança de foco;
- cada caractere colado;
- cada renderização;
- cada abertura de componente.

O objetivo é medir ações significativas.

---

# 70. Prioridade de funcionalidades

Prioridade atual:

1. Aplicação funcionar corretamente.
2. Sorteio funcionar corretamente.
3. Interface responsiva.
4. PWA (parcialmente iniciado — seção 35).
5. Analytics (implementado, com pontos a revisar — seções 11 e 46).
6. Deploy estável.
7. SEO.
8. Melhorias visuais.
9. Monetização por anúncios (`AdBanner` já existe, seção 16 — hoje oculto por `config.exibirAd = false`; falta também cadastrar anunciantes reais em `src/data/anunciantes.js`).

Essa ordem é orientativa, não deve impedir mudanças solicitadas pelo usuário.

---

# 71. Próximos passos possíveis

Caso solicitado, uma sequência possível é:

### Etapa 1

Confirmar/ajustar os pontos de divergência já identificados: título da página (seção 33), envio de números individuais ao GA4 (seções 11/46), prefixo `VITE_` das env vars (seção 16).

### Etapa 2

Validar eventos no GA4 em tempo real.

### Etapa 3

Preencher `name`/`short_name` do `site.webmanifest` e configurar service worker (PWA, seção 35).

### Etapa 4

Testar instalação no Android/desktop.

### Etapa 5

Configurar hospedagem (com env vars).

### Etapa 6

Configurar deploy automático.

### Etapa 7

Configurar domínio próprio, se desejado.

### Etapa 8

Configurar SEO.

---

# 72. Filosofia do projeto

Este projeto é deliberadamente simples.

A pergunta principal antes de adicionar tecnologia deve ser:

> Isso realmente é necessário para uma SPA estática pequena?

Se a resposta for não, não adicionar.

A componentização e a extração do composable (seção 14) já aconteceram e são o nível de estrutura aceito hoje — isso não muda a filosofia geral, apenas eleva o "estado atual aceito" de "tudo em App.vue" para "App.vue fino + um composable + componentes de apresentação".

Preferências:

```text
simples > complexo
```

```text
manutenível > arquiteturalmente sofisticado
```

```text
poucas dependências > muitas dependências
```

```text
alteração pequena > refatoração ampla
```

```text
funcionamento confiável > novidade tecnológica
```

---

# 73. Comunicação com o usuário

O usuário prefere:

- português do Brasil;
- respostas objetivas;
- explicações práticas;
- código pronto para copiar;
- indicação do arquivo que deve ser alterado;
- nenhuma alteração não solicitada.

Quando fornecer código:

- respeitar o padrão de formatação existente;
- não adicionar alterações não solicitadas;
- não trocar tecnologias sem necessidade.

---

# 74. Regra final para Claude Code

Antes de modificar qualquer coisa, considerar:

> Esta é uma ferramenta pequena, estática e focada em uma única tarefa, hoje organizada como App.vue fino + composable central (useRifaLogic) + componentes de apresentação.

Não introduza complexidade que não traga benefício direto ao usuário ou à manutenção do projeto.

Quando houver dúvida sobre uma regra de negócio, não inventar a resposta — este arquivo já sinaliza explicitamente os pontos ainda não confirmados (seções 16, 18, 33, 35, 46).

Quando uma alteração puder mudar comportamento existente, explicar a consequência e confirmar quando necessário.

Preservar funcionalidades existentes.

Priorizar estabilidade, simplicidade e manutenção.

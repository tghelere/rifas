export function setupAnalytics(app) {
    // Inicializa o Google Analytics de forma segura sem dependências
    const initGtag = () => {
        try {
            // Cria o dataLayer se não existir
            window.dataLayer = window.dataLayer || []

            // Define a função gtag
            function gtag() {
                window.dataLayer.push(arguments)
            }
            window.gtag = gtag

            // Carrega o script do Google Analytics
            const script = document.createElement('script')
            script.async = true
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z43X80HZFT'
            script.onload = () => {
                gtag('js', new Date())
                gtag('config', 'G-Z43X80HZFT', {
                    'anonymize_ip': true,
                    'page_path': window.location.pathname,
                    'page_title': document.title,
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

    // Inicia o gtag quando o app estiver pronto
    initGtag()

    // Adiciona função global para rastrear eventos
    app.config.globalProperties.$trackEvent = function(eventName, eventData = {}) {
        try {
            if (window.gtag && typeof window.gtag === 'function') {
                window.gtag('event', eventName, eventData)
            }
        } catch (err) {
            console.debug('Analytics indisponível:', err)
        }
    }
}

// Dados ilustrativos para testar visualmente os formatos do AdBanner (não usado em produção).
// Mesma forma de item que `anunciantes.js` — ver comentário lá.

function svgParaDataUri(svg) {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const thumbProdutoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="#198754"/><text x="40" y="45" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">Produto</text></svg>`

const bannerImagemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"><rect width="800" height="200" fill="#4A68F2"/><text x="400" y="112" font-family="Arial, sans-serif" font-size="34" fill="#ffffff" text-anchor="middle">Exemplo de banner do anunciante</text></svg>`

export const anunciantesExemplo = [
    {
        id: 'exemplo-empresa',
        nome: 'Loja Exemplo',
        descricao: 'Produtos e serviços da região, com atendimento local.',
        icone: 'bi-shop',
        imagemMiniatura: '',
        categoria: 'empresa',
        destaque: '',
        tipo: 'card',
        imagemUrl: '',
        whatsapp: '5511999990001',
        site: 'https://www.softhing.com.br',
        ativo: true
    },
    {
        id: 'exemplo-produto',
        nome: 'Kit Exemplo',
        descricao: 'Produto ilustrativo, com miniatura própria no lugar do ícone padrão.',
        icone: 'bi-box-seam',
        imagemMiniatura: svgParaDataUri(thumbProdutoSvg),
        categoria: 'produto',
        destaque: 'Promoção por tempo limitado',
        tipo: 'card',
        imagemUrl: '',
        whatsapp: '5511999990002',
        site: 'https://www.softhing.com.br',
        ativo: true
    },
    {
        id: 'exemplo-servico',
        nome: 'Serviço Exemplo',
        descricao: 'Prestação de serviço ilustrativa para teste visual do carrossel.',
        icone: 'bi-tools',
        imagemMiniatura: '',
        categoria: 'servico',
        destaque: '',
        tipo: 'card',
        imagemUrl: '',
        whatsapp: '5511999990003',
        site: 'https://www.softhing.com.br',
        ativo: true
    },
    {
        id: 'exemplo-imagem',
        nome: 'Banner Exemplo',
        descricao: '',
        icone: '',
        imagemMiniatura: '',
        categoria: '',
        destaque: '',
        tipo: 'imagem',
        imagemUrl: svgParaDataUri(bannerImagemSvg),
        whatsapp: '',
        site: 'https://www.softhing.com.br',
        ativo: true
    }
]

// Dados ilustrativos para testar visualmente os formatos do AdBanner (não usado em produção).
// Mesma forma de item que `anunciantes.js` — ver comentário lá.

function svgParaDataUri(svg) {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const bannerImagemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"><rect width="800" height="200" fill="#4A68F2"/><text x="400" y="112" font-family="Arial, sans-serif" font-size="34" fill="#ffffff" text-anchor="middle">Exemplo de banner do anunciante</text></svg>`

export const anunciantesExemplo = [
    {
        id: 'exemplo-empresa',
        nome: 'Loja Exemplo',
        descricao: 'Produtos e serviços da região, com atendimento local.',
        icone: 'bi-shop',
        cor: '#0F6E56',
        foto: '',
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
        descricao: 'Produto ilustrativo para teste visual do carrossel, com cor de marca própria.',
        icone: 'bi-box-seam',
        cor: '#0D6EFD',
        foto: '',
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
        cor: '#C1440E',
        foto: '',
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
        cor: '',
        foto: '',
        categoria: '',
        destaque: '',
        tipo: 'imagem',
        imagemUrl: svgParaDataUri(bannerImagemSvg),
        whatsapp: '',
        site: 'https://www.softhing.com.br',
        ativo: true
    }
]

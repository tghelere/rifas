// Dados ilustrativos para testar visualmente os formatos do AdBanner (não usado em produção).
// Mesma forma de item que `anunciantes.js` — ver comentário lá.
//
// `foto` e `imagemUrl` apontam para arquivos reais em `public/anunciantes/`
// (exemplo-1.jpg a exemplo-4.jpg), como em dados de produção — nunca URLs externas.

export const anunciantesExemplo = [
    {
        id: 'exemplo-empresa',
        nome: 'Loja Exemplo',
        descricao: 'Produtos e serviços da região, com atendimento local.',
        icone: 'bi-shop',
        cor: '#0F6E56',
        foto: '/anunciantes/exemplo-1.jpg',
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
        foto: '/anunciantes/exemplo-2.jpg',
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
        foto: '/anunciantes/exemplo-3.jpg',
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
        cor: '#0E7C7B',
        foto: '',
        categoria: '',
        destaque: '',
        tipo: 'imagem',
        imagemUrl: '/anunciantes/exemplo-4.jpg',
        titulo: 'Sua próxima pescaria começa aqui',
        subtitulo: 'Roteiros guiados de pesca esportiva',
        whatsapp: '5511999990004',
        site: 'https://www.softhing.com.br',
        ativo: true
    }
]

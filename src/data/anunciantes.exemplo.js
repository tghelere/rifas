// Dados ilustrativos para testar visualmente os formatos do AdBanner (não usado em produção).
// Mesma forma de item que `anunciantes.js` — ver comentário lá (inclui os campos opcionais
// `posicaoX`/`posicaoY`/`zoom` de enquadramento, ajustados abaixo observando cada foto real).
// Todo registro abaixo declara exatamente o mesmo conjunto de chaves, na mesma ordem, mesmo
// quando o valor é o neutro/padrão para aquele tipo (regra documentada em anunciantes.js).
//
// `imagem` aponta para arquivos reais em `public/anunciantes/`, como em dados de produção —
// nunca URLs externas. `whatsapp` usa um número claramente fictício (DDD "00" não existe no
// Brasil) só para demonstrar o botão condicional, nunca um número real e discável.

export const anunciantesExemplo = [
    {
        id: 'exemplo-empresa',
        nome: 'Loja Exemplo',
        descricao: 'Produtos e serviços da região, com atendimento local.',
        cor: '#0F6E56',
        imagem: '/anunciantes/exemplo-6.jpg',
        categoria: 'empresa',
        destaque: '',
        tipo: 'card',
        posicaoX: 0,
        posicaoY: 0,
        zoom: 0,
        whatsapp: '5500000000000',
        site: 'https://www.softhing.com.br?utm_source=sortrifas&utm_medium=demo&utm_campaign=pagina_anunciantes',
        ativo: true
    },
    {
        id: 'exemplo-produto',
        nome: 'Kit Exemplo',
        descricao: 'Produto ilustrativo para teste visual do carrossel, com cor de marca própria.',
        cor: '#994a00',
        imagem: '/anunciantes/exemplo-4.jpg',
        categoria: 'produto',
        destaque: 'Promoção por tempo limitado',
        tipo: 'card',
        posicaoX: -35,
        posicaoY: -50,
        zoom: 0,
        whatsapp: '5500000000000',
        site: '',
        ativo: true
    },
    {
        id: 'exemplo-produto2',
        nome: 'Sua próxima pescaria começa aqui',
        descricao: 'Roteiros guiados de pesca esportiva',
        cor: '#00831c',
        imagem: '/anunciantes/exemplo-1.jpg',
        categoria: 'produto',
        destaque: '',
        tipo: 'imagem',
        posicaoX: 0,
        posicaoY: 50,
        zoom: 0,
        whatsapp: '5500000000000',
        site: '',
        ativo: true
    },
    {
        id: 'exemplo-servico',
        nome: 'Serviço Exemplo',
        descricao: 'Prestação de serviço ilustrativa para teste visual do carrossel.',
        cor: '#C1440E',
        imagem: '/anunciantes/exemplo-7.jpg',
        categoria: 'servico',
        destaque: '',
        tipo: 'card',
        posicaoX: 30,
        posicaoY: 50,
        zoom: 0,
        whatsapp: '',
        site: 'https://www.softhing.com.br?utm_source=sortrifas&utm_medium=demo&utm_campaign=pagina_anunciantes',
        ativo: true
    },
    {
        id: 'exemplo-imagem',
        nome: 'Sua próxima pescaria começa aqui',
        descricao: 'Roteiros guiados de pesca esportiva',
        cor: '#ddbc00',
        imagem: '/anunciantes/exemplo-5.jpg',
        categoria: '',
        destaque: '',
        tipo: 'imagem',
        posicaoX: 0,
        posicaoY: 10,
        zoom: 10,
        whatsapp: '5500000000000',
        site: 'https://www.softhing.com.br?utm_source=sortrifas&utm_medium=demo&utm_campaign=pagina_anunciantes',
        ativo: true
    },
    {
        id: 'exemplo-imagem3',
        nome: 'Sua próxima pescaria começa aqui',
        descricao: 'Roteiros guiados de pesca esportiva',
        cor: '#ddbc00',
        imagem: '/anunciantes/exemplo-4.jpg',
        categoria: '',
        destaque: '',
        tipo: 'imagem',
        posicaoX: 0,
        posicaoY: -50,
        zoom: 0,
        whatsapp: '',
        site: 'https://www.softhing.com.br?utm_source=sortrifas&utm_medium=demo&utm_campaign=pagina_anunciantes',
        ativo: true
    }
]

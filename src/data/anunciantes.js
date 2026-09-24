// cada item de `anunciantes`:
// {
//   id, nome, descricao,
//   icone,     // classe do Bootstrap Icons (ex: 'bi-shop'), usada no bloco superior quando não há foto. Só usada quando tipo === 'card'.
//   cor,       // string hex, cor de marca do anunciante (ex: '#0F6E56') — usada no bloco superior (fallback sem foto) e no botão de CTA. Só usada quando tipo === 'card'.
//   foto,      // opcional; caminho de imagem de fundo do bloco superior. Se ausente, usa `cor` sólida + ícone centralizado em branco. Só usada quando tipo === 'card'.
//   categoria, // opcional; 'empresa' | 'produto' | 'servico' — só organizacional, não afeta renderização
//   destaque,  // opcional (string)
//   tipo,      // 'card' ou 'imagem' (default 'card')
//   imagemUrl, // obrigatório só quando tipo === 'imagem'
//   whatsapp, site, ativo
// }
//
// `foto` e `imagemUrl` devem apontar para caminhos dentro de `public/anunciantes/`
// (ex: '/anunciantes/ocelos-pesca.jpg'), nunca URLs externas.
export const anunciantes = []

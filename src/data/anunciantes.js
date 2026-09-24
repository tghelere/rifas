// cada item de `anunciantes`:
// {
//   id, nome, descricao,
//   icone,     // classe do Bootstrap Icons (ex: 'bi-shop'), usada no bloco superior quando não há foto. Só usada no slide de "vaga disponível" — anunciantes reais sem foto não mostram ícone, só a cor sólida.
//   cor,       // string hex, cor de marca do anunciante (ex: '#0F6E56') — usada no bloco superior (fallback sem foto, e como degradê nas bordas quando há foto) e nos botões de CTA. Usada tanto em tipo === 'card' quanto em tipo === 'imagem' (quando há botões/título/subtítulo sobrepostos).
//   foto,      // opcional; caminho de imagem de fundo do bloco superior (cobre o bloco inteiro, com degradê da `cor` nas bordas). Se ausente, usa `cor` sólida, sem ícone. Só usada quando tipo === 'card'.
//   categoria, // opcional; 'empresa' | 'produto' | 'servico' — só organizacional, não afeta renderização
//   destaque,  // opcional (string)
//   tipo,      // 'card' ou 'imagem' (default 'card')
//   imagemUrl, // obrigatório só quando tipo === 'imagem'; imagem de fundo cobrindo o bloco inteiro
//   titulo,    // opcional; só usado quando tipo === 'imagem' — sobreposto na imagem (com degradê escuro por trás para legibilidade)
//   subtitulo, // opcional; só usado quando tipo === 'imagem' — sobreposto abaixo do título
//   posicaoY,  // opcional (número 0-100, padrão 50); aplica-se a `foto` OU `imagemUrl`. 0 = topo da imagem, 50 = centralizado (padrão), 100 = base. Controla o enquadramento vertical (background-position) e também é o ponto de origem do `zoom` abaixo.
//   zoom,      // opcional (número, padrão 100, mínimo 100); aplica-se a `foto` OU `imagemUrl`. 100 = sem zoom extra (comportamento padrão, só o cover mínimo). Ex: 130 = amplia 30% além do cover, em torno do ponto definido por `posicaoY`.
//   whatsapp, site, ativo
// }
//
// `foto` e `imagemUrl` devem apontar para caminhos dentro de `public/anunciantes/`
// (ex: '/anunciantes/ocelos-pesca.jpg'), nunca URLs externas.
export const anunciantes = []

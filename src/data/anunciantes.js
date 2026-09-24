// cada item de `anunciantes`:
// {
//   id,         // string, identificador único do anunciante
//   nome,       // string. Tipo 'card': sempre exibido. Tipo 'imagem': sobreposto na imagem
//               //   (com degradê escuro por trás) só se `nome`, `descricao` ou algum botão
//               //   (whatsapp/site) estiver preenchido — se nenhum dos três, a imagem vira
//               //   um único link clicável sem nenhum texto/cor sobreposta.
//   descricao,  // string. Mesma regra de exibição do `nome`, em ambos os tipos.
//   cor,        // string hex (ex: '#0F6E56'), cor de marca. Tipo 'card': fundo do bloco
//               //   superior quando não há `imagem` (sólido, sem ícone), ou degradê nas
//               //   bordas esquerda/direita quando há `imagem`. Usada nos dois tipos como
//               //   cor de fundo dos botões de CTA (whatsapp/site).
//   imagem,     // caminho dentro de public/anunciantes/ (ex: '/anunciantes/loja.jpg'),
//               //   nunca URL externa. Tipo 'card': opcional (sem ela, usa `cor` sólida,
//               //   sem ícone). Tipo 'imagem': obrigatória, cobre o bloco inteiro.
//   categoria,  // opcional; 'empresa' | 'produto' | 'servico' — só organizacional, não
//               //   afeta renderização em nenhum tipo.
//   destaque,   // opcional (string). Só lido no tipo 'card' (linha de destaque abaixo da
//               //   descrição). Não tem efeito no tipo 'imagem' — não incluir nesse caso.
//   tipo,       // 'card' ou 'imagem' (default 'card')
//   posicaoX,   // opcional (número, padrão 0). Desloca o enquadramento horizontal de
//               //   `imagem`: 0 = centralizado, negativo = mostra mais a ESQUERDA,
//               //   positivo = mostra mais a DIREITA. Convertido internamente para
//               //   background-position em % via `50 + posicaoX` (limitado a 0-100).
//   posicaoY,   // opcional (número, padrão 0). Mesma lógica de `posicaoX`, no eixo
//               //   vertical: negativo = mostra mais a parte de CIMA da imagem,
//               //   positivo = mostra mais a parte de BAIXO. `50 + posicaoY` (0-100).
//   zoom,       // opcional (número >= 0, padrão 0). 0 = sem zoom adicional (só o
//               //   preenchimento mínimo de cover). Não aceita valores negativos (abaixo
//               //   do cover mínimo deixaria espaço em branco, o que nunca é permitido).
//               //   Escala aplicada = 1 + (zoom / 100), ampliando em torno do ponto
//               //   definido por `posicaoX`/`posicaoY`.
//   whatsapp,   // opcional (string, só dígitos, com DDI). Presente em ambos os tipos →
//               //   mostra o botão "WhatsApp" (link https://wa.me/<whatsapp>).
//   site,       // opcional (string, URL completa). Presente em ambos os tipos → mostra o
//               //   botão "Visitar site".
//   ativo       // boolean. Só anunciantes com ativo === true entram no carrossel.
// }
//
// O campo `icone` NÃO existe nesse array: é usado só internamente pelo AdBanner.vue para o
// slide fixo de "vaga disponível" (quando este array está vazio ou sem nenhum item ativo),
// e não é lido de nenhum registro de anunciante real — não incluir esse campo aqui.
export const anunciantes = []

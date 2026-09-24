// cada item de `anunciantes`: todo registro deve declarar todas as chaves abaixo, na mesma
// ordem, usando valor neutro (`''` para `categoria`/`destaque`, `0` para `posicaoX`/
// `posicaoY`/`zoom`) quando o campo não se aplica ao tipo ou está no padrão — nunca omitir
// uma chave que exista em outro registro.
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
//   categoria,  // 'empresa' | 'produto' | 'servico', ou '' quando não categorizado — só
//               //   organizacional, não afeta renderização em nenhum tipo.
//   destaque,   // string, ou '' quando não aplicável. Só lido no tipo 'card' (linha de
//               //   destaque abaixo da descrição). Sem efeito no tipo 'imagem' — usar ''.
//   tipo,       // 'card' ou 'imagem' (default 'card')
//   posicaoX,   // número, 0 quando no padrão. Desloca o enquadramento horizontal de
//               //   `imagem`: 0 = centralizado, negativo = mostra mais a ESQUERDA,
//               //   positivo = mostra mais a DIREITA. Convertido internamente para
//               //   background-position em % via `50 + posicaoX` (limitado a 0-100).
//   posicaoY,   // número, 0 quando no padrão. Mesma lógica de `posicaoX`, no eixo
//               //   vertical: negativo = mostra mais a parte de CIMA da imagem,
//               //   positivo = mostra mais a parte de BAIXO. `50 + posicaoY` (0-100).
//   zoom,       // número >= 0, 0 quando sem zoom adicional (só o preenchimento mínimo de
//               //   cover). Não aceita valores negativos (abaixo do cover mínimo deixaria
//               //   espaço em branco, o que nunca é permitido). Escala aplicada =
//               //   1 + (zoom / 100), ampliando em torno do ponto definido por
//               //   `posicaoX`/`posicaoY`.
//   whatsapp,   // opcional (string, só dígitos, com DDI, ou '' quando não usado). Presente
//               //   em ambos os tipos → mostra o botão "WhatsApp" (link https://wa.me/<whatsapp>).
//   site,       // opcional (string, URL completa, ou '' quando não usado). Presente em
//               //   ambos os tipos → mostra o botão "Visitar site".
//   ativo       // boolean. Só anunciantes com ativo === true entram no carrossel.
// }
//
// O campo `icone` NÃO existe nesse array: é usado só internamente pelo AdBanner.vue para o
// slide fixo de "vaga disponível" (quando este array está vazio ou sem nenhum item ativo),
// e não é lido de nenhum registro de anunciante real — não incluir esse campo aqui.
export const anunciantes = []

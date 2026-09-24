// cada item de `anunciantes`:
// {
//   id, nome, descricao,
//   icone,             // classe do Bootstrap Icons (ex: 'bi-shop'), usada quando não há imagemMiniatura
//   imagemMiniatura,   // opcional; caminho/URL de imagem pequena que substitui o ícone
//   categoria,         // opcional; 'empresa' | 'produto' | 'servico' — só organizacional, não afeta renderização
//   destaque,          // opcional (string)
//   tipo,              // 'card' ou 'imagem' (default 'card')
//   imagemUrl,         // obrigatório só quando tipo === 'imagem'
//   whatsapp, site, ativo
// }
export const anunciantes = []

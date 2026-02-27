# 🎲 Sorteador de Rifas

Um aplicativo web moderno e elegante para gerenciar, rastrear e sortear números em rifas. Perfeito para organizadores de eventos, loterias e sorteios que desejam automatizar o processo de seleção aleatória.

## ✨ Funcionalidades

### 📋 Gerenciamento de Números
- **Buscar Números Disponíveis**: Identifique rapidamente quais números ainda não foram comprados
- **Rastrear Não Pagos**: Visualize e agrupe todos os números de compradores que ainda não realizaram pagamento
- **Visualização Compacta**: Interface intuitiva que exibe os dados de forma clara e organizada

### 🎯 Sorteio Inteligente
- **Sorteio Aleatório**: Gere sorteios de 1 a N números de forma totalmente aleatória
- **Controle de Quantidade**: Ajuste facilmente a quantidade de números a serem sorteados
- **Histórico Completo**: Mantenha um registro de todos os sorteios realizados com data e hora

### 📱 Experiência do Usuário
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Interface Intuitiva**: Botões claros e bem organizados para máxima produtividade
- **Notificações em Tempo Real**: Receba feedback imediato das suas ações
- **Copiar para Área de Transferência**: Compartilhe dados facilmente com um clique

### 📊 Rastreamento de Dados
- **Google Analytics**: Monitore o uso da aplicação e entenda o comportamento dos usuários
- **Proteção contra Bloqueadores**: Funciona mesmo com adblockers habilitados

### Formato de Entrada Esperado

A aplicação trabalha com um formato de texto específico para processar os dados:

```
1- João Silva 💰
2- Maria Santos 💸
3- Pedro Oliveira
4- 
5- Ana Costa 💰
```

**Símbolos:**
- `💰` ou `💸` = Número **pago**
- Sem símbolo = Número **não pago**
- Linha em branco (apenas número e hífen) = Número **disponível/não vendido**

## ⚙️ Configuração

### Requisitos
- Node.js 16+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd rifa

# Instalar dependências
npm install

# Criar arquivo .env baseado no exemplo
cp .env.example .env
```

### Variáveis de Ambiente

Edite o arquivo `.env` com suas informações.

### Executar em Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`

## 🛠️ Stack Tecnológico

- **Frontend**: Vue 3 com Composition API
- **Build Tool**: Vite
- **Estilos**: SASS/SCSS
- **UI Components**: Bootstrap 5
- **Ícones**: Bootstrap Icons
- **Analytics**: Google Analytics 4

## 📈 Recursos Futuros Propostos

- 🔄 **Exportar para Whatsapp**: ao invés de copiar os textos gerados com os números para colar nos grupos de whatsapp, adicionar a opção de exportar para whatsapp
- 🌙 **Modo Escuro**: Interface otimizada para ambientes com pouca luz
- 🌐 **Suporte a Múltiplos Idiomas**: Adicionar português, inglês e espanhol

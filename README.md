# Frame Agent CLI

Interface de linha de comando para o SDK `@ericnunes/frame_agent` que permite interagir com agentes de IA através do terminal, aproveitando o novo modelo híbrido adaptativo.

## Instalação

Para instalar o CLI globalmente, execute:

```bash
npm install -g @ericnunes/frame-agent-cli
```

## Comandos Disponíveis

### Chat
Inicia uma sessão de conversa com o agente híbrido adaptativo:

```bash
frame-agent chat
```

Envie uma mensagem específica:
```bash
frame-agent chat -m "Como posso otimizar uma função de Fibonacci?"
```

### ReAct
Inicia modo ReAct para tarefas que requerem raciocínio e ação:

```bash
frame-agent react -t "Crie um arquivo chamado hello.txt com o conteúdo 'Hello, world!'"
```

### Planning
Inicia modo de planejamento para tarefas complexas:

```bash
frame-agent plan -t "Como posso estruturar um projeto de API REST com Node.js?"
```

### Outros Comandos
- `frame-agent config`: Gerenciar configurações do CLI
- `frame-agent tools`: Gerenciar ferramentas do agente

## Configuração

Crie um arquivo `.env` na raiz do projeto ou no diretório de trabalho com as seguintes variáveis:

```env
OPENAI_API_KEY=sua_chave_api_aqui
MODEL=gpt-4o-mini  # ou outro modelo suportado
OPENAI_BASE_URL=https://api.openai.com/v1  # opcional, para provedores personalizados
```

## Ferramentas Disponíveis

O modelo híbrido adaptativo utiliza as seguintes ferramentas automaticamente quando necessário:

- **search**: Pesquisa por palavras-chave em toda a base de código
- **file_create**: Criação de novos arquivos com conteúdo especificado
- **file_edit**: Edição de arquivos existentes
- **file_read**: Leitura de conteúdo de arquivos
- **terminal**: Execução de comandos shell seguros
- **final_answer**: Fornecimento de respostas finais ao usuário

## Exemplos de Uso

### Conversa Simples
```bash
frame-agent chat -m "Explique o conceito de programação assíncrona"
```

### Criação de Arquivos
```bash
frame-agent chat -m "Crie um arquivo package.json para um projeto Node.js"
```

### Busca de Informações
```bash
frame-agent chat -m "Procure por arquivos que contenham a palavra 'configuração'"
```

### Tarefas Complexas
```bash
frame-agent plan -t "Como posso estruturar um sistema de autenticação em uma aplicação web?"
```

### Interação Interativa
```bash
frame-agent chat
```
O modelo híbrido detectará automaticamente quando usar ferramentas conforme você interage.

## Parâmetros Comuns

Todos os comandos suportam os seguintes parâmetros:

- `-m, --message <message>`: Enviar uma mensagem específica
- `-p, --provider <provider>`: Configurar provedor específico (padrão: openai-generic)
- `-i, --instructions <instructions>`: Definir instruções do sistema
- `--show-state`: Mostrar estado híbrido atual (chat/react)

## Como Funciona o Modelo Híbrido Adaptativo

O modelo híbrido adaptativo combina:

1. **Análise semântica**: Entende o conteúdo e intenção da mensagem do usuário
2. **Detecção de necessidade de ferramentas**: Identifica quando ações específicas são necessárias
3. **Execução adaptativa**: Alterna entre conversação e execução de ferramentas automaticamente
4. **Raciocínio contínuo**: Mantém contexto entre diferentes modos de operação

Este modelo permite que o agente responda de forma apropriada a qualquer solicitação, automaticamente decidindo quando conversar e quando executar ações estruturadas.

## Recursos

O Frame Agent CLI implementa o novo modelo híbrido adaptativo que combina conversação fluida com execução estruturada de ações:

- **Detecção automática de necessidade de ferramentas**: O modelo identifica inteligentemente quando usar ferramentas com base na análise semântica e intenção da mensagem
- **Transição dinâmica**: Alterna automaticamente entre modo conversacional e modo ReAct conforme necessário
- **Internacionalização completa**: Funciona em qualquer idioma sem dependência de palavras-chave específicas
- **Sistema de ferramentas integrado**: Inclui ferramentas para busca, manipulação de arquivos, execução de comandos, etc.
- **Modo interativo**: Todos os comandos possuem modo REPL para interação contínua

## Contribuição

Para contribuir com o projeto:

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

ou usando yarn:

```bash
yarn global add frame-agent-cli
```

## Instalação

```bash
npm install -g frame-agent-cli
```

## Uso

### Comandos de Chat

```bash
# Iniciar uma sessão de chat
frame-agent chat

# Enviar uma mensagem específica
frame-agent chat --message "Qual é a capital do Brasil?"

# Configurar provider específico
frame-agent chat --provider openai-gpt-4o
```

### Comandos ReAct

```bash
# Iniciar modo ReAct
frame-agent react

# Enviar tarefa para ReAct
frame-agent react --task "Calcule a área de um círculo com raio 5"

# Listar tools disponíveis
frame-agent react --list-tools
```

### Comandos Planning

```bash
# Iniciar modo Planning
frame-agent plan

# Enviar tarefa complexa
frame-agent plan --task "Planeje uma viagem de 7 dias para o Japão"
```

### Comandos de Configuração

```bash
# Ver configuração atual
frame-agent config

# Definir configuração
frame-agent config set --temperature 0.7

# Resetar configuração
frame-agent config reset
```

### Comandos de Tools

```bash
# Registrar uma tool
frame-agent tools register --file ./my-tool.js

# Listar tools registradas
frame-agent tools list

# Remover tool
frame-agent tools unregister --name calculator
```

## Configuração

O CLI pode ser configurado através de:

1. Variáveis de ambiente
2. Arquivo `.env`
3. Arquivo `.frame-agent-config.json`
4. Opções de linha de comando

### Arquivo de Configuração

Você pode criar um arquivo `.frame-agent-config.json` no diretório onde está executando o CLI para definir configurações padrão. Um exemplo de configuração pode ser encontrado em `config/frame-agent-config.example.json`.

Exemplo de `.frame-agent-config.json`:
```json
{
  "name": "Meu Agente",
  "instructions": "Você é um assistente útil.",
  "provider": "openai-gpt-4o-mini",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

### Controle de Logs

Você pode controlar a exibição de logs através da variável de ambiente `ENABLE_LOGGING`:

- `ENABLE_LOGGING=true` (padrão): Mostra todos os logs
- `ENABLE_LOGGING=false`: Desativa todos os logs

Exemplo:
```bash
# Desativar logs
ENABLE_LOGGING=false frame-agent chat

# Ativar logs (padrão)
ENABLE_LOGGING=true frame-agent chat
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Build
npm run build

# Executar em modo desenvolvimento
npm run dev

# Executar em modo desenvolvimento com watch
npm run dev:watch

# Executar CLI
npm start
```

## Testes

Os testes estão localizados na pasta `tests/` e podem ser executados com:

```bash
npm test
```
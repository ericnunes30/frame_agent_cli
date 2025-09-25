# Frame Agent CLI

Interface de linha de comando para o SDK `@ericnunes/frame_agent` que permite interagir com agentes de IA através do terminal.

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
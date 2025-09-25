# Plano para Desenvolvimento do CLI do Frame Agent

## Visão Geral
Desenvolver um CLI (Command Line Interface) para o SDK `@ericnunes/frame_agent` que permita aos usuários interagir com agentes de IA através da linha de comando, aproveitando todos os recursos do SDK incluindo diferentes modos de operação, gerenciamento de tools, memória e contexto.

## Estrutura do Projeto
```
frame_agent_cli/
├── .env                      # Configurações de ambiente
├── package.json              # Configuração do pacote NPM
├── src/                      # Código fonte do CLI
│   ├── index.ts              # Ponto de entrada principal
│   ├── cli.ts                # Configuração da interface CLI
│   ├── commands/             # Comandos do CLI
│   │   ├── chat.ts           # Comandos para modo chat
│   │   ├── react.ts          # Comandos para modo ReAct
│   │   ├── planning.ts       # Comandos para modo planning
│   │   └── index.ts          # Exportador de comandos
│   ├── config/               # Configurações e arquivos de configuração
│   │   ├── config.ts         # Comandos de configuração
│   │   └── tools.ts          # Comandos para gerenciamento de tools
│   ├── tools/                # Tools para agentes de codificação
│   │   ├── search.ts         # Tool de busca em toda a base de código
│   │   ├── file-create.ts    # Tool para criar arquivos
│   │   ├── file-edit.ts      # Tool para editar arquivos
│   │   ├── file-read.ts      # Tool para ler arquivos
│   │   ├── terminal.ts       # Tool para executar comandos no terminal
│   │   └── index.ts          # Exportador de tools
│   ├── utils/                # Utilitários auxiliares
│   │   ├── config-loader.ts  # Carregador de configurações
│   │   └── agent-factory.ts  # Fábrica de agentes
│   └── types/                # Definições de tipos
├── examples/                 # Exemplos de uso
├── docs/                     # Documentação
└── README.md                 # Documentação principal
```

## Separação de Responsabilidades
- **Commands**: Comandos principais do CLI
- **Config**: Configurações e gerenciamento de configuração
- **Tools**: Ferramentas especializadas para agentes de codificação

## Dependências Principais
- `@ericnunes/frame_agent`: SDK principal
- `commander`: Para interface de linha de comando
- `dotenv`: Para carregar variáveis de ambiente
- `inquirer`: Para interações interativas
- `chalk`: Para colorização de output
- `ora`: Para indicadores de progresso

## Comandos Principais

### 1. Comandos de Chat
```bash
# Iniciar uma sessão de chat
frame-agent chat

# Enviar uma mensagem específica
frame-agent chat --message "Qual é a capital do Brasil?"

# Configurar provider específico
frame-agent chat --provider openai-gpt-4o
```

### 2. Comandos ReAct
```bash
# Iniciar modo ReAct
frame-agent react

# Enviar tarefa para ReAct
frame-agent react --task "Calcule a área de um círculo com raio 5"

# Listar tools disponíveis
frame-agent react --list-tools
```

### 3. Comandos Planning
```bash
# Iniciar modo Planning
frame-agent plan

# Enviar tarefa complexa
frame-agent plan --task "Planeje uma viagem de 7 dias para o Japão"
```

### 4. Comandos de Configuração
```bash
# Ver configuração atual
frame-agent config

# Definir configuração
frame-agent config set --temperature 0.7

# Resetar configuração
frame-agent config reset
```

### 5. Comandos de Tools
```bash
# Registrar uma tool
frame-agent tools register --file ./my-tool.js

# Listar tools registradas
frame-agent tools list

# Remover tool
frame-agent tools unregister --name calculator
```

## Funcionalidades Específicas

### 1. Modos de Operação
- Suporte aos três modos do SDK: Chat, ReAct e Planning
- Configuração de modo por comando ou configuração padrão
- Transição entre modos dentro de uma sessão

### 2. Gerenciamento de Configuração
- Carregamento de configurações via `.env`
- Configurações por linha de comando (override)
- Configurações persistentes em arquivo
- Validação de configurações

### 3. Sistema de Tools para Codificação
- **Search**: Pesquisar em toda a base de código
- **File Create**: Criar arquivos
- **File Edit**: Editar arquivos
- **File Read**: Ler arquivos
- **Terminal**: Executar comandos no terminal

### 4. Gerenciamento de Contexto
- Histórico de conversas persistente
- Variáveis de contexto personalizadas
- Limpeza de contexto quando necessário
- Exportação/importação de contexto

### 5. Interface Interativa
- Modo REPL (Read-Eval-Print Loop)
- Indicadores visuais de progresso
- Colorização de output
- Mensagens de erro claras

### 6. Prompt do Sistema
- Arquivo `config/system-prompt.md` para definição persistente
- Comando `frame-agent config set-system-prompt` para atualização via CLI
- Validação de sintaxe e segurança antes da aplicação

## Implementação Detalhada

### 1. Ponto de Entrada (index.ts)
- Carregar variáveis de ambiente
- Configurar interface CLI
- Tratar erros globais
- Inicializar comandos

### 2. Interface CLI (cli.ts)
- Configurar Commander.js
- Definir comandos principais
- Configurar opções globais
- Tratar help e version

### 3. Comandos
- Implementar cada comando como módulo separado
- Validar argumentos e opções
- Criar agentes com configurações apropriadas
- Tratar respostas e erros

### 4. Configuração
- Gerenciar configurações do CLI
- Configurar tools disponíveis
- Gerenciar perfis de configuração

### 5. Tools para Codificação

#### Search Tool
- Pesquisar por palavras-chave em toda a base de código
- Suportar expressões regulares
- Filtrar por tipos de arquivo
- Retornar resultados com contexto

#### File Create Tool
- Criar novos arquivos com conteúdo
- Validar caminhos de arquivo
- Garantir diretórios existentes
- Tratar permissões de arquivo

#### File Edit Tool
- Editar arquivos existentes
- Suportar edição por linhas
- Validar mudanças
- Manter histórico de alterações

#### File Read Tool
- Ler conteúdo de arquivos
- Suportar leitura parcial
- Tratar diferentes codificações
- Retornar metadados do arquivo

#### Terminal Tool
- Executar comandos shell seguros
- Limitar tempo de execução
- Capturar output e erros
- Validar comandos permitidos

### 6. Utilitários
- Carregador de configurações com validação
- Fábrica de agentes com configurações padrão
- Funções auxiliares para formatação de output

### 7. Tipos
- Definir interfaces para configurações
- Tipos para comandos e opções
- Tipos para tools e agentes

## Prompt do Sistema para Agente de Codificação

O agente de codificação CLI deve ser configurado com um prompt do sistema que oriente seu comportamento ao usar as tools de codificação. Este prompt deve incluir:

1. **Diretrizes de Segurança**:
   - Restrições sobre quais comandos podem ser executados
   - Limites de permissões de arquivo
   - Prevenção de acesso a diretórios sensíveis

2. **Protocolos de Codificação**:
   - Padrões de codificação a serem seguidos
   - Estrutura de projetos recomendada
   - Boas práticas de documentação

3. **Fluxo de Trabalho**:
   - Etapas para planejamento de tarefas
   - Verificação de mudanças antes da implementação
   - Testes automatizados após modificações

4. **Integração com Tools**:
   - Como e quando usar cada tool disponível
   - Sequência recomendada de operações
   - Tratamento de erros e fallbacks

## Fluxo de Trabalho
1. Usuário executa comando `frame-agent`
2. CLI carrega configurações do `.env`
3. CLI processa argumentos e opções
4. CLI cria agente com configurações apropriadas
5. CLI executa comando solicitado
6. CLI apresenta resultados ao usuário

## Testes
- Testes unitários para comandos
- Testes de integração com SDK
- Testes de interface CLI
- Testes de configuração

## Documentação
- README.md com instruções de instalação e uso
- Documentação de comandos
- Exemplos práticos
- Guia de contribuição

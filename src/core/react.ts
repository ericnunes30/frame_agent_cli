import { Command } from 'commander';
import { loadConfig, debugLog, log } from '../utils/config-loader';
import { InteractiveAgent } from './interactive-agent';

export const reactCommand = new Command('react')
  .description('Iniciar modo ReAct com o agente híbrido adaptativo')
  .option('-t, --task <task>', 'Enviar tarefa para ReAct')
  .option('-l, --list-tools', 'Listar tools disponíveis')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .option('--show-state', 'Mostrar estado híbrido atual (chat/react)', false)
  .action(async (options) => {
    if (options.listTools) {
      log('Tools disponíveis:');
      log('- search: Pesquisar por palavras-chave em toda a base de código');
      log('- file_create: Criar novos arquivos com conteúdo');
      log('- file_edit: Editar arquivos existentes');
      log('- file_read: Ler conteúdo de arquivos');
      log('- terminal: Executar comandos shell seguros');
      log('- final_answer: Fornece uma resposta final ao usuário e encerra a interação');
      return;
    }
    
    // Criar agente interativo
    const agent = new InteractiveAgent(options.showState);
    
    // Adicionar instruções do sistema, se fornecidas
    const config = await loadConfig();
    const instructions = options.instructions || config.instructions;
    
    if (options.task) {
      // Mostrar informações de debug
      debugLog('=== DEBUG INFO (ReAct Mode) ===');
      debugLog('Task:', options.task);
      debugLog('Instructions:', instructions);
      debugLog('Show State:', options.showState);
      debugLog('===============================');
      
      // Enviar tarefa específica e sair
      const response = await agent.sendMessage(options.task);
      log(response);
    } else {
      // Iniciar modo interativo (REPL) com foco em tarefas que requerem ferramentas
      log('Modo ReAct - Tarefas que requerem uso de ferramentas.');
      log('O agente usará ferramentas automaticamente quando necessário.');
      if (options.showState) {
        log('Estado híbrido será mostrado após cada resposta.');
      }
      log('Digite "exit" para sair.');
      log('Comandos especiais: /help para ajuda');
      
      await agent.startInteractiveSession(instructions);
    }
  });
import { Command } from 'commander';
import { loadConfig, debugLog, log } from '../utils/config-loader';
import { InteractiveAgent } from './interactive-agent';

export const reactCommand = new Command('react')
  .description('Executar tarefa no modo ReAct (automatizado)')
  .option('-m, --message <message>', 'Mensagem/tarefa para executar no modo ReAct')
  .option('-t, --task <task>', 'Enviar tarefa para ReAct (alias para -m)')
  .option('-p, --provider <provider>', 'Configurar provider específico')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .option('-l, --list-tools', 'Listar tools disponíveis')
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
    
    const message = options.message || options.task;
    
    if (message) {
      // Modo automatizado - processar mensagem/tarefa e sair
      debugLog('=== DEBUG INFO (ReAct Mode) ===');
      debugLog('Message:', message);
      debugLog('Instructions:', instructions);
      debugLog('Show State:', options.showState);
      debugLog('===============================');
      
      try {
        const response = await agent.sendMessage(message);
        log(response);
        // Finalizar automaticamente após processar a mensagem
        process.exit(0);
      } catch (error) {
        log(`Erro ao processar mensagem: ${error}`);
        process.exit(1);
      }
    } else {
      // Modo interativo - para casos em que não há mensagem específica
      log('Modo ReAct - Tarefas que requerem uso de ferramentas.');
      log('O agente usará ferramentas automaticamente quando necessário.');
      if (options.showState) {
        log('Estado híbrido será mostrado após cada resposta.');
      }
      log('Digite \"exit\" para sair.');
      log('Comandos especiais: /help para ajuda');
      
      await agent.startInteractiveSession(instructions);
    }
  });
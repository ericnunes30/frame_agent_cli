import { Command } from 'commander';
import { loadConfig, debugLog, log } from '../utils/config-loader';
import { InteractiveAgent } from './interactive-agent';

export const chatCommand = new Command('chat')
  .description('Iniciar uma sessão de chat com o agente híbrido adaptativo')
  .option('-m, --message <message>', 'Enviar uma mensagem específica')
  .option('-p, --provider <provider>', 'Configurar provider específico')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .option('--show-state', 'Mostrar estado híbrido atual (chat/react)', false)
  .action(async (options) => {
    const config = await loadConfig();
    
    // Criar agente interativo
    const agent = new InteractiveAgent(options.showState);
    
    // Adicionar instruções do sistema, se fornecidas
    const instructions = options.instructions || config.instructions;
    
    if (options.message) {
      // Mostrar informações de debug
      debugLog('=== DEBUG INFO (Hybrid Mode) ===');
      debugLog('Message:', options.message);
      debugLog('Provider:', options.provider || config.provider);
      debugLog('Instructions:', instructions);
      debugLog('Show State:', options.showState);
      debugLog('===============================');
      
      // Enviar mensagem específica e sair
      const response = await agent.sendMessage(options.message);
      log(response);
    } else {
      // Iniciar modo interativo (REPL)
      await agent.startInteractiveSession(instructions);
    }
  });
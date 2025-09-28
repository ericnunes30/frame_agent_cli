import { Command } from 'commander';
import { loadConfig, log } from '../utils/config-loader';
import { InteractiveAgent } from './interactive-agent';

export const planningCommand = new Command('plan')
  .description('Iniciar modo Planning com o agente híbrido adaptativo')
  .option('-t, --task <task>', 'Enviar tarefa complexa')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .option('--show-state', 'Mostrar estado híbrido atual (chat/react)', false)
  .action(async (options) => {
    // Criar agente interativo
    const agent = new InteractiveAgent(options.showState);
    
    // Adicionar instruções do sistema, se fornecidas
    const config = await loadConfig();
    const instructions = options.instructions || config.instructions;
    
    if (options.task) {
      // Enviar tarefa específica
      const response = await agent.sendMessage(options.task);
      log(response);
    } else {
      // Iniciar modo interativo (REPL) com foco em tarefas complexas
      log('Modo Planning - Tarefas complexas que requerem planejamento e ferramentas.');
      log('O agente usará ferramentas automaticamente quando necessário para tarefas complexas.');
      if (options.showState) {
        log('Estado híbrido será mostrado após cada resposta.');
      }
      log('Digite "exit" para sair.');
      log('Comandos especiais: /help para ajuda');
      
      await agent.startInteractiveSession(instructions);
    }
  });
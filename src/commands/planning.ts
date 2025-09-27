import { Command } from 'commander';
import { ChatAgent } from '@ericnunes/frame_agent';
import { loadConfig, log, errorLog } from '../utils/config-loader';
import { searchTool, fileCreateTool, fileEditTool, fileReadTool, terminalTool } from '../tools';

export const planningCommand = new Command('plan')
  .description('Iniciar modo Planning com o agente')
  .option('-t, --task <task>', 'Enviar tarefa complexa')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .action(async (options) => {
    const baseConfig = await loadConfig();
    
    // Configurar agente para modo Planning
    const agentConfig = {
      ...baseConfig,
      mode: 'planning' as const,
      instructions: options.instructions || baseConfig.instructions,
    };
    
    const agent = new ChatAgent(agentConfig);
    
    // Registrar tools disponíveis para o modo Planning
    agent.registerTool(searchTool);
    agent.registerTool(fileCreateTool);
    agent.registerTool(fileEditTool);
    agent.registerTool(fileReadTool);
    agent.registerTool(terminalTool);
    
    if (options.task) {
      // Enviar tarefa específica
      const response = await agent.sendMessage(options.task);
      log(response);
    } else {
      // Iniciar modo interativo
      log('Modo Planning interativo. Digite "exit" para sair.');
      
      // Implementar REPL
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const askQuestion = () => {
        rl.question('> ', async (input: string) => {
          if (input.toLowerCase() === 'exit') {
            log('Saindo do modo Planning...');
            rl.close();
            return;
          }
          
          try {
            const response = await agent.sendMessage(input);
            log(response);
          } catch (error) {
            errorLog('Erro ao enviar tarefa:', error);
          }
          
          askQuestion();
        });
      };
      
      askQuestion();
    }
  });
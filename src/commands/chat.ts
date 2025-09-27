import { Command } from 'commander';
import { ChatAgent } from '@ericnunes/frame_agent';
import { loadConfig, debugLog, log, errorLog } from '../utils/config-loader';
import { searchTool, fileCreateTool, fileEditTool, fileReadTool, terminalTool, finalAnswerTool } from '../tools';

export const chatCommand = new Command('chat')
  .description('Iniciar uma sessão de chat com o agente (modo ReAct por padrão)')
  .option('-m, --message <message>', 'Enviar uma mensagem específica')
  .option('-p, --provider <provider>', 'Configurar provider específico')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .option('--mode <mode>', 'Definir modo do agente (chat, react, planning)', 'react') // Modo ReAct por padrão para executar ações
  .action(async (options) => {
    const config = await loadConfig();
    
    // Mesclar configurações do CLI com configurações do arquivo
    // Usar sempre o modo especificado (padrão: react)
    const finalMode = options.mode;

    const agentConfig = {
      ...config,
      provider: options.provider || config.provider,
      instructions: options.instructions || config.instructions,
      mode: finalMode as 'chat' | 'react' | 'planning', // Definir modo do agente
    };
    
    // Mostrar informações de debug apenas se DEBUG=true ou ENABLE_LOGGING=true
    debugLog('=== CREATING AGENT ===');
    debugLog('Agent config:', JSON.stringify(agentConfig, null, 2));
    debugLog('====================');
    
    const agent = new ChatAgent(agentConfig);
    
    // Registrar tools disponíveis (sempre registrar para modo ReAct)
    agent.registerTool(searchTool);
    agent.registerTool(fileCreateTool);
    agent.registerTool(fileEditTool);
    agent.registerTool(fileReadTool);
    agent.registerTool(terminalTool);
    agent.registerTool(finalAnswerTool);
    
    if (options.message) {
      // Mostrar informações de debug apenas se DEBUG=true ou ENABLE_LOGGING=true
      debugLog('=== DEBUG INFO ===');
      debugLog('Message:', options.message);
      debugLog('Mode:', agentConfig.mode);
      debugLog('Instructions:', agentConfig.instructions);
      debugLog('Provider:', agentConfig.provider);
      debugLog('Registered tools:', agent.listTools().map(t => t.name));
      debugLog('==================');
      
      // Enviar mensagem específica e sair
      const response = await agent.sendMessage(options.message);
      log(response);
    } else {
      // Iniciar modo interativo (REPL)
      log(`Modo chat interativo (${agentConfig.mode}). Digite "exit" para sair.`);
      log('Comandos especiais: /mode [chat|react|planning] para mudar modo, /help para ajuda');
      
      // Implementar REPL
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const askQuestion = () => {
        rl.question('> ', async (input: string) => {
          if (input.toLowerCase() === 'exit') {
            log('Saindo do modo chat...');
            rl.close();
            return;
          }
          
          // Comandos especiais
          if (input.startsWith('/mode ')) {
            const newMode = input.split(' ')[1] as 'chat' | 'react' | 'planning';
            if (['chat', 'react', 'planning'].includes(newMode)) {
              agent.setConfig({ mode: newMode });
              log(`Modo alterado para: ${newMode}`);
            } else {
              log('Modo inválido. Use: chat, react ou planning');
            }
            askQuestion();
            return;
          }
          
          if (input === '/help') {
            log('Comandos disponíveis:');
            log('/mode [chat|react|planning] - Mudar modo do agente');
            log('/help - Mostrar esta ajuda');
            log('exit - Sair do programa');
            askQuestion();
            return;
          }
          
          try {
            // Se estiver no modo ReAct, mostrar pensamento do agente
            if (agentConfig.mode === 'react') {
              // Aqui poderíamos adicionar uma forma de mostrar o pensamento
              // Por enquanto, vamos manter o comportamento padrão
              // Mas vamos registrar que estamos no modo ReAct
              log('[ReAct] Processando sua solicitação...');
            }
            
            const response = await agent.sendMessage(input);
            log(response);
          } catch (error) {
            errorLog('Erro ao enviar mensagem:', error);
          }
          
          askQuestion();
        });
      };
      
      askQuestion();
    }
  });
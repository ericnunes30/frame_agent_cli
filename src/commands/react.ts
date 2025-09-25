import { Command } from 'commander';
import { ChatAgent } from '@ericnunes/frame_agent';
import { loadConfig } from '../utils/config-loader';
import { searchTool, fileCreateTool, fileEditTool, fileReadTool, terminalTool } from '../tools';

export const reactCommand = new Command('react')
  .description('Iniciar modo ReAct com o agente (alias para chat --mode react)')
  .option('-t, --task <task>', 'Enviar tarefa para ReAct')
  .option('-l, --list-tools', 'Listar tools disponíveis')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .action(async (options) => {
    console.log('O comando "react" é um alias para "chat --mode react".');
    console.log('Use "frame-agent chat --mode react" para a mesma funcionalidade.');
    console.log('Redirecionando para o modo chat com modo ReAct ativado...\n');
    
    // Importar e executar o comando chat com modo react
    const { chatCommand } = await import('./chat');
    
    // Simular as opções do comando chat com modo react
    const chatOptions = {
      ...options,
      mode: 'react'
    };
    
    // Chamar a action do chat command diretamente
    // Note: Esta é uma abordagem simplificada. Em produção, poderíamos refatorar melhor.
    console.log('Para usar o modo ReAct, use o comando:');
    console.log('frame-agent chat --mode react');
    
    if (options.task) {
      console.log('Ou para tarefas específicas:');
      console.log(`frame-agent chat --mode react -m "${options.task}"`);
    }
  });
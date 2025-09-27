import { Command } from 'commander';
import { log } from '../utils/config-loader';

export const reactCommand = new Command('react')
  .description('Iniciar modo ReAct com o agente (alias para chat --mode react)')
  .option('-t, --task <task>', 'Enviar tarefa para ReAct')
  .option('-l, --list-tools', 'Listar tools disponíveis')
  .option('-i, --instructions <instructions>', 'Definir instruções do sistema')
  .action(async (options) => {
    log('O comando "react" é um alias para "chat --mode react".');
    log('Use "frame-agent chat --mode react" para a mesma funcionalidade.');
    log('Redirecionando para o modo chat com modo ReAct ativado...\n');
    
    log('Para usar o modo ReAct, use o comando:');
    log('frame-agent chat --mode react');
    
    if (options.task) {
      log('Ou para tarefas específicas:');
      log(`frame-agent chat --mode react -m "${options.task}"`);
    }
  });
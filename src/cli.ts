import { Command } from 'commander';
import { chatCommand } from './core/chat';
import { reactCommand } from './core/react';
import { planningCommand } from './core/planning';
import { configCommand } from './core/config';
import { toolsCommand } from './core/tools';

export const program = new Command();

program
  .name('frame-agent')
  .description('CLI para interagir com agentes de IA usando o SDK @ericnunes/frame_agent')
  .version('1.0.0');

// Registrar comandos
program.addCommand(chatCommand);
program.addCommand(reactCommand);
program.addCommand(planningCommand);
program.addCommand(configCommand);
program.addCommand(toolsCommand);
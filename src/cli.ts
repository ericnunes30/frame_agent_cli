import { Command } from 'commander';
import { chatCommand } from './commands/chat';
import { reactCommand } from './commands/react';
import { planningCommand } from './commands/planning';
import { configCommand } from './commands/config';
import { toolsCommand } from './commands/tools';

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
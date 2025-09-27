import { Command } from 'commander';
import { log } from '../utils/config-loader';

export const configCommand = new Command('config')
  .description('Gerenciar configurações do CLI')
  .action(() => {
    log('Configuração atual:');
    // Implementação será adicionada posteriormente
  });

// Subcomando para definir configurações
configCommand
  .command('set')
  .description('Definir configuração')
  .option('-t, --temperature <number>', 'Definir temperatura')
  .action((options) => {
    log('Definindo configurações:', options);
    // Implementação será adicionada posteriormente
  });

// Subcomando para resetar configurações
configCommand
  .command('reset')
  .description('Resetar configuração')
  .action(() => {
    log('Resetando configuração...');
    // Implementação será adicionada posteriormente
  });
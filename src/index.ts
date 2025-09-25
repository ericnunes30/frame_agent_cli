#!/usr/bin/env node
import { config } from 'dotenv';
import { program } from './cli';

// Carregar variáveis de ambiente
config();

// Inicializar CLI
program.parse();
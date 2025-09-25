#!/usr/bin/env node
import { program } from '../src/cli';

// Testar comandos
console.log('Testando CLI do Frame Agent...');

// Mostrar ajuda
program.parse(['--help']);
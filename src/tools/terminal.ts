import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import { exec } from 'child_process';
import { promisify } from 'util';
import { log, errorLog } from '../utils/config-loader';

const execPromise = promisify(exec);

export const terminalTool: Tool = {
  name: 'terminal',
  description: 'Executar comandos shell seguros',
  parameters: v.object({
    command: v.string()
  }),
  execute: async (params: { command: string }) => {
    try {
      // Mostrar informações de debug
      log('=== TOOL EXECUTION ===');
      log('Tool: terminal');
      log('Command:', params.command);
      log('====================');
      
      // Executar comando shell
      const { stdout, stderr } = await execPromise(params.command);
      const result = stdout || stderr;
      
      // Mostrar resultado bruto da tool
      log('=== TOOL RESULT ===');
      log('Command output:', result);
      log('==================');
      
      return result;
    } catch (error: any) {
      errorLog('=== TOOL ERROR ===');
      errorLog('Error executing terminal command:', error.message);
      errorLog('==================');
      return `Erro ao executar comando: ${error.message}`;
    }
  },
};
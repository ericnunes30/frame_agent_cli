import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import { exec } from 'child_process';
import { promisify } from 'util';

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
      console.log('=== TOOL EXECUTION ===');
      console.log('Tool: terminal');
      console.log('Command:', params.command);
      console.log('====================');
      
      // Executar comando shell
      const { stdout, stderr } = await execPromise(params.command);
      const result = stdout || stderr;
      
      // Mostrar resultado bruto da tool
      console.log('=== TOOL RESULT ===');
      console.log('Command output:', result);
      console.log('==================');
      
      return result;
    } catch (error: any) {
      console.error('=== TOOL ERROR ===');
      console.error('Error executing terminal command:', error.message);
      console.error('==================');
      return `Erro ao executar comando: ${error.message}`;
    }
  },
};
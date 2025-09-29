import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import { exec } from 'child_process';
import { promisify } from 'util';
import { log, errorLog } from '../utils/config-loader';

const execPromise = promisify(exec);
const TOOL_ID = '[terminal]';

export const terminalTool: Tool = {
  name: 'terminal',
  description: 'Executar comandos shell seguros e formatar a saída',
  parameters: v.object({
    command: v.string()
  }),
  execute: async (params: { command: string }) => {
    try {
      log(`${TOOL_ID} ? Executando comando`);
      log(`${TOOL_ID} • ${params.command}`);

      const { stdout, stderr } = await execPromise(params.command, { windowsHide: true });
      const cleanedStdout = stdout?.trim() ?? '';
      const cleanedStderr = stderr?.trim() ?? '';
      const combined = [cleanedStdout, cleanedStderr].filter(Boolean).join('\n');

      if (combined) {
        log(`${TOOL_ID} ? Saída capturada`);
        log(`${TOOL_ID} •\n${combined}`);
        return combined;
      }

      const noOutputMessage = 'Comando executado, mas não gerou saída visível.';
      log(`${TOOL_ID} ? ${noOutputMessage}`);
      return noOutputMessage;
    } catch (error: any) {
      const message = error?.stderr?.trim() || error?.message || 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? ${message}`);
      return `? Erro ao executar comando: ${message}`;
    }
  },
};

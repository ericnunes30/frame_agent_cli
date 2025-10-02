import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import { exec } from 'child_process';
import { promisify } from 'util';
import { toolLog, errorLog } from '../utils/config-loader';
import { createError } from '../utils/error-handler';

const execPromise = promisify(exec);
const TOOL_ID = '[terminal]';

export const terminalTool: Tool = {
  name: 'terminal',
  description: `Executar comandos shell seguros e formatar a saída. CADA EXECUÇÃO É INDEPENDENTE - não há sessão interativa persistente. Comandos que esperam interação contínua (como digitar senhas, responder prompts ou entrar em shells interativos) NÃO FUNCIONAM. NÃO USE "exit" ou comandos de encerramento, pois isso não tem efeito na sessão atual. O comando é executado em modo não-interativo e retorna imediatamente após conclusão.`,
  parameters: v.object({
    command: v.string()
  }),
  execute: async (params: { command: string }) => {
    try {
      toolLog(`${TOOL_ID} ? Executando comando`);
      toolLog(`${TOOL_ID} � ${params.command}`);

      const { stdout, stderr } = await execPromise(params.command, { windowsHide: true });
      const cleanedStdout = stdout?.trim() ?? '';
      const cleanedStderr = stderr?.trim() ?? '';
      const combined = [cleanedStdout, cleanedStderr].filter(Boolean).join('\n');

      if (combined) {
        toolLog(`${TOOL_ID} ? Sa�da capturada`);
        toolLog(`${TOOL_ID} �\n${combined}`);
        return { success: true, output: combined };
      }

      const noOutputMessage = 'Comando executado, mas n�o gerou sa�da vis�vel.';
      toolLog(`${TOOL_ID} ? ${noOutputMessage}`);
      return { success: true, message: noOutputMessage };
    } catch (error: any) {
      const message = error?.stderr?.trim() || error?.message || 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? ${message}`);
      return createError(`? Erro ao executar comando: ${message}`, 'COMMAND_EXECUTION_ERROR', error);
    }
  },
};

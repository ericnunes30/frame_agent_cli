import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import { exec } from 'child_process';
import { promisify } from 'util';
import { log, errorLog } from '../utils/config-loader';

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
      log(`${TOOL_ID} ? Executando comando`);
      log(`${TOOL_ID} � ${params.command}`);

      const { stdout, stderr } = await execPromise(params.command, { windowsHide: true });
      const cleanedStdout = stdout?.trim() ?? '';
      const cleanedStderr = stderr?.trim() ?? '';
      const combined = [cleanedStdout, cleanedStderr].filter(Boolean).join('\n');

      if (combined) {
        log(`${TOOL_ID} ? Sa�da capturada`);
        log(`${TOOL_ID} �\n${combined}`);
        return combined;
      }

      const noOutputMessage = 'Comando executado, mas n�o gerou sa�da vis�vel.';
      log(`${TOOL_ID} ? ${noOutputMessage}`);
      return noOutputMessage;
    } catch (error: any) {
      const message = error?.stderr?.trim() || error?.message || 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? ${message}`);
      return `? Erro ao executar comando: ${message}`;
    }
  },
};

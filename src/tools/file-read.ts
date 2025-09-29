import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import { log, errorLog } from '../utils/config-loader';

const TOOL_ID = '[file_read]';

export const fileReadTool: Tool = {
  name: 'file_read',
  description: 'Ler conteúdo de arquivos (aceita "/" e "\\" em caminhos)',
  parameters: v.object({
    filePath: v.string()
  }),
  execute: async (params: { filePath: string }) => {
    try {
      log(`${TOOL_ID} ? Lendo arquivo`);
      log(`${TOOL_ID} • Caminho: ${params.filePath}`);

      if (!fs.existsSync(params.filePath)) {
        const message = `Arquivo não encontrado: ${params.filePath} (verifique uso de "/" ou "\\")`;
        errorLog(`${TOOL_ID} ? ${message}`);
        return `? ${message}`;
      }

      const content = fs.readFileSync(params.filePath, 'utf-8');

      log(`${TOOL_ID} ? Leitura concluída (${content.length} caractere(s))`);
      return content;
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? Erro ao ler arquivo (${message})`);
      return `? Erro ao ler arquivo ${params.filePath}: ${message}`;
    }
  },
};

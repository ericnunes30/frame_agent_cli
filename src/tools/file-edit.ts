import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import { log, errorLog } from '../utils/config-loader';

const TOOL_ID = '[file_edit]';

export const fileEditTool: Tool = {
  name: 'file_edit',
  description: 'Editar arquivos existentes (aceita "/" e "\\" em caminhos)',
  parameters: v.object({
    filePath: v.string(),
    content: v.string()
  }),
  execute: async (params: { filePath: string; content: string }) => {
    try {
      log(`${TOOL_ID} ? Editando arquivo`);
      log(`${TOOL_ID} • Caminho: ${params.filePath}`);

      if (!fs.existsSync(params.filePath)) {
        const message = `Arquivo não encontrado: ${params.filePath} (verifique uso de "/" ou "\\")`;
        errorLog(`${TOOL_ID} ? ${message}`);
        return `? ${message}`;
      }

      fs.writeFileSync(params.filePath, params.content);

      log(`${TOOL_ID} ? Arquivo atualizado`);
      return `? Conteúdo atualizado em: ${params.filePath}`;
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? Erro ao editar arquivo (${message})`);
      return `? Erro ao editar arquivo ${params.filePath}: ${message}`;
    }
  },
};

import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import { toolLog, errorLog } from '../utils/config-loader';
import { createError } from '../utils/error-handler';

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
      toolLog(`${TOOL_ID} ? Editando arquivo`);
      toolLog(`${TOOL_ID} � Caminho: ${params.filePath}`);

      if (!fs.existsSync(params.filePath)) {
        const message = `Arquivo n�o encontrado: ${params.filePath} (verifique uso de "/" ou "\\")`;
        errorLog(`${TOOL_ID} ? ${message}`);
        return createError(message, 'FILE_NOT_FOUND');
      }

      fs.writeFileSync(params.filePath, params.content);

      toolLog(`${TOOL_ID} ? Arquivo atualizado`);
      return { success: true, message: `? Conte�do atualizado em: ${params.filePath}` };
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? Erro ao editar arquivo (${message})`);
      return createError(`? Erro ao editar arquivo ${params.filePath}: ${message}`, 'FILE_EDIT_ERROR', error);
    }
  },
};

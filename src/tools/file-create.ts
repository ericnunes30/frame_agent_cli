import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import * as path from 'path';
import { toolLog, errorLog } from '../utils/config-loader';
import { createError } from '../utils/error-handler';

const TOOL_ID = '[file_create]';

export const fileCreateTool: Tool = {
  name: 'file_create',
  description: 'Criar novos arquivos com conte�do (aceita "/" e "\\" em caminhos)',
  parameters: v.object({
    filePath: v.string(),
    content: v.string()
  }),
  execute: async (params: { filePath: string; content: string }) => {
    try {
      toolLog(`${TOOL_ID} ? Criando arquivo`);
      toolLog(`${TOOL_ID} � Caminho: ${params.filePath}`);

      const dir = path.dirname(params.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        toolLog(`${TOOL_ID} � Diret�rio criado: ${dir}`);
      }

      fs.writeFileSync(params.filePath, params.content);

      toolLog(`${TOOL_ID} ? Arquivo criado`);
      return { success: true, message: `? Arquivo criado com sucesso: ${params.filePath}` };
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? Falha ao criar arquivo (${message})`);
      return createError(`? Erro ao criar arquivo ${params.filePath}: ${message} (use "/" ou "\\")`, 'FILE_CREATE_ERROR', error);
    }
  },
};

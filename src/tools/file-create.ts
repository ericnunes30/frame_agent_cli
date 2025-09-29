import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import * as path from 'path';
import { log, errorLog } from '../utils/config-loader';

const TOOL_ID = '[file_create]';

export const fileCreateTool: Tool = {
  name: 'file_create',
  description: 'Criar novos arquivos com conteúdo (aceita "/" e "\\" em caminhos)',
  parameters: v.object({
    filePath: v.string(),
    content: v.string()
  }),
  execute: async (params: { filePath: string; content: string }) => {
    try {
      log(`${TOOL_ID} ? Criando arquivo`);
      log(`${TOOL_ID} • Caminho: ${params.filePath}`);

      const dir = path.dirname(params.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`${TOOL_ID} • Diretório criado: ${dir}`);
      }

      fs.writeFileSync(params.filePath, params.content);

      log(`${TOOL_ID} ? Arquivo criado`);
      return `? Arquivo criado com sucesso: ${params.filePath}`;
    } catch (error: any) {
      const message = error?.message ?? 'motivo desconhecido';
      errorLog(`${TOOL_ID} ? Falha ao criar arquivo (${message})`);
      return `? Erro ao criar arquivo ${params.filePath}: ${message} (use "/" ou "\\")`;
    }
  },
};

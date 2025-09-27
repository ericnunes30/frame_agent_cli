import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import * as path from 'path';
import { log, errorLog } from '../utils/config-loader';

export const fileCreateTool: Tool = {
  name: 'file_create',
  description: 'Criar novos arquivos com conteúdo',
  parameters: v.object({
    filePath: v.string(),
    content: v.string()
  }),
  execute: async (params: { filePath: string; content: string }) => {
    try {
      // Mostrar informações de debug
      log('=== TOOL EXECUTION ===');
      log('Tool: file_create');
      log('File path:', params.filePath);
      log('Content:', params.content);
      log('====================');
      
      // Garantir que o diretório existe
      const dir = path.dirname(params.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Criar arquivo com conteúdo
      fs.writeFileSync(params.filePath, params.content);
      
      // Mostrar resultado bruto da tool
      log('=== TOOL RESULT ===');
      log('File created successfully:', params.filePath);
      log('==================');
      
      return `Arquivo criado com sucesso: ${params.filePath}`;
    } catch (error: any) {
      errorLog('=== TOOL ERROR ===');
      errorLog('Error creating file:', error.message);
      errorLog('==================');
      return `Erro ao criar arquivo: ${error.message}`;
    }
  },
};
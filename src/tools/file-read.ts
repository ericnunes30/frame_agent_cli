import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import { log, errorLog } from '../utils/config-loader';

export const fileReadTool: Tool = {
  name: 'file_read',
  description: 'Ler conteúdo de arquivos',
  parameters: v.object({
    filePath: v.string()
  }),
  execute: async (params: { filePath: string }) => {
    try {
      // Mostrar informações de debug
      log('=== TOOL EXECUTION ===');
      log('Tool: file_read');
      log('File path:', params.filePath);
      log('====================');
      
      if (!fs.existsSync(params.filePath)) {
        errorLog('=== TOOL ERROR ===');
        errorLog('File not found:', params.filePath);
        errorLog('==================');
        return `Arquivo não encontrado: ${params.filePath}`;
      }
      
      // Ler conteúdo do arquivo
      const content = fs.readFileSync(params.filePath, 'utf-8');
      
      // Mostrar resultado bruto da tool
      log('=== TOOL RESULT ===');
      log('File content:', content);
      log('==================');
      
      return content;
    } catch (error: any) {
      errorLog('=== TOOL ERROR ===');
      errorLog('Error reading file:', error.message);
      errorLog('==================');
      return `Erro ao ler arquivo: ${error.message}`;
    }
  },
};
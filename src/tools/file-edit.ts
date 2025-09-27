import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import { log, errorLog } from '../utils/config-loader';

export const fileEditTool: Tool = {
  name: 'file_edit',
  description: 'Editar arquivos existentes',
  parameters: v.object({
    filePath: v.string(),
    content: v.string()
  }),
  execute: async (params: { filePath: string; content: string }) => {
    try {
      // Mostrar informações de debug
      log('=== TOOL EXECUTION ===');
      log('Tool: file_edit');
      log('File path:', params.filePath);
      log('Content:', params.content);
      log('====================');
      
      if (!fs.existsSync(params.filePath)) {
        errorLog('=== TOOL ERROR ===');
        errorLog('File not found:', params.filePath);
        errorLog('==================');
        return `Arquivo não encontrado: ${params.filePath}`;
      }
      
      // Editar arquivo com novo conteúdo
      fs.writeFileSync(params.filePath, params.content);
      
      // Mostrar resultado bruto da tool
      log('=== TOOL RESULT ===');
      log('File edited successfully:', params.filePath);
      log('==================');
      
      return `Arquivo editado com sucesso: ${params.filePath}`;
    } catch (error: any) {
      errorLog('=== TOOL ERROR ===');
      errorLog('Error editing file:', error.message);
      errorLog('==================');
      return `Erro ao editar arquivo: ${error.message}`;
    }
  },
};
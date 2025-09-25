import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';

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
      console.log('=== TOOL EXECUTION ===');
      console.log('Tool: file_edit');
      console.log('File path:', params.filePath);
      console.log('Content:', params.content);
      console.log('====================');
      
      if (!fs.existsSync(params.filePath)) {
        console.error('=== TOOL ERROR ===');
        console.error('File not found:', params.filePath);
        console.error('==================');
        return `Arquivo não encontrado: ${params.filePath}`;
      }
      
      // Editar arquivo com novo conteúdo
      fs.writeFileSync(params.filePath, params.content);
      
      // Mostrar resultado bruto da tool
      console.log('=== TOOL RESULT ===');
      console.log('File edited successfully:', params.filePath);
      console.log('==================');
      
      return `Arquivo editado com sucesso: ${params.filePath}`;
    } catch (error: any) {
      console.error('=== TOOL ERROR ===');
      console.error('Error editing file:', error.message);
      console.error('==================');
      return `Erro ao editar arquivo: ${error.message}`;
    }
  },
};
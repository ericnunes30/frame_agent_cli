import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';

export const fileReadTool: Tool = {
  name: 'file_read',
  description: 'Ler conteúdo de arquivos',
  parameters: v.object({
    filePath: v.string()
  }),
  execute: async (params: { filePath: string }) => {
    try {
      // Mostrar informações de debug
      console.log('=== TOOL EXECUTION ===');
      console.log('Tool: file_read');
      console.log('File path:', params.filePath);
      console.log('====================');
      
      if (!fs.existsSync(params.filePath)) {
        console.error('=== TOOL ERROR ===');
        console.error('File not found:', params.filePath);
        console.error('==================');
        return `Arquivo não encontrado: ${params.filePath}`;
      }
      
      // Ler conteúdo do arquivo
      const content = fs.readFileSync(params.filePath, 'utf-8');
      
      // Mostrar resultado bruto da tool
      console.log('=== TOOL RESULT ===');
      console.log('File content:', content);
      console.log('==================');
      
      return content;
    } catch (error: any) {
      console.error('=== TOOL ERROR ===');
      console.error('Error reading file:', error.message);
      console.error('==================');
      return `Erro ao ler arquivo: ${error.message}`;
    }
  },
};
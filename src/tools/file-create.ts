import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import * as fs from 'fs';
import * as path from 'path';

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
      console.log('=== TOOL EXECUTION ===');
      console.log('Tool: file_create');
      console.log('File path:', params.filePath);
      console.log('Content:', params.content);
      console.log('====================');
      
      // Garantir que o diretório existe
      const dir = path.dirname(params.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Criar arquivo com conteúdo
      fs.writeFileSync(params.filePath, params.content);
      
      // Mostrar resultado bruto da tool
      console.log('=== TOOL RESULT ===');
      console.log('File created successfully:', params.filePath);
      console.log('==================');
      
      return `Arquivo criado com sucesso: ${params.filePath}`;
    } catch (error: any) {
      console.error('=== TOOL ERROR ===');
      console.error('Error creating file:', error.message);
      console.error('==================');
      return `Erro ao criar arquivo: ${error.message}`;
    }
  },
};
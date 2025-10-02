import { Tool } from '@ericnunes/frame_agent';
import * as v from 'valibot';
import { glob } from 'glob';
import * as fs from 'fs';
import { toolLog, errorLog } from '../utils/config-loader';
import { createError } from '../utils/error-handler';

export const searchTool: Tool = {
  name: 'search',
  description: 'Pesquisar por palavras-chave em toda a base de código',
  parameters: v.object({
    query: v.string(),
    fileType: v.optional(v.string())
  }),
  execute: async (params: { query: string; fileType?: string }) => {
    try {
      // Construir padrão de busca
      let pattern = '**/*';
      if (params.fileType) {
        pattern += params.fileType;
      } else {
        pattern += '*';
      }
      
      // Usar glob para encontrar arquivos
      const files = await glob(pattern, { 
        cwd: process.cwd(),
        ignore: ['node_modules/**', 'dist/**', '.git/**'],
        nodir: true
      });
      
      // Filtrar arquivos que contenham a query
      const results: Array<{file: string, matches: string[]}> = [];
      for (const file of files) {
        try {
          const content = await fs.promises.readFile(file, 'utf-8');
          if (content.includes(params.query)) {
            // Encontrar linhas que contêm a query
            const lines = content.split('\n');
            const matches: string[] = [];
            lines.forEach((line, index) => {
              if (line.includes(params.query)) {
                matches.push(`L${index + 1}: ${line.trim()}`);
              }
            });
            results.push({ file, matches });
          }
        } catch (error) {
          // Ignorar arquivos que não podem ser lidos
        }
      }
      
      // Mostrar resultado bruto da tool
      toolLog('=== TOOL RESULT ===');
      toolLog('Search tool result:', JSON.stringify(results, null, 2));
      toolLog('===================');
      
      return { success: true, results };
    } catch (error) {
      errorLog('Erro na busca:', error);
      return createError('Falha ao executar a busca', 'SEARCH_ERROR', error);
    }
  },
};
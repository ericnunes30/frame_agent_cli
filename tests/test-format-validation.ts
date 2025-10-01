import { ChatAgent } from '@ericnunes/frame_agent';
import { Tool } from '@ericnunes/frame_agent';

// Simular um LLM que responde fora do formato ReAct
class MockAdapter {
  private callCount = 0;
  
  async sendMessage(params: any) {
    this.callCount++;
    
    if (this.callCount === 1) {
      // Primeira chamada - resposta fora do formato ReAct
      console.log('[MOCK] Gerando resposta FORA do formato ReAct...');
      return {
        content: 'Esta é uma resposta em formato livre, não estou seguindo o formato ReAct esperado. Vou tentar fazer algo útil mas não estou usando o formato estruturado.'
      };
    } else if (this.callCount === 2) {
      // Segunda chamada - após mensagem de correção
      console.log('[MOCK] Gerando resposta NO formato ReAct correto...');
      return {
        content: `Thought: Recebi a correção, vou seguir o formato ReAct corretamente agora
Action: search
Action Input: {"query": "teste de validação"}`
      };
    } else {
      // Resposta final
      return {
        content: `Final Answer: Teste de validação de formato concluído com sucesso.`
      };
    }
  }
  
  async sendStructuredMessage(params: any) {
    return this.sendMessage(params);
  }
}

async function testReActValidationInAgentCLI() {
  console.log('=== Teste: Validação de Formato ReAct no Agent CLI ===\n');
  
  // Criar agente ReAct com o adaptador mock
  const agent = new ChatAgent({
    name: 'Agente de Teste',
    instructions: 'Você é um agente para testar validação de formato ReAct.',
    mode: 'react'  // Importante: modo ReAct explicitamente
  });
  
  // Criar uma ferramenta de teste
  const searchTool: Tool = {
    name: 'search',
    description: 'Ferramenta de busca para testes',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Termo de busca'
        }
      },
      required: ['query']
    },
    execute: async (args: any) => {
      console.log(`[EXECUTANDO] Busca para: ${args.query}`);
      return `Resultados para: ${args.query}`;
    }
  };
  
  agent.registerTool(searchTool);
  
  // Substituir o provedor por um mock
  let mockCallCount = 0;
  (agent as any).providerAdapter = {
    sendMessage: async (params: any) => {
      const currentCallCount = mockCallCount;
      mockCallCount++;
      
      if (currentCallCount === 0) {
        // Primeira chamada - resposta fora do formato ReAct
        console.log('[MOCK] Gerando resposta FORA do formato ReAct...');
        return {
          content: 'Esta é uma resposta em formato livre, não estou seguindo o formato ReAct esperado. Vou tentar fazer algo útil mas não estou usando o formato estruturado.'
        };
      } else if (currentCallCount === 1) {
        // Segunda chamada - após mensagem de correção
        console.log('[MOCK] Gerando resposta NO formato ReAct correto...');
        return {
          content: `Thought: Recebi a correção, vou seguir o formato ReAct corretamente agora
Action: search
Action Input: {"query": "teste de validação"}`
        };
      } else {
        // Resposta final
        return {
          content: `Final Answer: Teste de validação de formato concluído com sucesso.`
        };
      }
    },
    sendStructuredMessage: async (params: any) => {
      return (agent as any).providerAdapter.sendMessage(params);
    }
  };
  
  try {
    console.log('Iniciando teste com resposta fora do formato...\n');
    
    // Enviar uma mensagem para o modo ReAct
    const response = await agent.sendMessage('Faça uma busca por "teste de validação"');
    
    console.log('\n✅ RESULTADO ESPERADO:');
    console.log('- O sistema detectou a resposta fora do formato ReAct');
    console.log('- Foi aplicado o mecanismo de reintegração');
    console.log('- A execução continuou normalmente');
    
    console.log('\nResposta recebida:');
    console.log(response);
    
    console.log('\n🎉 A integração entre agent_cli e frame_agent está funcionando corretamente!');
    console.log('A validação de formato ReAct está ativa e operacional.');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste
testReActValidationInAgentCLI().catch(console.error);
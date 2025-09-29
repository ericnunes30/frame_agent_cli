import { HybridAgent, OpenAIAdapter } from '@ericnunes/frame_agent';
import { log, errorLog } from '../utils/config-loader';
import { 
  searchTool, 
  fileCreateTool, 
  fileEditTool, 
  fileReadTool, 
  terminalTool, 
  finalAnswerTool 
} from '../tools';

/**
 * Cria e gerencia um agente híbrido adaptativo com interface interativa
 * Esta versão usa o HybridAgent do frame_agent para o ciclo ReAct completo
 */
export class InteractiveAgent {
  private agent: HybridAgent;
  private showState: boolean;

  constructor(showState: boolean = false) {
    this.showState = showState;
    const apiKey = process.env['OPENAI_API_KEY'];
    const model = process.env['MODEL'] || 'gpt-4o-mini';
    
    // Criar adaptador
    let adapter: any;
    if (model.includes('gpt-4o') || model.includes('gpt-4')) {
      adapter = new OpenAIAdapter(model, apiKey);
    } else {
      adapter = new OpenAIAdapter(model, apiKey, process.env['OPENAI_BASE_URL']);
    }
    
    // Criar agente híbrido
    this.agent = new HybridAgent(adapter);
    
    // Registrar tools padrão
    this.registerDefaultTools();
  }

  /**
   * Registra as tools padrão no agente
   */
  private registerDefaultTools(): void {
    this.agent.registerTool(searchTool);
    this.agent.registerTool(fileCreateTool);
    this.agent.registerTool(fileEditTool);
    this.agent.registerTool(fileReadTool);
    this.agent.registerTool(terminalTool);
    this.agent.registerTool(finalAnswerTool);
  }

  /**
   * Envia uma mensagem única ao agente
   */
  async sendMessage(message: string): Promise<string> {
    const response = await this.agent.sendMessage(message);
    
    // Mostrar estado se solicitado
    if (this.showState) {
      log(`[Estado híbrido: ${this.agent.getHybridState()}]`);
    }
    
    // Verificar se a resposta já foi exibida pelo AdaptiveExecutor
    if (process.env.RESPONSE_ALREADY_DISPLAYED === 'true') {
      // Resetar a flag e não retornar a resposta duplicada
      delete process.env.RESPONSE_ALREADY_DISPLAYED;
      return response; // Still return for programmatic use but avoid duplicate display
    }
    
    return response;
  }

  /**
   * Inicia uma sessão interativa (REPL)
   */
  async startInteractiveSession(instructions?: string): Promise<void> {
    // Adicionar instruções do sistema, se fornecidas
    if (instructions) {
      (this.agent as any).history.push({ role: 'system', content: instructions });
    }
    
    log('Modo híbrido adaptativo interativo.');
    log('O agente alternará automaticamente entre conversação e uso de ferramentas conforme necessário.');
    if (this.showState) {
      log('Estado híbrido será mostrado após cada resposta.');
    }
    log('Digite "exit" para sair.');
    log('Comandos especiais: /help para ajuda');
    
    // Implementar REPL
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const askQuestion = () => {
      rl.question('> ', async (input: string) => {
        if (input.toLowerCase() === 'exit') {
          log('Saindo do modo híbrido...');
          rl.close();
          return;
        }
        
        // Comandos especiais
        if (input === '/help') {
          log('Comandos disponíveis:');
          log('/help - Mostrar esta ajuda');
          log('exit - Sair do programa');
          askQuestion();
          return;
        }
        
        try {
          // Enviar mensagem ao agente híbrido
          const response = await this.agent.sendMessage(input);
          
          // Verificar se a resposta já foi exibida pelo AdaptiveExecutor
          if (process.env.RESPONSE_ALREADY_DISPLAYED !== 'true') {
            log(response);
          } else {
            // Resetar a flag para próximas execuções
            delete process.env.RESPONSE_ALREADY_DISPLAYED;
          }
          
          // Mostrar estado se solicitado
          if (this.showState) {
            log(`[Estado híbrido: ${this.agent.getHybridState()}]`);
          }
        } catch (error) {
          errorLog('Erro ao enviar mensagem:', error);
        }
        
        askQuestion();
      });
    };
    
    askQuestion();
  }

  /**
   * Obtém o estado híbrido atual do agente
   */
  getHybridState(): 'chat' | 'react' {
    return this.agent.getHybridState();
  }

  /**
   * Registra uma tool personalizada
   */
  registerTool(tool: any): void {
    this.agent.registerTool(tool);
  }

  /**
   * Limpa o histórico do agente
   */
  clearHistory(): void {
    this.agent.clearHistory();
  }
}
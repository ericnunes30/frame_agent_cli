// Mock dependencies
jest.mock('@ericnunes/frame_agent');
jest.mock('../../src/utils/config-loader');

// Import the chat command after mocks are set up
import { chatCommand } from '../../src/commands/chat';

describe('chatCommand', () => {
  let mockLoadConfig: jest.Mock;
  let mockChatAgent: jest.Mock;
  let mockSendMessage: jest.Mock;
  let consoleLogSpy: jest.SpyInstance;
  let originalArgv: string[];

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Store original process.argv
    originalArgv = [...process.argv];

    // Reset process.argv to default
    process.argv = ['node', 'test'];

    // Reset the command state
    // This is needed to avoid state issues between tests
    jest.resetModules();
    jest.mock('@ericnunes/frame_agent');
    jest.mock('../../src/utils/config-loader');
    
    // Re-import dependencies
    const { ChatAgent: ChatAgentImport } = require('@ericnunes/frame_agent');
    const { loadConfig: loadConfigImport } = require('../../src/utils/config-loader');
    
    // Mock loadConfig
    mockLoadConfig = loadConfigImport as jest.Mock;
    mockLoadConfig.mockResolvedValue({
      name: 'Test Agent',
      provider: 'openai-gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Mock ChatAgent
    mockSendMessage = jest.fn();
    const mockListTools = jest.fn();
    const mockRegisterTool = jest.fn();
    mockChatAgent = ChatAgentImport as jest.Mock;
    mockChatAgent.mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        listTools: mockListTools,
        registerTool: mockRegisterTool,
      };
    });

    // Re-import the chat command after mocks are set up
    const { chatCommand: chatCommandImport } = require('../../src/commands/chat');
    // Update the chatCommand reference
    Object.assign(chatCommand, chatCommandImport);

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore original process.argv
    process.argv = originalArgv;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('command setup', () => {
    it('should create a command with correct name and description', () => {
      expect(chatCommand.name()).toBe('chat');
      expect(chatCommand.description()).toBe('Iniciar uma sessão de chat com o agente');
    });

    it('should have message and provider options', () => {
      const helpText = chatCommand.helpInformation();
      expect(helpText).toContain('-m, --message <message>');
      expect(helpText).toContain('-p, --provider <provider>');
    });
  });

  describe('action handler', () => {
    it('should load config and create ChatAgent with default provider', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'chat', 'chat'];
      
      // Execute the command
      await chatCommand.parseAsync(process.argv);
      
      expect(mockLoadConfig).toHaveBeenCalled();
      expect(mockChatAgent).toHaveBeenCalledWith({
        name: 'Test Agent',
        provider: 'openai-gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
      });
    });

    it('should use provider from options when provided', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'chat', 'chat', '--provider', 'anthropic-claude-3'];
      
      // Execute the command
      await chatCommand.parseAsync(process.argv);
      
      expect(mockLoadConfig).toHaveBeenCalled();
      expect(mockChatAgent).toHaveBeenCalledWith({
        name: 'Test Agent',
        provider: 'anthropic-claude-3',
        temperature: 0.7,
        maxTokens: 1000,
      });
    });

    it('should send message and log response when message option is provided', async () => {
      const mockResponse = 'Hello! How can I help you?';
      mockSendMessage.mockResolvedValue(mockResponse);
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'chat', 'chat', '--message', 'Hello, world!'];
      
      // Execute the command
      await chatCommand.parseAsync(process.argv);
      
      expect(mockSendMessage).toHaveBeenCalledWith('Hello, world!');
      expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
    });

    it('should log interactive mode message when no message option is provided', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'chat', 'chat'];
      
      // Execute the command
      await chatCommand.parseAsync(process.argv);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Modo chat interativo. Digite "exit" para sair.');
    });

    it('should handle config loading errors gracefully', async () => {
      mockLoadConfig.mockRejectedValue(new Error('Config load failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'chat', 'chat', '--message', 'Hello'];
      
      // Execute the command
      await expect(chatCommand.parseAsync(process.argv)).rejects.toThrow('Config load failed');
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle message sending errors gracefully', async () => {
      mockSendMessage.mockRejectedValue(new Error('Message send failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'chat', 'chat', '--message', 'Hello'];
      
      // Execute the command
      await expect(chatCommand.parseAsync(process.argv)).rejects.toThrow('Message send failed');
      
      consoleErrorSpy.mockRestore();
    });
  });
});
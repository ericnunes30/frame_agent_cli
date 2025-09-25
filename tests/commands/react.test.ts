// Mock dependencies
jest.mock('@ericnunes/frame_agent');
jest.mock('../../src/utils/config-loader');

// Import the react command after mocks are set up
import { reactCommand } from '../../src/commands/react';

describe('reactCommand', () => {
  let mockLoadConfig: jest.Mock;
  let mockChatAgent: jest.Mock;
  let mockSendMessage: jest.Mock;
  let mockListTools: jest.Mock;
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
    mockListTools = jest.fn().mockReturnValue([]);
    const mockRegisterTool = jest.fn();
    mockChatAgent = ChatAgentImport as jest.Mock;
    mockChatAgent.mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        listTools: mockListTools,
        registerTool: mockRegisterTool,
      };
    });

    // Re-import the react command after mocks are set up
    const { reactCommand: reactCommandImport } = require('../../src/commands/react');
    // Update the reactCommand reference
    Object.assign(reactCommand, reactCommandImport);

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
      expect(reactCommand.name()).toBe('react');
      expect(reactCommand.description()).toBe('Iniciar modo ReAct com o agente');
    });

    it('should have task and list-tools options', () => {
      const helpText = reactCommand.helpInformation();
      expect(helpText).toContain('-t, --task <task>');
      expect(helpText).toContain('-l, --list-tools');
    });
  });

  describe('action handler', () => {
    it('should load config and create ChatAgent with react mode', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'react', 'react'];
      
      // Execute the command
      await reactCommand.parseAsync(process.argv);
      
      expect(mockLoadConfig).toHaveBeenCalled();
      expect(mockChatAgent).toHaveBeenCalledWith({
        name: 'Test Agent',
        provider: 'openai-gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
        mode: 'react',
      });
    });

    it('should list tools when list-tools option is provided', async () => {
      const mockTools = [
        { name: 'search', description: 'Search the web' },
        { name: 'calculator', description: 'Perform calculations' },
      ];
      mockListTools.mockReturnValue(mockTools);
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'react', 'react', '--list-tools'];
      
      // Execute the command
      await reactCommand.parseAsync(process.argv);
      
      expect(mockListTools).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Tools disponíveis:');
      expect(consoleLogSpy).toHaveBeenCalledWith('- search: Search the web');
      expect(consoleLogSpy).toHaveBeenCalledWith('- calculator: Perform calculations');
    });

    it('should send task and log response when task option is provided', async () => {
      const mockResponse = 'The square root of 144 is 12';
      mockSendMessage.mockResolvedValue(mockResponse);
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'react', 'react', '--task', 'Calculate the square root of 144'];
      
      // Execute the command
      await reactCommand.parseAsync(process.argv);
      
      expect(mockSendMessage).toHaveBeenCalledWith('Calculate the square root of 144');
      expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
    });

    it('should log interactive mode message when no options are provided', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'react', 'react'];
      
      // Execute the command
      await reactCommand.parseAsync(process.argv);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Modo ReAct interativo. Digite "exit" para sair.');
    });

    it('should handle config loading errors gracefully', async () => {
      mockLoadConfig.mockRejectedValue(new Error('Config load failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'react', 'react', '--task', 'Calculate something'];
      
      // Execute the command
      await expect(reactCommand.parseAsync(process.argv)).rejects.toThrow('Config load failed');
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle task sending errors gracefully', async () => {
      mockSendMessage.mockRejectedValue(new Error('Task send failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'react', 'react', '--task', 'Calculate something'];
      
      // Execute the command
      await expect(reactCommand.parseAsync(process.argv)).rejects.toThrow('Task send failed');
      
      consoleErrorSpy.mockRestore();
    });
  });
});
// Mock dependencies
jest.mock('@ericnunes/frame_agent');
jest.mock('../../src/utils/config-loader');

// Import the planning command after mocks are set up
import { planningCommand } from '../../src/core/planning';

describe('planningCommand', () => {
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

    // Re-import the planning command after mocks are set up
    const { planningCommand: planningCommandImport } = require('../../src/commands/planning');
    // Update the planningCommand reference
    Object.assign(planningCommand, planningCommandImport);

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
      expect(planningCommand.name()).toBe('plan');
      expect(planningCommand.description()).toBe('Iniciar modo Planning com o agente');
    });

    it('should have task option', () => {
      const helpText = planningCommand.helpInformation();
      expect(helpText).toContain('-t, --task <task>');
    });
  });

  describe('action handler', () => {
  it('should load config and create ChatAgent with planning mode', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'plan', 'plan'];
      
      // Execute the command
      await planningCommand.parseAsync(process.argv);
      
      expect(mockLoadConfig).toHaveBeenCalled();
      expect(mockChatAgent).toHaveBeenCalledWith({
        name: 'Test Agent',
        provider: 'openai-gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000,
        mode: 'planning',
      });
    });

    it('should send task and log response when task option is provided', async () => {
      const mockResponse = 'Here is your plan for a trip to Europe...';
      mockSendMessage.mockResolvedValue(mockResponse);
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'plan', 'plan', '--task', 'Plan a trip to Europe'];
      
      // Execute the command
      await planningCommand.parseAsync(process.argv);
      
      expect(mockSendMessage).toHaveBeenCalledWith('Plan a trip to Europe');
      expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
    });

    it('should log interactive mode message when no task option is provided', async () => {
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'plan', 'plan'];
      
      // Execute the command
      await planningCommand.parseAsync(process.argv);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Modo Planning interativo. Digite "exit" para sair.');
    });

    it('should handle config loading errors gracefully', async () => {
      mockLoadConfig.mockRejectedValue(new Error('Config load failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'plan', 'plan', '--task', 'Plan a trip'];
      
      // Execute the command
      await expect(planningCommand.parseAsync(process.argv)).rejects.toThrow('Config load failed');
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle task sending errors gracefully', async () => {
      mockSendMessage.mockRejectedValue(new Error('Task send failed'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock process.argv to simulate command line arguments
      process.argv = ['node', 'plan', 'plan', '--task', 'Plan a trip'];
      
      // Execute the command
      await expect(planningCommand.parseAsync(process.argv)).rejects.toThrow('Task send failed');
      
      consoleErrorSpy.mockRestore();
    });
  });
});
// Import the tools command
import { toolsCommand } from '../../src/core/tools';

describe('toolsCommand', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('command setup', () => {
    it('should create a command with correct name and description', () => {
      expect(toolsCommand.name()).toBe('tools');
      expect(toolsCommand.description()).toBe('Gerenciar tools do agente');
    });

    it('should have register subcommand with file option', () => {
      const registerCommand = toolsCommand.commands.find((cmd: any) => cmd.name() === 'register');
      expect(registerCommand).toBeDefined();
      if (registerCommand) {
        expect(registerCommand.description()).toBe('Registrar uma tool');
        
        const helpText = registerCommand.helpInformation();
        expect(helpText).toContain('-f, --file <file>');
      }
    });

    it('should have list subcommand', () => {
      const listCommand = toolsCommand.commands.find((cmd: any) => cmd.name() === 'list');
      expect(listCommand).toBeDefined();
      if (listCommand) {
        expect(listCommand.description()).toBe('Listar tools registradas');
      }
    });

    it('should have unregister subcommand with name option', () => {
      const unregisterCommand = toolsCommand.commands.find((cmd: any) => cmd.name() === 'unregister');
      expect(unregisterCommand).toBeDefined();
      if (unregisterCommand) {
        expect(unregisterCommand.description()).toBe('Remover tool');
        
        const helpText = unregisterCommand.helpInformation();
        expect(helpText).toContain('-n, --name <name>');
      }
    });
  });

  describe('action handler', () => {
    it('should have correct command structure', () => {
      expect(toolsCommand.name()).toBe('tools');
      expect(toolsCommand.description()).toBe('Gerenciar tools do agente');
    });

    it('should have register subcommand with correct options', () => {
      const registerCommand = toolsCommand.commands.find((cmd: any) => cmd.name() === 'register');
      expect(registerCommand).toBeDefined();
      if (registerCommand) {
        expect(registerCommand.description()).toBe('Registrar uma tool');
        
        const helpText = registerCommand.helpInformation();
        expect(helpText).toContain('-f, --file <file>');
      }
    });

    it('should have list subcommand', () => {
      const listCommand = toolsCommand.commands.find((cmd: any) => cmd.name() === 'list');
      expect(listCommand).toBeDefined();
      if (listCommand) {
        expect(listCommand.description()).toBe('Listar tools registradas');
      }
    });

    it('should have unregister subcommand with correct options', () => {
      const unregisterCommand = toolsCommand.commands.find((cmd: any) => cmd.name() === 'unregister');
      expect(unregisterCommand).toBeDefined();
      if (unregisterCommand) {
        expect(unregisterCommand.description()).toBe('Remover tool');
        
        const helpText = unregisterCommand.helpInformation();
        expect(helpText).toContain('-n, --name <name>');
      }
    });
  });
});
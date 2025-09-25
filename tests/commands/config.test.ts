// Import the config command
import { configCommand } from '../../src/commands/config';

describe('configCommand', () => {
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
      expect(configCommand.name()).toBe('config');
      expect(configCommand.description()).toBe('Gerenciar configurações do CLI');
    });

    it('should have set subcommand with temperature option', () => {
      const setCommand = configCommand.commands.find((cmd: any) => cmd.name() === 'set');
      expect(setCommand).toBeDefined();
      if (setCommand) {
        expect(setCommand.description()).toBe('Definir configuração');
        
        const helpText = setCommand.helpInformation();
        expect(helpText).toContain('-t, --temperature <number>');
      }
    });

    it('should have reset subcommand', () => {
      const resetCommand = configCommand.commands.find((cmd: any) => cmd.name() === 'reset');
      expect(resetCommand).toBeDefined();
      if (resetCommand) {
        expect(resetCommand.description()).toBe('Resetar configuração');
      }
    });
  });

  describe('action handler', () => {
    it('should have correct command structure', () => {
      expect(configCommand.name()).toBe('config');
      expect(configCommand.description()).toBe('Gerenciar configurações do CLI');
    });

    it('should have set subcommand with correct options', () => {
      const setCommand = configCommand.commands.find((cmd: any) => cmd.name() === 'set');
      expect(setCommand).toBeDefined();
      if (setCommand) {
        expect(setCommand.description()).toBe('Definir configuração');
        
        const helpText = setCommand.helpInformation();
        expect(helpText).toContain('-t, --temperature <number>');
      }
    });

    it('should have reset subcommand', () => {
      const resetCommand = configCommand.commands.find((cmd: any) => cmd.name() === 'reset');
      expect(resetCommand).toBeDefined();
      if (resetCommand) {
        expect(resetCommand.description()).toBe('Resetar configuração');
      }
    });
  });
});
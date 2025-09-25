"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../src/commands/config");
describe('configCommand', () => {
    let consoleLogSpy;
    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        consoleLogSpy.mockRestore();
    });
    describe('command setup', () => {
        it('should create a command with correct name and description', () => {
            expect(config_1.configCommand.name()).toBe('config');
            expect(config_1.configCommand.description()).toBe('Gerenciar configurações do CLI');
        });
        it('should have set subcommand with temperature option', () => {
            const setCommand = config_1.configCommand.commands.find((cmd) => cmd.name() === 'set');
            expect(setCommand).toBeDefined();
            if (setCommand) {
                expect(setCommand.description()).toBe('Definir configuração');
                const helpText = setCommand.helpInformation();
                expect(helpText).toContain('-t, --temperature <number>');
            }
        });
        it('should have reset subcommand', () => {
            const resetCommand = config_1.configCommand.commands.find((cmd) => cmd.name() === 'reset');
            expect(resetCommand).toBeDefined();
            if (resetCommand) {
                expect(resetCommand.description()).toBe('Resetar configuração');
            }
        });
    });
    describe('action handler', () => {
        it('should have correct command structure', () => {
            expect(config_1.configCommand.name()).toBe('config');
            expect(config_1.configCommand.description()).toBe('Gerenciar configurações do CLI');
        });
        it('should have set subcommand with correct options', () => {
            const setCommand = config_1.configCommand.commands.find((cmd) => cmd.name() === 'set');
            expect(setCommand).toBeDefined();
            if (setCommand) {
                expect(setCommand.description()).toBe('Definir configuração');
                const helpText = setCommand.helpInformation();
                expect(helpText).toContain('-t, --temperature <number>');
            }
        });
        it('should have reset subcommand', () => {
            const resetCommand = config_1.configCommand.commands.find((cmd) => cmd.name() === 'reset');
            expect(resetCommand).toBeDefined();
            if (resetCommand) {
                expect(resetCommand.description()).toBe('Resetar configuração');
            }
        });
    });
});
//# sourceMappingURL=config.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../../src/commands/tools");
describe('toolsCommand', () => {
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
            expect(tools_1.toolsCommand.name()).toBe('tools');
            expect(tools_1.toolsCommand.description()).toBe('Gerenciar tools do agente');
        });
        it('should have register subcommand with file option', () => {
            const registerCommand = tools_1.toolsCommand.commands.find((cmd) => cmd.name() === 'register');
            expect(registerCommand).toBeDefined();
            if (registerCommand) {
                expect(registerCommand.description()).toBe('Registrar uma tool');
                const helpText = registerCommand.helpInformation();
                expect(helpText).toContain('-f, --file <file>');
            }
        });
        it('should have list subcommand', () => {
            const listCommand = tools_1.toolsCommand.commands.find((cmd) => cmd.name() === 'list');
            expect(listCommand).toBeDefined();
            if (listCommand) {
                expect(listCommand.description()).toBe('Listar tools registradas');
            }
        });
        it('should have unregister subcommand with name option', () => {
            const unregisterCommand = tools_1.toolsCommand.commands.find((cmd) => cmd.name() === 'unregister');
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
            expect(tools_1.toolsCommand.name()).toBe('tools');
            expect(tools_1.toolsCommand.description()).toBe('Gerenciar tools do agente');
        });
        it('should have register subcommand with correct options', () => {
            const registerCommand = tools_1.toolsCommand.commands.find((cmd) => cmd.name() === 'register');
            expect(registerCommand).toBeDefined();
            if (registerCommand) {
                expect(registerCommand.description()).toBe('Registrar uma tool');
                const helpText = registerCommand.helpInformation();
                expect(helpText).toContain('-f, --file <file>');
            }
        });
        it('should have list subcommand', () => {
            const listCommand = tools_1.toolsCommand.commands.find((cmd) => cmd.name() === 'list');
            expect(listCommand).toBeDefined();
            if (listCommand) {
                expect(listCommand.description()).toBe('Listar tools registradas');
            }
        });
        it('should have unregister subcommand with correct options', () => {
            const unregisterCommand = tools_1.toolsCommand.commands.find((cmd) => cmd.name() === 'unregister');
            expect(unregisterCommand).toBeDefined();
            if (unregisterCommand) {
                expect(unregisterCommand.description()).toBe('Remover tool');
                const helpText = unregisterCommand.helpInformation();
                expect(helpText).toContain('-n, --name <name>');
            }
        });
    });
});
//# sourceMappingURL=tools.test.js.map
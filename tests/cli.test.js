"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("../src/cli");
describe('CLI', () => {
    it('should create a program with correct name and version', () => {
        expect(cli_1.program.name()).toBe('frame-agent');
        expect(cli_1.program.version()).toBeDefined();
    });
    it('should register all command modules', () => {
        const commands = cli_1.program.commands;
        expect(commands).toHaveLength(5);
        const commandNames = commands.map(cmd => cmd.name());
        expect(commandNames).toContain('chat');
        expect(commandNames).toContain('config');
        expect(commandNames).toContain('plan');
        expect(commandNames).toContain('react');
        expect(commandNames).toContain('tools');
    });
});
//# sourceMappingURL=cli.test.js.map
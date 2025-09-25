"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commands = tslib_1.__importStar(require("../../src/commands/index"));
describe('commands/index', () => {
    it('should export all command modules', () => {
        expect(commands).toHaveProperty('chatCommand');
        expect(commands).toHaveProperty('configCommand');
        expect(commands).toHaveProperty('planningCommand');
        expect(commands).toHaveProperty('reactCommand');
        expect(commands).toHaveProperty('toolsCommand');
    });
});
//# sourceMappingURL=index.test.js.map
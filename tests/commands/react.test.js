"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@ericnunes/frame_agent');
jest.mock('../../src/utils/config-loader');
const react_1 = require("../../src/commands/react");
describe('reactCommand', () => {
    let mockLoadConfig;
    let mockChatAgent;
    let mockSendMessage;
    let mockListTools;
    let consoleLogSpy;
    let originalArgv;
    beforeEach(() => {
        jest.clearAllMocks();
        originalArgv = [...process.argv];
        process.argv = ['node', 'test'];
        jest.resetModules();
        jest.mock('@ericnunes/frame_agent');
        jest.mock('../../src/utils/config-loader');
        const { ChatAgent: ChatAgentImport } = require('@ericnunes/frame_agent');
        const { loadConfig: loadConfigImport } = require('../../src/utils/config-loader');
        mockLoadConfig = loadConfigImport;
        mockLoadConfig.mockResolvedValue({
            name: 'Test Agent',
            provider: 'openai-gpt-4o-mini',
            temperature: 0.7,
            maxTokens: 1000,
        });
        mockSendMessage = jest.fn();
        mockListTools = jest.fn().mockReturnValue([]);
        const mockRegisterTool = jest.fn();
        mockChatAgent = ChatAgentImport;
        mockChatAgent.mockImplementation(() => {
            return {
                sendMessage: mockSendMessage,
                listTools: mockListTools,
                registerTool: mockRegisterTool,
            };
        });
        const { reactCommand: reactCommandImport } = require('../../src/commands/react');
        Object.assign(react_1.reactCommand, reactCommandImport);
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        process.argv = originalArgv;
    });
    afterEach(() => {
        consoleLogSpy.mockRestore();
    });
    describe('command setup', () => {
        it('should create a command with correct name and description', () => {
            expect(react_1.reactCommand.name()).toBe('react');
            expect(react_1.reactCommand.description()).toBe('Iniciar modo ReAct com o agente');
        });
        it('should have task and list-tools options', () => {
            const helpText = react_1.reactCommand.helpInformation();
            expect(helpText).toContain('-t, --task <task>');
            expect(helpText).toContain('-l, --list-tools');
        });
    });
    describe('action handler', () => {
        it('should load config and create ChatAgent with react mode', async () => {
            process.argv = ['node', 'react', 'react'];
            await react_1.reactCommand.parseAsync(process.argv);
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
            process.argv = ['node', 'react', 'react', '--list-tools'];
            await react_1.reactCommand.parseAsync(process.argv);
            expect(mockListTools).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith('Tools disponíveis:');
            expect(consoleLogSpy).toHaveBeenCalledWith('- search: Search the web');
            expect(consoleLogSpy).toHaveBeenCalledWith('- calculator: Perform calculations');
        });
        it('should send task and log response when task option is provided', async () => {
            const mockResponse = 'The square root of 144 is 12';
            mockSendMessage.mockResolvedValue(mockResponse);
            process.argv = ['node', 'react', 'react', '--task', 'Calculate the square root of 144'];
            await react_1.reactCommand.parseAsync(process.argv);
            expect(mockSendMessage).toHaveBeenCalledWith('Calculate the square root of 144');
            expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
        });
        it('should log interactive mode message when no options are provided', async () => {
            process.argv = ['node', 'react', 'react'];
            await react_1.reactCommand.parseAsync(process.argv);
            expect(consoleLogSpy).toHaveBeenCalledWith('Modo ReAct interativo. Digite "exit" para sair.');
        });
        it('should handle config loading errors gracefully', async () => {
            mockLoadConfig.mockRejectedValue(new Error('Config load failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            process.argv = ['node', 'react', 'react', '--task', 'Calculate something'];
            await expect(react_1.reactCommand.parseAsync(process.argv)).rejects.toThrow('Config load failed');
            consoleErrorSpy.mockRestore();
        });
        it('should handle task sending errors gracefully', async () => {
            mockSendMessage.mockRejectedValue(new Error('Task send failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            process.argv = ['node', 'react', 'react', '--task', 'Calculate something'];
            await expect(react_1.reactCommand.parseAsync(process.argv)).rejects.toThrow('Task send failed');
            consoleErrorSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=react.test.js.map
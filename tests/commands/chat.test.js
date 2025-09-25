"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@ericnunes/frame_agent');
jest.mock('../../src/utils/config-loader');
const chat_1 = require("../../src/commands/chat");
describe('chatCommand', () => {
    let mockLoadConfig;
    let mockChatAgent;
    let mockSendMessage;
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
        const mockListTools = jest.fn();
        const mockRegisterTool = jest.fn();
        mockChatAgent = ChatAgentImport;
        mockChatAgent.mockImplementation(() => {
            return {
                sendMessage: mockSendMessage,
                listTools: mockListTools,
                registerTool: mockRegisterTool,
            };
        });
        const { chatCommand: chatCommandImport } = require('../../src/commands/chat');
        Object.assign(chat_1.chatCommand, chatCommandImport);
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
            expect(chat_1.chatCommand.name()).toBe('chat');
            expect(chat_1.chatCommand.description()).toBe('Iniciar uma sessão de chat com o agente');
        });
        it('should have message and provider options', () => {
            const helpText = chat_1.chatCommand.helpInformation();
            expect(helpText).toContain('-m, --message <message>');
            expect(helpText).toContain('-p, --provider <provider>');
        });
    });
    describe('action handler', () => {
        it('should load config and create ChatAgent with default provider', async () => {
            process.argv = ['node', 'chat', 'chat'];
            await chat_1.chatCommand.parseAsync(process.argv);
            expect(mockLoadConfig).toHaveBeenCalled();
            expect(mockChatAgent).toHaveBeenCalledWith({
                name: 'Test Agent',
                provider: 'openai-gpt-4o-mini',
                temperature: 0.7,
                maxTokens: 1000,
            });
        });
        it('should use provider from options when provided', async () => {
            process.argv = ['node', 'chat', 'chat', '--provider', 'anthropic-claude-3'];
            await chat_1.chatCommand.parseAsync(process.argv);
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
            process.argv = ['node', 'chat', 'chat', '--message', 'Hello, world!'];
            await chat_1.chatCommand.parseAsync(process.argv);
            expect(mockSendMessage).toHaveBeenCalledWith('Hello, world!');
            expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
        });
        it('should log interactive mode message when no message option is provided', async () => {
            process.argv = ['node', 'chat', 'chat'];
            await chat_1.chatCommand.parseAsync(process.argv);
            expect(consoleLogSpy).toHaveBeenCalledWith('Modo chat interativo. Digite "exit" para sair.');
        });
        it('should handle config loading errors gracefully', async () => {
            mockLoadConfig.mockRejectedValue(new Error('Config load failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            process.argv = ['node', 'chat', 'chat', '--message', 'Hello'];
            await expect(chat_1.chatCommand.parseAsync(process.argv)).rejects.toThrow('Config load failed');
            consoleErrorSpy.mockRestore();
        });
        it('should handle message sending errors gracefully', async () => {
            mockSendMessage.mockRejectedValue(new Error('Message send failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            process.argv = ['node', 'chat', 'chat', '--message', 'Hello'];
            await expect(chat_1.chatCommand.parseAsync(process.argv)).rejects.toThrow('Message send failed');
            consoleErrorSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=chat.test.js.map
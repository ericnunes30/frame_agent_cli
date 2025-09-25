"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@ericnunes/frame_agent');
jest.mock('../../src/utils/config-loader');
const planning_1 = require("../../src/commands/planning");
describe('planningCommand', () => {
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
        const { planningCommand: planningCommandImport } = require('../../src/commands/planning');
        Object.assign(planning_1.planningCommand, planningCommandImport);
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
            expect(planning_1.planningCommand.name()).toBe('plan');
            expect(planning_1.planningCommand.description()).toBe('Iniciar modo Planning com o agente');
        });
        it('should have task option', () => {
            const helpText = planning_1.planningCommand.helpInformation();
            expect(helpText).toContain('-t, --task <task>');
        });
    });
    describe('action handler', () => {
        it('should load config and create ChatAgent with planning mode', async () => {
            process.argv = ['node', 'plan', 'plan'];
            await planning_1.planningCommand.parseAsync(process.argv);
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
            process.argv = ['node', 'plan', 'plan', '--task', 'Plan a trip to Europe'];
            await planning_1.planningCommand.parseAsync(process.argv);
            expect(mockSendMessage).toHaveBeenCalledWith('Plan a trip to Europe');
            expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
        });
        it('should log interactive mode message when no task option is provided', async () => {
            process.argv = ['node', 'plan', 'plan'];
            await planning_1.planningCommand.parseAsync(process.argv);
            expect(consoleLogSpy).toHaveBeenCalledWith('Modo Planning interativo. Digite "exit" para sair.');
        });
        it('should handle config loading errors gracefully', async () => {
            mockLoadConfig.mockRejectedValue(new Error('Config load failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            process.argv = ['node', 'plan', 'plan', '--task', 'Plan a trip'];
            await expect(planning_1.planningCommand.parseAsync(process.argv)).rejects.toThrow('Config load failed');
            consoleErrorSpy.mockRestore();
        });
        it('should handle task sending errors gracefully', async () => {
            mockSendMessage.mockRejectedValue(new Error('Task send failed'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            process.argv = ['node', 'plan', 'plan', '--task', 'Plan a trip'];
            await expect(planning_1.planningCommand.parseAsync(process.argv)).rejects.toThrow('Task send failed');
            consoleErrorSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=planning.test.js.map
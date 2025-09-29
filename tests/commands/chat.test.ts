import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { chatCommand } from '../../src/core/chat';
import { loadConfig, log, debugLog } from '../../src/utils/config-loader';

const sendMessageMock = jest.fn(async (_message: string) => '');
const startInteractiveSessionMock = jest.fn(async (_instructions: string) => {});
let interactiveAgentConstructor: jest.Mock;

jest.mock('../../src/utils/config-loader', () => ({
  loadConfig: jest.fn(),
  log: jest.fn(),
  debugLog: jest.fn(),
}));

jest.mock('../../src/core/interactive-agent', () => ({
  InteractiveAgent: jest.fn((...args: any[]) => interactiveAgentConstructor(...args)),
}));

interactiveAgentConstructor = jest.fn(() => ({
  sendMessage: sendMessageMock,
  startInteractiveSession: startInteractiveSessionMock,
}));

const loadConfigMock = jest.mocked(loadConfig);
const logMock = jest.mocked(log);
const debugLogMock = jest.mocked(debugLog);

describe('chatCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendMessageMock.mockReset();
    startInteractiveSessionMock.mockReset();
    interactiveAgentConstructor.mockReset();
    interactiveAgentConstructor.mockImplementation(() => ({
      sendMessage: sendMessageMock,
      startInteractiveSession: startInteractiveSessionMock,
    }));

    loadConfigMock.mockResolvedValue({
      provider: 'openai-gpt-4o-mini',
      instructions: 'Config instructions',
    } as any);
    sendMessageMock.mockResolvedValue('Chat response');
    startInteractiveSessionMock.mockResolvedValue(undefined);
  });

  it('creates InteractiveAgent and sends message when --message is provided', async () => {
    await chatCommand.parseAsync(['--message', 'Hello'], { from: 'user' });

    expect(interactiveAgentConstructor).toHaveBeenCalledWith(false);
    expect(sendMessageMock).toHaveBeenCalledWith('Hello');
    expect(debugLogMock).toHaveBeenCalledWith('=== DEBUG INFO (Hybrid Mode) ===');
    expect(logMock).toHaveBeenCalledWith('Chat response');
  });

  it('starts interactive session when no message is provided', async () => {
    await chatCommand.parseAsync([], { from: 'user' });

    expect(loadConfigMock).toHaveBeenCalled();
    expect(startInteractiveSessionMock).toHaveBeenCalledWith('Config instructions');
    expect(logMock).not.toHaveBeenCalled();
  });

  it('passes showState flag to InteractiveAgent', async () => {
    await chatCommand.parseAsync(['--show-state'], { from: 'user' });

    expect(interactiveAgentConstructor).toHaveBeenCalledWith(true);
  });

  it('uses custom instructions when provided', async () => {
    await chatCommand.parseAsync(['--instructions', 'Custom'], { from: 'user' });

    expect(startInteractiveSessionMock).toHaveBeenCalledWith('Custom');
  });
});

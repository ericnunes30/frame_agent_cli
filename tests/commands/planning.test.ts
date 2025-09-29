import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { planningCommand } from '../../src/core/planning';
import { loadConfig, log } from '../../src/utils/config-loader';

const sendMessageMock = jest.fn(async (_message: string) => '');
const startInteractiveSessionMock = jest.fn(async (_instructions: string) => {});
let interactiveAgentConstructor: jest.Mock;

jest.mock('../../src/utils/config-loader', () => ({
  loadConfig: jest.fn(),
  log: jest.fn(),
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

describe('planningCommand', () => {
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
      instructions: 'Config instructions',
    } as any);
    sendMessageMock.mockResolvedValue('Task response');
    startInteractiveSessionMock.mockResolvedValue(undefined);
  });

  it('creates InteractiveAgent and sends task when --task is provided', async () => {
    await planningCommand.parseAsync(['--task', 'Plan a trip'], { from: 'user' });

    expect(interactiveAgentConstructor).toHaveBeenCalledWith(false);
    expect(sendMessageMock).toHaveBeenCalledWith('Plan a trip');
    expect(logMock).toHaveBeenCalledWith('Task response');
  });

  it('starts interactive session when no task is provided', async () => {
    await planningCommand.parseAsync([], { from: 'user' });

    expect(loadConfigMock).toHaveBeenCalled();
    expect(startInteractiveSessionMock).toHaveBeenCalledWith('Config instructions');
  });

  it('uses custom instructions when provided', async () => {
    await planningCommand.parseAsync(['--instructions', 'Custom'], { from: 'user' });

    expect(startInteractiveSessionMock).toHaveBeenCalledWith('Custom');
  });

  it('passes showState flag to InteractiveAgent', async () => {
    await planningCommand.parseAsync(['--show-state'], { from: 'user' });

    expect(interactiveAgentConstructor).toHaveBeenCalledWith(true);
  });
});

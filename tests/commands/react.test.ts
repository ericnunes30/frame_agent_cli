import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { reactCommand } from '../../src/core/react';
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

describe('reactCommand', () => {
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
    sendMessageMock.mockResolvedValue('ReAct response');
    startInteractiveSessionMock.mockResolvedValue(undefined);
  });

  it('lists tools without instantiating the agent when --list-tools is provided', async () => {
    await reactCommand.parseAsync(['--list-tools'], { from: 'user' });

    expect(interactiveAgentConstructor).not.toHaveBeenCalled();
    expect(logMock).toHaveBeenCalledWith('Tools disponíveis:');
    expect(logMock).toHaveBeenCalledWith('- search: Pesquisar por palavras-chave em toda a base de código');
    expect(logMock).toHaveBeenCalledWith('- final_answer: Fornece uma resposta final ao usuário e encerra a interação');
  });

  it('creates InteractiveAgent and sends task when --task is provided', async () => {
    await reactCommand.parseAsync(['--task', 'Solve this'], { from: 'user' });

    expect(interactiveAgentConstructor).toHaveBeenCalledWith(false);
    expect(sendMessageMock).toHaveBeenCalledWith('Solve this');
    expect(debugLogMock).toHaveBeenCalledWith('=== DEBUG INFO (ReAct Mode) ===');
    expect(logMock).toHaveBeenCalledWith('ReAct response');
  });

  it('starts interactive session when no task is provided', async () => {
    await reactCommand.parseAsync([], { from: 'user' });

    expect(loadConfigMock).toHaveBeenCalled();
    expect(startInteractiveSessionMock).toHaveBeenCalledWith('Config instructions');
    expect(logMock).toHaveBeenCalledWith('Modo ReAct - Tarefas que requerem uso de ferramentas.');
  });

  it('passes showState flag to InteractiveAgent', async () => {
    await reactCommand.parseAsync(['--show-state'], { from: 'user' });

    expect(interactiveAgentConstructor).toHaveBeenCalledWith(true);
  });

  it('uses custom instructions when provided', async () => {
    await reactCommand.parseAsync(['--instructions', 'Custom instructions'], { from: 'user' });

    expect(startInteractiveSessionMock).toHaveBeenCalledWith('Custom instructions');
  });
});


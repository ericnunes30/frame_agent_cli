import { ChatAgent } from '@ericnunes/frame_agent';
import { terminalTool } from '../../src/tools/terminal';

describe('terminalTool via ChatAgent API', () => {
  let originalApiKey: string | undefined;
  let originalEnableLogging: string | undefined;

  const createAgent = () => {
    const agent = new ChatAgent({
      name: 'Test Agent',
      instructions: 'Validating terminal tool through the agent API.',
      provider: 'openai-generic',
    });

    agent.registerTool(terminalTool);

    return agent;
  };

  beforeAll(() => {
    originalApiKey = process.env['OPENAI_API_KEY'];
    originalEnableLogging = process.env['ENABLE_LOGGING'];

    process.env['OPENAI_API_KEY'] = originalApiKey || 'test-key';
    process.env['ENABLE_LOGGING'] = 'false';
  });

  afterAll(() => {
    if (originalApiKey === undefined) {
      delete process.env['OPENAI_API_KEY'];
    } else {
      process.env['OPENAI_API_KEY'] = originalApiKey;
    }

    if (originalEnableLogging === undefined) {
      delete process.env['ENABLE_LOGGING'];
    } else {
      process.env['ENABLE_LOGGING'] = originalEnableLogging;
    }
  });

  it('executes a safe shell command and returns its stdout', async () => {
    const agent = createAgent();
    const result = await agent.executeTool('terminal', { command: 'echo terminal-success' });

    expect(typeof result).toBe('string');
    expect(result.trim().toLowerCase()).toBe('terminal-success');
  });
});

import { ChatAgent } from '@ericnunes/frame_agent';
import { finalAnswerTool } from '../../src/tools/final-answer';

describe('finalAnswerTool via ChatAgent API', () => {
  let originalApiKey: string | undefined;
  let originalEnableLogging: string | undefined;

  const createAgent = () => {
    const agent = new ChatAgent({
      name: 'Test Agent',
      instructions: 'Validating final answer tool through the agent API.',
      provider: 'openai-generic',
    });

    agent.registerTool(finalAnswerTool);

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

  it('returns the provided response payload', async () => {
    const agent = createAgent();
    const response = 'This is the final answer';

    const result = await agent.executeTool('final_answer', { response });

    expect(result).toEqual({ response });
  });
});

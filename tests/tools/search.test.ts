import { ChatAgent } from '@ericnunes/frame_agent';
import { searchTool } from '../../src/tools/search';
import * as fs from 'fs';
import * as path from 'path';

describe('searchTool via ChatAgent API', () => {
  const fixturesDir = path.join(__dirname, 'search-fixtures');
  let originalApiKey: string | undefined;
  let originalEnableLogging: string | undefined;

  const createAgent = () => {
    const agent = new ChatAgent({
      name: 'Test Agent',
      instructions: 'Validating search tool through the agent API.',
      provider: 'openai-generic',
    });

    agent.registerTool(searchTool);

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

  beforeEach(() => {
    fs.mkdirSync(fixturesDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(fixturesDir, { recursive: true, force: true });
  });

  it('finds files that contain the provided query string', async () => {
    const uniqueTerm = `__SEARCH_TOOL_TERM_${Date.now()}__`;
    const targetFile = path.join(fixturesDir, 'match.txt');
    const otherFile = path.join(fixturesDir, 'other.txt');

    fs.writeFileSync(targetFile, `Line with ${uniqueTerm}`);
    fs.writeFileSync(otherFile, 'This file should not match.');

    const agent = createAgent();
    const result = await agent.executeTool('search', { query: uniqueTerm });

    expect(typeof result).toBe('string');
    const data = JSON.parse(result as string);

    const relativeTarget = path.relative(process.cwd(), targetFile);
    const normalizedRelativeTarget = relativeTarget.split(path.sep).join('/');

    const targetEntry = data.find((entry: { file: string; matches: string[] }) =>
      entry.file.split(path.sep).join('/') === normalizedRelativeTarget
    );

    expect(targetEntry).toBeDefined();
    expect(Array.isArray(targetEntry.matches)).toBe(true);
    expect(targetEntry.matches.some((line: string) => line.includes(uniqueTerm))).toBe(true);
  });
});

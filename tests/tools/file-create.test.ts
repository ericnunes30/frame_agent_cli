import { ChatAgent } from '@ericnunes/frame_agent';
import { fileCreateTool } from '../../src/tools/file-create';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('fileCreateTool via ChatAgent API', () => {
  let originalApiKey: string | undefined;
  let originalEnableLogging: string | undefined;

  const createAgent = () => {
    const agent = new ChatAgent({
      name: 'Test Agent',
      instructions: 'Validating file create tool through the agent API.',
      provider: 'openai-generic',
    });

    agent.registerTool(fileCreateTool);

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

  it('creates the target file and intermediate directories', async () => {
    const agent = createAgent();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'file-create-tool-'));
    const nestedDir = path.join(tempDir, 'nested', 'dir');
    const testFile = path.join(nestedDir, 'new-file.txt');
    const content = 'Generated via file_create tool';

    try {
      const result = await agent.executeTool('file_create', {
        filePath: testFile,
        content,
      });

      expect(result).toBe(`? Arquivo criado com sucesso: ${testFile}`);
      expect(fs.existsSync(testFile)).toBe(true);
      expect(fs.readFileSync(testFile, 'utf-8')).toBe(content);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

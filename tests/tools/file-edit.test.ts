import { ChatAgent } from '@ericnunes/frame_agent';
import { fileEditTool } from '../../src/tools/file-edit';
import * as fs from 'fs';
import * as path from 'path';

describe('fileEditTool via ChatAgent API', () => {
  const testDir = path.join(__dirname, 'file-edit-test-data');
  const testFile = path.join(testDir, 'test.txt');
  const initialContent = 'Hello, world!';
  const newContent = 'Hello, Jest!';
  let originalApiKey: string | undefined;
  let originalEnableLogging: string | undefined;

  const createAgent = () => {
    const agent = new ChatAgent({
      name: 'Test Agent',
      instructions: 'Validating file edit tool through the agent API.',
      provider: 'openai-generic',
    });

    agent.registerTool(fileEditTool);

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
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testFile, initialContent);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('edits the content of an existing file using ChatAgent.executeTool', async () => {
    const agent = createAgent();

    const result = await agent.executeTool('file_edit', {
      filePath: testFile,
      content: newContent,
    });

    expect(result).toBe(`? Conteúdo atualizado em: ${testFile}`);
    expect(fs.readFileSync(testFile, 'utf-8')).toBe(newContent);
  });

  it('returns an error message when the file does not exist', async () => {
    const agent = createAgent();
    const missingFile = path.join(testDir, 'missing.txt');

    const result = await agent.executeTool('file_edit', {
      filePath: missingFile,
      content: newContent,
    });

    expect(result).toBe(`? Arquivo não encontrado: ${missingFile} (verifique uso de "/" ou "\\")`);
    expect(fs.existsSync(missingFile)).toBe(false);
    expect(fs.readFileSync(testFile, 'utf-8')).toBe(initialContent);
  });
});

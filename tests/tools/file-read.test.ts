import { ChatAgent, Tool } from '@ericnunes/frame_agent';
import { fileReadTool } from '../../src/tools/file-read';
import { fileEditTool } from '../../src/tools/file-edit';
import * as fs from 'fs';
import * as path from 'path';

describe('fileReadTool via ChatAgent API', () => {
  const testDir = path.join(__dirname, 'file-read-test-data');
  const testFile = path.join(testDir, 'test.txt');
  const initialContent = 'Hello, world!';
  let originalApiKey: string | undefined;
  let originalEnableLogging: string | undefined;

  const createAgent = (...tools: Tool[]) => {
    const agent = new ChatAgent({
      name: 'Test Agent',
      instructions: 'Validating file tools through the agent API.',
      provider: 'openai-generic',
    });

    tools.forEach((tool) => agent.registerTool(tool));

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

  it('reads the content of an existing file using ChatAgent.executeTool', async () => {
    const agent = createAgent(fileReadTool);

    const result = await agent.executeTool('file_read', { filePath: testFile });

    expect(result).toBe(initialContent);
  });

  it('reflects updates applied by the file_edit tool', async () => {
    const updatedContent = 'Updated content via edit tool';
    const agent = createAgent(fileReadTool, fileEditTool);

    const editResult = await agent.executeTool('file_edit', {
      filePath: testFile,
      content: updatedContent,
    });
    expect(editResult).toBe(`? Conteúdo atualizado em: ${testFile}`);

    const readResult = await agent.executeTool('file_read', { filePath: testFile });

    expect(readResult).toBe(updatedContent);
  });

  it('returns an error message when the file does not exist', async () => {
    const agent = createAgent(fileReadTool);
    const missingFile = path.join(testDir, 'missing.txt');

    const result = await agent.executeTool('file_read', { filePath: missingFile });

    expect(result).toBe(`? Arquivo não encontrado: ${missingFile} (verifique uso de "/" ou "\\")`);
  });
});

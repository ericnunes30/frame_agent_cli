import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from '../../src/utils/config-loader';

// Mock dependencies
jest.mock('dotenv');
jest.mock('fs');
jest.mock('path');

describe('loadConfig', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const mockPath = path as jest.Mocked<typeof path>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock process.env
    process.env = {};

    // Mock path.join
    mockPath.join.mockImplementation((...paths) => paths.join('/'));

    // Mock fs.readFileSync for system_prompt.md
    mockFs.readFileSync.mockImplementation((filePath) => {
      if (filePath.toString().endsWith('system_prompt.md')) {
        return 'Você é um assistente útil que ajuda os usuários através da linha de comando.';
      }
      if(filePath.toString().endsWith('.frame-agent-config.json')) {
        return JSON.stringify({
          name: 'Custom Agent',
          provider: 'custom-provider',
          temperature: 0.9,
        });
      }
      return ''
    });
  });

  it('should return default config when no environment variables or file config', async () => {
    mockFs.existsSync.mockReturnValue(false);
    
    const config = await loadConfig();
    
    expect(config).toEqual({
      name: 'Frame Agent CLI',
      instructions: 'Você é um assistente útil que ajuda os usuários através da linha de comando.',
      provider: 'openai-generic',
      temperature: 0.7,
      maxTokens: 4096,
    });
  });

  it('should override config with environment variables', async () => {
    process.env['PROVIDER'] = 'anthropic-claude-3';
    process.env['TEMPERATURE'] = '0.8';
    process.env['MAX_TOKENS'] = '1500';
    mockFs.existsSync.mockReturnValue(false);
    
    const config = await loadConfig();
    
    expect(config).toEqual({
      name: 'Frame Agent CLI',
      instructions: 'Você é um assistente útil que ajuda os usuários através da linha de comando.',
      provider: 'anthropic-claude-3',
      temperature: 0.8,
      maxTokens: 1500,
    });
  });

  it('should load config from file when it exists', async () => {
    mockFs.existsSync.mockReturnValue(true);
    
    const config = await loadConfig();
    
    expect(config).toEqual({
      name: 'Custom Agent',
      instructions: 'Você é um assistente útil que ajuda os usuários através da linha de comando.',
      provider: 'custom-provider',
      temperature: 0.9,
      maxTokens: 4096,
    });
  });

  it('should prioritize file config over environment variables', async () => {
    process.env['PROVIDER'] = 'env-provider';
    process.env['TEMPERATURE'] = '0.5';
    
    mockFs.existsSync.mockReturnValue(true);
    
    const config = await loadConfig();
    
    expect(config).toEqual({
      name: 'Custom Agent',
      instructions: 'Você é um assistente útil que ajuda os usuários através da linha de comando.',
      provider: 'custom-provider',  // from file
      temperature: 0.9,           // from file
      maxTokens: 4096,
    });
  });

  it('should handle file read errors gracefully', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error('File read error');
    });
    
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const config = await loadConfig();
    
    expect(config).toEqual({
      name: 'Frame Agent CLI',
      instructions: 'Você é um assistente útil que ajuda os usuários através da linha de comando.',
      provider: 'openai-generic',
      temperature: 0.7,
      maxTokens: 4096,
    });
    
    expect(consoleWarnSpy).toHaveBeenCalledWith('Erro ao ler arquivo de configuração:', expect.any(Error));
    
    consoleWarnSpy.mockRestore();
  });

  it('should handle invalid JSON in config file', async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation((filePath) => {
      if (filePath.toString().endsWith('.frame-agent-config.json')) {
        return 'invalid json';
      }
      return 'Você é um assistente útil que ajuda os usuários através da linha de comando.';
    });
    
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const config = await loadConfig();
    
    expect(config).toEqual({
      name: 'Frame Agent CLI',
      instructions: 'Você é um assistente útil que ajuda os usuários através da linha de comando.',
      provider: 'openai-generic',
      temperature: 0.7,
      maxTokens: 4096,
    });
    
    expect(consoleWarnSpy).toHaveBeenCalledWith('Erro ao ler arquivo de configuração:', expect.any(SyntaxError));
    
    consoleWarnSpy.mockRestore();
  });
});
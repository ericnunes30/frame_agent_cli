import { program } from '../src/cli';

describe('CLI', () => {
  it('should create a program with correct name and version', () => {
    expect(program.name()).toBe('frame-agent');
    // Version should be set from package.json
    expect(program.version()).toBeDefined();
  });

  it('should register all command modules', () => {
    const commands = program.commands;
    
    expect(commands).toHaveLength(5);
    
    const commandNames = commands.map(cmd => cmd.name());
    expect(commandNames).toContain('chat');
    expect(commandNames).toContain('config');
    expect(commandNames).toContain('plan');
    expect(commandNames).toContain('react');
    expect(commandNames).toContain('tools');
  });
});
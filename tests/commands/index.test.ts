import * as commands from '../../src/core/index';

describe('commands/index', () => {
  it('should export all command modules', () => {
    expect(commands).toHaveProperty('chatCommand');
    expect(commands).toHaveProperty('configCommand');
    expect(commands).toHaveProperty('planningCommand');
    expect(commands).toHaveProperty('reactCommand');
    expect(commands).toHaveProperty('toolsCommand');
  });
});
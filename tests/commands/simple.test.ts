import { program } from '../../src/cli';

describe('simple chat command test', () => {
  it('should execute the chat command without errors', async () => {
    process.argv = ['node', 'index.js', 'chat'];
    await program.parseAsync(process.argv);
  });
});
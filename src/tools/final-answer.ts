import * as v from 'valibot';

export const finalAnswerTool = {
  name: 'final_answer',
  description: 'Fornece uma resposta final ao usuário e encerra a interação',
  parameters: v.object({
    response: v.string('Resposta final para o usuário')
  }),
  execute: async (args: { response: string }) => {
    return { response: args.response };
  }
};
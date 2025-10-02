export interface ToolError {
  error: true;
  message: string;
  code?: string;
  details?: any;
}

export function createError(message: string, code?: string, details?: any): ToolError {
  return {
    error: true,
    message,
    code,
    details
  };
}

export function isToolError(obj: any): obj is ToolError {
  return obj && typeof obj === 'object' && obj.error === true && typeof obj.message === 'string';
}

export function formatError(error: any): ToolError {
  if (isToolError(error)) {
    return error;
  }
  
  const message = error?.message ?? 'Ocorreu um erro desconhecido';
  const code = error?.code ?? 'UNKNOWN_ERROR';
  
  return createError(message, code, error);
}
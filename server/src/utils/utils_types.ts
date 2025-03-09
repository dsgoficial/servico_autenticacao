// Path: utils\utils_types.ts
export interface ErrorTrace {
  message?: string;
  stack?: string;
  [key: string]: any;
}

export interface JsonResponse {
  version: string;
  success: boolean;
  message: string;
  dados?: any;
  [key: string]: any;
}

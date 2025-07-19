import { LLMIdentifier } from '@dtos/dto-types';

export const modelNames: Record<LLMIdentifier, string> = {
  GPT_3_5_TURBO: 'GPT-3.5 Turbo (OpenAI)',
  GPT_4o_MINI: 'GPT-4o Mini (OpenAI)',
  SONNET_4: 'Claude Sonnet 4 (Anthropic)',
  GEMINI_2_5_FLASH: 'Gemini 2.5 Flash (Google)',
};

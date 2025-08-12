/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type MessageSource = "SYSTEM" | "USER" | "MODEL";
export type Agent = "USER" | "AI";
/**
 * Enum representing different formalisms for regulation fragments.
 */
export type Formalism = "PROLOG";
/**
 * Enum representing different LLM identifiers.
 */
export type LLMIdentifier =
  | "GPT_3_5_TURBO"
  | "GPT_4o_MINI"
  | "GPT_5"
  | "GPT_5_MINI"
  | "GPT_5_NANO"
  | "SONNET_4"
  | "GEMINI_2_5_FLASH";
/**
 * Enum representing different formalisms for regulation fragments.
 */
export type Formalism1 = "PROLOG";

/**
 * Data Transfer Object for an agentic log.
 *
 * id: Unique identifier for the log
 * user_prompt: The prompt issued by the human user
 * system_prompt: Optional prompt issued from the application
 * message_source: The source of the message (USER, SYSTEM, MODEL)
 * regulation_fragment_id: ID of the regulation fragment this log is associated with
 * created_at: When the log was created
 * is_error: Whether this log entry represents an error message
 */
export interface AgenticLogDTO {
  id: number;
  user_prompt: string;
  system_prompt?: string | null;
  message_source: MessageSource;
  regulation_fragment_id: number;
  created_at: string;
  is_error?: boolean;
}
export interface AtomDTO {
  id: number;
  regulation_fragment_id: number;
  predicate: string;
  description: string;
  is_negated: boolean;
  is_fact: boolean;
  spans: AtomSpanDTO[];
}
export interface AtomSpanDTO {
  id: number;
  atom_id: number;
  start: number;
  end: number;
}
export interface ChatMessageDTO {
  id: number;
  created_at: string;
  content: string;
  agent: Agent;
}
export interface CreateAtomDTO {
  regulation_fragment_id: number;
  predicate: string;
  description: string;
  is_negated: boolean;
  is_fact: boolean;
}
export interface CreateChatMessageDTO {
  content: string;
}
export interface CreateRegulationFragmentDTO {
  title: string;
  content: string;
  source?: string | null;
  llm_identifier: string;
  formalism?: Formalism;
  used_tokens_in?: number;
  used_tokens_out?: number;
}
export interface CreateRuleDTO {
  regulation_fragment_id: number;
  description: string;
  definition: string;
  is_goal?: boolean;
}
export interface PrologAnswerDTO {
  status: "success" | "failure" | "error";
  answers: PrologResultDTO[];
  message?: string;
}
export interface PrologResultDTO {
  variable: string;
  value: string;
}
export interface PrologHttpResponseDTO {
  status: "success" | "failure" | "error";
  answers: PrologAnswerDTO[];
}
export interface PrologQueryDTO {
  facts: string;
}
export interface RegenerateAtomsDTO {
  feedback: string;
}
export interface RegenerateRulesDTO {
  feedback: string;
}
export interface RegulationFragmentDTO {
  id: number;
  title: string;
  content: string;
  created_at: string;
  source?: string | null;
  llm_identifier: LLMIdentifier;
  formalism?: Formalism1;
  used_tokens_in?: number;
  used_tokens_out?: number;
}
export interface RuleDTO {
  id: number;
  regulation_fragment_id: number;
  description: string;
  definition: string;
  is_goal: boolean;
  created_at: string;
}
export interface UpdateAtomDTO {
  predicate: string | null;
  description?: string | null;
  is_negated?: boolean | null;
  is_fact?: boolean | null;
}
export interface UpdateRuleDTO {
  description?: string | null;
  definition?: string | null;
  is_goal?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

/**
 * Data Transfer Object for an agentic log.
 *
 * id: Unique identifier for the log
 * user_prompt: The prompt issued by the human user
 * system_prompt: Optional prompt issued from the application
 * message_source: The source of the message (USER, SYSTEM, MODEL)
 * regulation_fragment_id: ID of the regulation fragment this log is associated with
 * created_at: When the log was created
 */
export interface AgenticLogDTO {
  id: number;
  user_prompt: string;
  system_prompt?: string | null;
  message_source: string;
  regulation_fragment_id: number;
  created_at: string;
}
export interface AtomDTO {
  id: number;
  regulation_fragment_id: number;
  predicate: string;
  description: string;
  is_negated: boolean;
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
  message: string;
}
export interface CreateAtomDTO {
  regulation_fragment_id: number;
  predicate: string;
  description: string;
  is_negated: boolean;
}
export interface CreateChatMessageDTO {
  content: string;
}
export interface CreateRegulationFragmentDTO {
  title: string;
  content: string;
}
export interface RegulationFragmentDTO {
  id: number;
  title: string;
  content: string;
  created_at: string;
}
export interface UpdateAtomDTO {
  description: string;
}

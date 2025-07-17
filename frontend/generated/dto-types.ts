/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface AtomDTO {
  id: number;
  regulation_fragment_id: number;
  name: string;
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
  name: string;
  description: string;
  is_negated?: boolean;
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

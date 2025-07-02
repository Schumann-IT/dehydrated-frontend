import { ModelDomainEntry } from "./client/src";

export interface Domain extends ModelDomainEntry {
  id: string; // using domains as id
}

export interface RaDomain {
  id?: string;
  alias?: string;
  alternativeNames?: Array<{ name: string }>;
  comment?: string;
  domain?: string;
  enabled?: boolean;
}

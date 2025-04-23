import { BaseRecord } from "../registry";
import { ModelDomainEntry } from "./client";

export interface Domain extends BaseRecord, ModelDomainEntry {
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

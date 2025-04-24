import { Domain } from "./types.ts";
import { ModelDomainEntry } from "./client";

export function transformElement(entry: ModelDomainEntry): Domain {
  return {
    ...entry,
    id: entry.domain || "",
    enabled: entry.enabled ?? true,
    alternativeNames: entry.alternativeNames || [],
    comment: entry.comment || "",
    alias: entry.alias || "",
    metadata: entry.metadata || {},
  };
}

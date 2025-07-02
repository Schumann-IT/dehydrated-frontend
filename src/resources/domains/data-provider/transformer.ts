import { Domain } from "./types.ts";
import { ModelDomainEntry } from "./client";

export function transformElement(entry: ModelDomainEntry): Domain {
  // Create a unique ID using domain#alias format
  // For non-alias entries, use domain# format
  const uniqueId = entry.alias ? `${entry.domain}#${entry.alias}` : `${entry.domain}#`;
  
  return {
    ...entry,
    // Use the unique ID for React-Admin identification
    id: uniqueId,
    enabled: entry.enabled ?? true,
    alternativeNames: entry.alternativeNames || [],
    comment: entry.comment || "",
    alias: entry.alias || "",
    metadata: entry.metadata || {},
  };
}

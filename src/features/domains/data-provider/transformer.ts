import { Domain, RaDomain } from "./types.ts";
import {
  ModelDomainEntry,
  ModelDomainResponse,
  ModelCreateDomainRequest,
  ModelUpdateDomainRequest,
} from "./client";
import { CreateParams, UpdateParams } from "react-admin";

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

export function transformAlternativeNamesEntry(entry: Domain): RaDomain {
  const altNames = entry.alternativeNames?.map(
    (elem: string): { name: string } => {
      return { name: elem };
    },
  );

  return {
    id: entry.id,
    domain: entry.domain,
    alternativeNames: altNames,
    enabled: entry.enabled,
    alias: entry.alias,
  };
}

export function transformAlternativeNamesRa(entry: RaDomain): Domain {
  const altNames = entry.alternativeNames?.map(
    (o: { name: string }): string => {
      return o.name;
    },
  );
  return {
    id: entry.id as string,
    domain: entry.domain,
    alternativeNames: altNames,
    enabled: entry.enabled,
    alias: entry.alias,
  };
}

export function createRequest(params: CreateParams): ModelCreateDomainRequest {
  return {
    domain: params.data.domain,
    enabled: params.data.enabled,
    comment: params.data.comment,
    alternativeNames: params.data.alternativeNames,
    alias: params.data.alias,
  };
}

export function createResponse(
  request: ModelCreateDomainRequest,
): ModelDomainResponse {
  return {
    data: {
      domain: request.domain,
      enabled: request.enabled,
      comment: request.comment,
      alternativeNames: request.alternativeNames,
      alias: request.alias,
      metadata: {},
    },
    success: true,
  };
}

export function createUpdateRequest(
  params: UpdateParams,
): ModelUpdateDomainRequest {
  return {
    enabled: params.data.enabled,
    comment: params.data.comment,
    alternativeNames: params.data.alternativeNames,
    alias: params.data.alias,
  };
}

export function createUpdateResponse(
  request: ModelUpdateDomainRequest,
  domain: string,
): ModelDomainResponse {
  return {
    data: {
      domain: domain,
      enabled: request.enabled,
      comment: request.comment,
      alternativeNames: request.alternativeNames,
      alias: request.alias,
      metadata: {},
    },
    success: true,
  };
} 
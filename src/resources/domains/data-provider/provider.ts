import {
  CreateParams,
  DataProvider,
  DeleteManyParams,
  DeleteParams,
  GetListParams,
  GetOneParams,
  Identifier,
  RaRecord,
  UpdateManyParams,
  UpdateParams,
} from "react-admin";
import { Domain } from "./types.ts";
import { transformElement } from "./transformer.ts";
import {
  DomainsApi,
  Configuration,
  ModelUpdateDomainRequest,
  ModelCreateDomainRequest,
} from "./client";
import { IPublicClientApplication } from "@azure/msal-browser";

// Create a function to get the API client with the given token
const getApiClient = (token: string | null) => {
  const config = new Configuration({
    basePath: import.meta.env.VITE_API_BASE_URL,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return new DomainsApi(config);
};

// Create a provider factory that takes an optional MSAL object
export const create = (
  msalInstance?: IPublicClientApplication,
): Partial<DataProvider> => {
  // Function to get the current token
  const getToken = async (): Promise<string | null> => {
    if (!msalInstance) {
      return null;
    }

    try {
      const account = msalInstance.getAllAccounts()[0];
      if (!account) {
        return null;
      }

      const apiIdentifier = import.meta.env.VITE_DEHYDRATED_API_IDENTIFIER;

      // Format the API scope correctly
      const apiScope = apiIdentifier.endsWith("/")
        ? apiIdentifier
        : `${apiIdentifier}/`;

      const response = await msalInstance.acquireTokenSilent({
        scopes: [`${apiScope}access_as_user`],
        account,
      });

      return response.accessToken;
    } catch (error) {
      console.error("Error acquiring token:", error);
      return null;
    }
  };

  return {
    getList: async <RecordType extends RaRecord = Domain>(
      _resource: string,
      params: GetListParams,
    ) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field = "id", order = "ASC" } = params.sort || {};
      const { q: searchTerm } = params.filter || {};

      // Get the current token
      const token = await getToken();

      // Get domains from the API using the client with current token
      const api = getApiClient(token);
      const response = await api.apiV1DomainsGet();

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch domains");
      }

      // Transform API response to Domain records
      let data = response.data.map(transformElement);

      // Apply search filter if search term is provided
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        data = data.filter((record: any) => {
          return (
            (record.domain &&
              record.domain.toLowerCase().includes(searchLower)) ||
            (record.alias &&
              record.alias.toLowerCase().includes(searchLower)) ||
            (record.comment &&
              record.comment.toLowerCase().includes(searchLower))
          );
        });
      }

      // Sort data
      data.sort((a: Domain, b: Domain) => {
        if (order === "ASC") {
          return (a[field as keyof Domain] ?? "") >
            (b[field as keyof Domain] ?? "")
            ? 1
            : -1;
        }
        return (a[field as keyof Domain] ?? "") <
          (b[field as keyof Domain] ?? "")
          ? 1
          : -1;
      });

      // Apply pagination to all results (both search and non-search)
      const start = (page - 1) * perPage;
      const end = start + perPage;

      return {
        data: data.slice(start, end) as unknown as RecordType[],
        total: data.length,
      };
    },

    getOne: async <RecordType extends RaRecord = Domain>(
      _resource: string,
      params: GetOneParams,
    ) => {
      const token = await getToken();
      const api = getApiClient(token);

      // Parse the ID to extract domain and alias
      // The ID format could be:
      // 1. domain#alias (encoded as domain%23alias)
      // 2. domain?alias=alias (new format)
      let domainIdentifier: string;
      let aliasParam: string | undefined;

      const decodedId = decodeURIComponent(params.id as string);

      // Check if it's the new format (domain?alias=alias)
      if (decodedId.includes("?")) {
        const [domain, queryString] = decodedId.split("?");
        domainIdentifier = domain;

        // Parse query parameters
        const urlParams = new URLSearchParams(queryString);
        aliasParam = urlParams.get("alias") || undefined;
      } else {
        // Old format: domain#alias
        if (decodedId.includes("#")) {
          const [domain, alias] = decodedId.split("#");
          domainIdentifier = domain;
          aliasParam = alias || undefined;
        } else {
          // Just domain
          domainIdentifier = decodedId;
          aliasParam = undefined;
        }
      }

      // Use the new API client with alias support
      const response = await api.apiV1DomainsDomainGet({
        domain: domainIdentifier,
        alias: aliasParam,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.error ||
            `Record not found: domains/${domainIdentifier}${aliasParam ? `?alias=${aliasParam}` : ""}`,
        );
      }

      // Transform API response to Domain record
      const transformedRecord = transformElement(response.data);
      transformedRecord.id = decodedId;
      return { data: transformedRecord as unknown as RecordType };
    },

    create: async <RecordType extends RaRecord = Domain>(
      _resource: string,
      params: CreateParams,
    ) => {
      // Validate that we have a domain field
      if (!params.data.domain) {
        throw new Error("Domain field is required");
      }

      const token = await getToken();
      const api = getApiClient(token);
      const response = await api.apiV1DomainsPost({
        request: params.data as unknown as ModelCreateDomainRequest,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create domain");
      }

      // Transform API response to Domain record
      const newRecord = transformElement(response.data);
      return { data: newRecord as unknown as RecordType };
    },

    update: async <RecordType extends RaRecord = Domain>(
      _resource: string,
      params: UpdateParams,
    ) => {
      const token = await getToken();
      const api = getApiClient(token);

      // Parse the ID to extract domain and alias
      // The ID format could be:
      // 1. domain#alias (encoded as domain%23alias)
      // 2. domain?alias=alias (new format)
      let domainIdentifier: string;
      let aliasParam: string | undefined;

      const decodedId = decodeURIComponent(params.id as string);

      // Check if it's the new format (domain?alias=alias)
      if (decodedId.includes("?")) {
        const [domain, queryString] = decodedId.split("?");
        domainIdentifier = domain;

        // Parse query parameters
        const urlParams = new URLSearchParams(queryString);
        aliasParam = urlParams.get("alias") || undefined;
      } else {
        // Old format: domain#alias
        if (decodedId.includes("#")) {
          const [domain, alias] = decodedId.split("#");
          domainIdentifier = domain;
          aliasParam = alias || undefined;
        } else {
          // Just domain
          domainIdentifier = decodedId;
          aliasParam = undefined;
        }
      }

      // Prepare the request body
      const requestBody = {
        enabled: params.data.enabled,
        comment: params.data.comment,
        alternativeNames: params.data.alternativeNames,
        // Note: domain and alias are not included in update request as they are readonly
      };

      // Use the new API client with alias support
      const response = await api.apiV1DomainsDomainPut({
        domain: domainIdentifier,
        alias: aliasParam,
        request: requestBody,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.error ||
            `Failed to update domain: ${domainIdentifier}${aliasParam ? `?alias=${aliasParam}` : ""}`,
        );
      }

      // Transform API response to Domain record
      const updatedRecord = transformElement(response.data);
      return { data: updatedRecord as unknown as RecordType };
    },

    delete: async <RecordType extends RaRecord = Domain>(
      _resource: string,
      params: DeleteParams,
    ) => {
      try {
        const token = await getToken();
        const api = getApiClient(token);

        // Parse the ID to extract domain and alias
        // The ID format could be:
        // 1. domain#alias (encoded as domain%23alias)
        // 2. domain?alias=alias (new format)
        let domainIdentifier: string;
        let aliasParam: string | undefined;

        const decodedId = decodeURIComponent(params.id as string);

        // Check if it's the new format (domain?alias=alias)
        if (decodedId.includes("?")) {
          const [domain, queryString] = decodedId.split("?");
          domainIdentifier = domain;

          // Parse query parameters
          const urlParams = new URLSearchParams(queryString);
          aliasParam = urlParams.get("alias") || undefined;
        } else {
          // Old format: domain#alias
          if (decodedId.includes("#")) {
            const [domain, alias] = decodedId.split("#");
            domainIdentifier = domain;
            aliasParam = alias || undefined;
          } else {
            // Just domain
            domainIdentifier = decodedId;
            aliasParam = undefined;
          }
        }

        // Use the new API client with alias support
        await api.apiV1DomainsDomainDelete({
          domain: domainIdentifier,
          alias: aliasParam,
        });

        // Return the deleted record ID as required by React-Admin
        return { data: { id: params.id } as unknown as RecordType };
      } catch (error) {
        throw new Error(`Failed to delete domain: ${params.id}: ${error}`);
      }
    },

    deleteMany: async (_resource: string, params: DeleteManyParams) => {
      // Store successfully deleted IDs
      const deletedIds: Identifier[] = [];

      const token = await getToken();
      const api = getApiClient(token);

      // First, get all domains to map IDs to domains
      const allDomainsResponse = await api.apiV1DomainsGet();
      if (!allDomainsResponse.success || !allDomainsResponse.data) {
        throw new Error("Failed to fetch domains");
      }

      // Create a mapping from ID to domain and alias
      const idToRecordMap = new Map<
        string,
        { domain: string; alias?: string }
      >();
      allDomainsResponse.data.forEach((entry: any) => {
        const transformed = transformElement(entry);
        idToRecordMap.set(transformed.id, {
          domain: entry.domain || "",
          alias: entry.alias || undefined,
        });
        // Also map the original domain and alias for backward compatibility
        if (entry.domain) {
          idToRecordMap.set(entry.domain, {
            domain: entry.domain,
            alias: entry.alias || undefined,
          });
        }
        if (entry.alias) {
          idToRecordMap.set(entry.alias, {
            domain: entry.domain || "",
            alias: entry.alias,
          });
        }
      });

      // Process each ID sequentially
      for (const id of params.ids) {
        try {
          // Decode the ID to handle URL encoding (e.g., %23 -> #)
          const decodedId = decodeURIComponent(id as string);

          const recordInfo = idToRecordMap.get(decodedId);
          if (!recordInfo || !recordInfo.domain) {
            console.warn(`Could not find domain for ID: ${decodedId}`);
            continue;
          }

          await api.apiV1DomainsDomainDelete({
            domain: recordInfo.domain,
            alias: recordInfo.alias,
          });
          deletedIds.push(id);
        } catch (error) {
          // Skip if the record doesn't exist
          console.warn(`Failed to delete domain ${id}:`, error);
        }
      }

      // Return the IDs of successfully deleted records
      return { data: deletedIds };
    },

    updateMany: async <RecordType extends RaRecord = Domain>(
      _resource: string,
      params: UpdateManyParams,
    ) => {
      const token = await getToken();
      const api = getApiClient(token);

      const updated: RecordType[] = [];

      // First, get all domains to map IDs to domains
      const allDomainsResponse = await api.apiV1DomainsGet();
      if (!allDomainsResponse.success || !allDomainsResponse.data) {
        throw new Error("Failed to fetch domains");
      }

      // Create a mapping from ID to domain and alias
      const idToRecordMap = new Map<
        string,
        { domain: string; alias?: string }
      >();
      allDomainsResponse.data.forEach((entry: any) => {
        const transformed = transformElement(entry);
        idToRecordMap.set(transformed.id, {
          domain: entry.domain || "",
          alias: entry.alias || undefined,
        });
        // Also map the original domain and alias for backward compatibility
        if (entry.domain) {
          idToRecordMap.set(entry.domain, {
            domain: entry.domain,
            alias: entry.alias || undefined,
          });
        }
        if (entry.alias) {
          idToRecordMap.set(entry.alias, {
            domain: entry.domain || "",
            alias: entry.alias,
          });
        }
      });

      // Process each ID sequentially
      for (const id of params.ids) {
        try {
          // Decode the ID to handle URL encoding (e.g., %23 -> #)
          const decodedId = decodeURIComponent(id as string);

          const recordInfo = idToRecordMap.get(decodedId);
          if (!recordInfo || !recordInfo.domain) {
            console.warn(`Could not find domain for ID: ${decodedId}`);
            continue;
          }

          const update = await api.apiV1DomainsDomainPut({
            domain: recordInfo.domain,
            alias: recordInfo.alias,
            request: {
              enabled: params.data.enabled,
              comment: params.data.comment,
              alternativeNames: params.data.alternativeNames,
              // Note: domain and alias are not included in update request as they are readonly
            } as unknown as ModelUpdateDomainRequest,
          });

          if (update.success && update.data) {
            updated.push(
              transformElement(update.data) as unknown as RecordType,
            );
          }
        } catch (error) {
          // Skip if the record doesn't exist
          console.warn(`Failed to update domain ${id}:`, error);
        }
      }

      return { data: updated.map((record) => record.id) as RecordType["id"][] };
    },
  };
};

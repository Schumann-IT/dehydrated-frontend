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
  UpdateManyResult,
  UpdateParams,
} from "react-admin";
import { Domain } from "./types";
import { transformElement } from "./transformer";
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
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return new DomainsApi(config);
};

// Create a provider factory that takes an optional MSAL object
export const createProvider = (
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

      // Get the current token
      const token = await getToken();

      // Get domains from the API using the client with current token
      const api = getApiClient(token);
      const response = await api.apiV1DomainsGet();

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch domains");
      }

      // Transform API response to Domain records
      const data = response.data.map(transformElement);

      // Sort data
      data.sort((a, b) => {
        if (order === "ASC") {
          return a[field] > b[field] ? 1 : -1;
        }
        return a[field] < b[field] ? 1 : -1;
      });

      // Paginate data
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
      const response = await api.apiV1DomainsDomainGet({
        domain: params.id as string,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.error || `Record not found: domains/${params.id}`,
        );
      }

      // Transform API response to Domain record
      const transformedRecord = transformElement(response.data);

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
      const response = await api.apiV1DomainsDomainPut({
        domain: params.id as string,
        request: {
          enabled: params.data.enabled,
          comment: params.data.comment,
          alternativeNames: params.data.alternativeNames,
          alias: params.data.alias,
        },
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.error || `Failed to update domain: ${params.id}`,
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
        await api.apiV1DomainsDomainDelete({ domain: params.id as string });
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

      // Process each ID sequentially
      for (const id of params.ids) {
        try {
          await api.apiV1DomainsDomainDelete({ domain: id as string });
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

      // Process each ID sequentially
      for (const id of params.ids) {
        try {
          const update = await api.apiV1DomainsDomainPut({
            domain: id as string,
            request: params.data as unknown as ModelUpdateDomainRequest,
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

      return { data: updated } as unknown as UpdateManyResult<RecordType>;
    },
  };
};

import { DataProvider, RaRecord, Identifier } from "react-admin";
import {
  ModelDomainEntry,
  ModelDomainsResponse,
  ModelDomainResponse,
  ModelCreateDomainRequest,
  ModelUpdateDomainRequest,
} from "./api-client";

// Define types for our mock data that extend RaRecord
interface Domain extends RaRecord, ModelDomainEntry {
  // The id field is required by RaRecord and must be a string
  // We'll use the domain field as the id
  id: string;
}

type ResourceType = "domains";
type ResourceData = Domain;

// Helper function to create a domain with id set to domain field
function createDomain(domainData: Omit<Domain, "id">): Domain {
  return {
    ...domainData,
    id: domainData.domain || "",
  };
}

// Helper function to transform ModelDomainEntry to Domain
function transformDomainEntry(entry: ModelDomainEntry): Domain {
  return createDomain({
    ...entry,
    // Ensure all required fields have default values
    domain: entry.domain || "",
    enabled: entry.enabled ?? true,
    alternativeNames: entry.alternativeNames || [],
    comment: entry.comment || "",
    alias: entry.alias || "",
    metadata: entry.metadata || {},
  });
}

// Mock data with proper typing
const mockData: Record<ResourceType, ResourceData[]> = {
  domains: [
    createDomain({
      domain: "example.com",
      enabled: true,
      comment: "Example domain",
      alternativeNames: ["www.example.com"],
      alias: "example",
    }),
    createDomain({
      domain: "test.com",
      enabled: false,
      comment: "Test domain",
      alternativeNames: ["www.test.com"],
      alias: "test",
    }),
  ],
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    await delay(300);
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = "id", order = "ASC" } = params.sort || {};

    // Simulate API response with ModelDomainsResponse structure
    const apiResponse: ModelDomainsResponse = {
      data: mockData[resource as ResourceType].map((domain) => ({
        domain: domain.domain,
        enabled: domain.enabled,
        comment: domain.comment,
        alternativeNames: domain.alternativeNames,
        alias: domain.alias,
        metadata: domain.metadata,
      })),
      success: true,
    };

    // Transform API response to Domain records
    const data = apiResponse.data?.map(transformDomainEntry) || [];

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

  getOne: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    await delay(300);
    const record = mockData[resource as ResourceType].find(
      (item) => item.id === params.id,
    );

    if (!record) {
      throw new Error(`Record not found: ${resource}/${params.id}`);
    }

    // Simulate API response with ModelDomainResponse structure
    const apiResponse: ModelDomainResponse = {
      data: {
        domain: record.domain,
        enabled: record.enabled,
        comment: record.comment,
        alternativeNames: record.alternativeNames,
        alias: record.alias,
        metadata: record.metadata,
      },
      success: true,
    };

    // Transform API response to Domain record
    if (apiResponse.data) {
      const transformedRecord = transformDomainEntry(apiResponse.data);
      return { data: transformedRecord as unknown as RecordType };
    } else {
      throw new Error(`No data returned for: ${resource}/${params.id}`);
    }
  },

  getMany: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    throw new Error("getMany is not supported by this API");
  },

  getManyReference: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    throw new Error("getManyReference is not supported by this API");
  },

  create: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    await delay(300);

    // Validate that we have a domain field
    if (!params.data.domain) {
      throw new Error("Domain field is required");
    }

    // Create a ModelCreateDomainRequest from the params
    const createRequest: ModelCreateDomainRequest = {
      domain: params.data.domain,
      enabled: params.data.enabled,
      comment: params.data.comment,
      alternativeNames: params.data.alternativeNames,
      alias: params.data.alias,
    };

    // Simulate API response with ModelDomainResponse structure
    const apiResponse: ModelDomainResponse = {
      data: {
        domain: createRequest.domain,
        enabled: createRequest.enabled,
        comment: createRequest.comment,
        alternativeNames: createRequest.alternativeNames,
        alias: createRequest.alias,
        metadata: {},
      },
      success: true,
    };

    // Transform API response to Domain record
    if (apiResponse.data) {
      const newRecord = transformDomainEntry(apiResponse.data);

      // Add to mock data
      mockData.domains.push(newRecord);

      return { data: newRecord as unknown as RecordType };
    } else {
      throw new Error("Failed to create domain: No data returned from API");
    }
  },

  update: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    await delay(300);
    const index = mockData[resource as ResourceType].findIndex(
      (item) => item.id === params.id,
    );
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`);
    }

    // Create a ModelUpdateDomainRequest from the params
    const updateRequest: ModelUpdateDomainRequest = {
      enabled: params.data.enabled,
      comment: params.data.comment,
      alternativeNames: params.data.alternativeNames,
      alias: params.data.alias,
    };

    // Simulate API response with ModelDomainResponse structure
    const apiResponse: ModelDomainResponse = {
      data: {
        domain: params.id, // Keep the original domain as id
        enabled: updateRequest.enabled,
        comment: updateRequest.comment,
        alternativeNames: updateRequest.alternativeNames,
        alias: updateRequest.alias,
        metadata: mockData[resource as ResourceType][index].metadata || {},
      },
      success: true,
    };

    // Transform API response to Domain record
    if (apiResponse.data) {
      const updatedRecord = transformDomainEntry(apiResponse.data);

      // Update mock data
      mockData[resource as ResourceType][index] = updatedRecord;

      return { data: updatedRecord as unknown as RecordType };
    } else {
      throw new Error(`Failed to update domain: No data returned from API`);
    }
  },

  updateMany: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    throw new Error("updateMany is not supported by this API");
  },

  delete: async <RecordType extends RaRecord = ResourceData>(
    resource: string,
    params: any,
  ) => {
    await delay(300);
    const index = mockData[resource as ResourceType].findIndex(
      (item) => item.id === params.id,
    );
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`);
    }

    // Store the record before deletion for the return value
    const deleted = mockData[resource as ResourceType][index];

    // Remove the record from mock data
    mockData[resource as ResourceType].splice(index, 1);

    // Return the deleted record as required by React-Admin
    // The actual API returns an empty response, but React-Admin expects the deleted record
    return { data: deleted as unknown as RecordType };
  },

  deleteMany: async (resource: string, params: any) => {
    await delay(300);

    // Store successfully deleted IDs
    const deletedIds: Identifier[] = [];

    // Process each ID sequentially to simulate individual API calls
    for (const id of params.ids) {
      const index = mockData[resource as ResourceType].findIndex(
        (item) => item.id === id,
      );

      // Only delete if the record exists
      if (index !== -1) {
        mockData[resource as ResourceType].splice(index, 1);
        deletedIds.push(id);
      }
    }

    // Return the IDs of successfully deleted records
    return { data: deletedIds };
  },
};

import React, { useEffect, useState } from "react";
import { DataProvider, RaRecord } from "react-admin";

// Import provider factories
import { createProvider as createDomainsProvider } from "./domains/provider";
import { IPublicClientApplication } from "@azure/msal-browser";
import { myMSALObj } from "../auth-providers/msal";

// Define the base interface for all resources
export interface BaseRecord extends RaRecord {
  id: string;
}

// Create a combined data provider that routes requests to the appropriate provider
export const createCombinedProvider = (
  msalInstance?: IPublicClientApplication,
): DataProvider => {
  // Create all providers
  const providers: Record<string, Partial<DataProvider>> = msalInstance
    ? {
        domains: createDomainsProvider(msalInstance),
        // Add other providers here as needed
      }
    : {};

  // Create a combined provider that routes requests to the appropriate provider
  return {
    getList: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.getList) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support getList`,
        );
      }
      return provider.getList(resource, params);
    },
    getOne: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.getOne) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support getOne`,
        );
      }
      return provider.getOne(resource, params);
    },
    create: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.create) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support create`,
        );
      }
      return provider.create(resource, params);
    },
    update: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.update) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support update`,
        );
      }
      return provider.update(resource, params);
    },
    delete: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.delete) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support delete`,
        );
      }
      return provider.delete(resource, params);
    },
    deleteMany: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.deleteMany) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support deleteMany`,
        );
      }
      return provider.deleteMany(resource, params);
    },
    getMany: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.getMany) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support getMany`,
        );
      }
      return provider.getMany(resource, params);
    },
    getManyReference: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.getManyReference) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support getManyReference`,
        );
      }
      return provider.getManyReference(resource, params);
    },
    updateMany: async (resource, params) => {
      const provider = providers[resource];
      if (!provider || !provider.updateMany) {
        throw new Error(
          `Provider for resource '${resource}' not found or does not support updateMany`,
        );
      }
      return provider.updateMany(resource, params);
    },
  };
};

// Create a hook to get the combined provider
export const useDataProvider = (): DataProvider => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize MSAL
  useEffect(() => {
    const initializeMsal = async () => {
      if (isInitialized) {
        return;
      }

      try {
        await myMSALObj.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing MSAL:", error);
      }
    };

    initializeMsal();
  }, []);

  return React.useMemo(() => {
    return createCombinedProvider(myMSALObj);
  }, []);
};

vi.mock("@/resources/domains", () => ({
  createDomainsProvider: vi.fn(() => ({
    getList: vi.fn(),
    getOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    getMany: vi.fn(),
    getManyReference: vi.fn(),
    updateMany: vi.fn(),
  })),
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { dataProvider } from "../dataProvider";
import { createDomainsProvider } from "@/resources/domains";

describe("dataProvider", () => {
  let provider: ReturnType<typeof dataProvider>;
  let mockDomainsProvider: {
    getList: ReturnType<typeof vi.fn>;
    getOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
    getMany: ReturnType<typeof vi.fn>;
    getManyReference: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDomainsProvider = {
      getList: vi.fn(),
      getOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      getMany: vi.fn(),
      getManyReference: vi.fn(),
      updateMany: vi.fn(),
    };
    (createDomainsProvider as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDomainsProvider,
    );
    provider = dataProvider();
  });

  describe("getList", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: [], total: 0 };
      mockDomainsProvider.getList.mockResolvedValue(mockResponse);

      const result = await provider.getList("domains", {});

      expect(mockDomainsProvider.getList).toHaveBeenCalledWith("domains", {});
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(provider.getList("unknown", {})).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support getList",
      );
    });
  });

  describe("getOne", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: { id: 1, domain: "example.com" } };
      mockDomainsProvider.getOne.mockResolvedValue(mockResponse);

      const result = await provider.getOne("domains", { id: 1 });

      expect(mockDomainsProvider.getOne).toHaveBeenCalledWith("domains", {
        id: 1,
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(provider.getOne("unknown", { id: 1 })).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support getOne",
      );
    });
  });

  describe("create", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: { id: 1, domain: "example.com" } };
      mockDomainsProvider.create.mockResolvedValue(mockResponse);

      const result = await provider.create("domains", {
        data: { domain: "example.com" },
      });

      expect(mockDomainsProvider.create).toHaveBeenCalledWith("domains", {
        data: { domain: "example.com" },
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(provider.create("unknown", { data: {} })).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support create",
      );
    });
  });

  describe("update", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: { id: 1, domain: "example.com" } };
      mockDomainsProvider.update.mockResolvedValue(mockResponse);

      const result = await provider.update("domains", {
        id: 1,
        data: { domain: "example.com" },
        previousData: { id: 1, domain: "old.com" },
      });

      expect(mockDomainsProvider.update).toHaveBeenCalledWith("domains", {
        id: 1,
        data: { domain: "example.com" },
        previousData: { id: 1, domain: "old.com" },
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(
        provider.update("unknown", { id: 1, data: {}, previousData: {} }),
      ).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support update",
      );
    });
  });

  describe("delete", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: { id: 1 } };
      mockDomainsProvider.delete.mockResolvedValue(mockResponse);

      const result = await provider.delete("domains", { id: 1 });

      expect(mockDomainsProvider.delete).toHaveBeenCalledWith("domains", {
        id: 1,
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(provider.delete("unknown", { id: 1 })).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support delete",
      );
    });
  });

  describe("deleteMany", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: [1, 2, 3] };
      mockDomainsProvider.deleteMany.mockResolvedValue(mockResponse);

      const result = await provider.deleteMany("domains", { ids: [1, 2, 3] });

      expect(mockDomainsProvider.deleteMany).toHaveBeenCalledWith("domains", {
        ids: [1, 2, 3],
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(
        provider.deleteMany("unknown", { ids: [1, 2, 3] }),
      ).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support deleteMany",
      );
    });
  });

  describe("getMany", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: [{ id: 1 }, { id: 2 }] };
      mockDomainsProvider.getMany.mockResolvedValue(mockResponse);

      const result = await provider.getMany("domains", { ids: [1, 2] });

      expect(mockDomainsProvider.getMany).toHaveBeenCalledWith("domains", {
        ids: [1, 2],
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(
        provider.getMany("unknown", { ids: [1, 2] }),
      ).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support getMany",
      );
    });
  });

  describe("getManyReference", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: [], total: 0 };
      mockDomainsProvider.getManyReference.mockResolvedValue(mockResponse);

      const result = await provider.getManyReference("domains", {
        target: "parentId",
        id: 1,
        pagination: { page: 1, perPage: 10 },
        sort: { field: "id", order: "ASC" },
        filter: {},
      });

      expect(mockDomainsProvider.getManyReference).toHaveBeenCalledWith(
        "domains",
        {
          target: "parentId",
          id: 1,
          pagination: { page: 1, perPage: 10 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        },
      );
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(
        provider.getManyReference("unknown", {
          target: "parentId",
          id: 1,
          pagination: { page: 1, perPage: 10 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        }),
      ).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support getManyReference",
      );
    });
  });

  describe("updateMany", () => {
    it("should route to domains provider for domains resource", async () => {
      const mockResponse = { data: [1, 2, 3] };
      mockDomainsProvider.updateMany.mockResolvedValue(mockResponse);

      const result = await provider.updateMany("domains", {
        ids: [1, 2, 3],
        data: { enabled: true },
      });

      expect(mockDomainsProvider.updateMany).toHaveBeenCalledWith("domains", {
        ids: [1, 2, 3],
        data: { enabled: true },
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for unknown resource", async () => {
      await expect(
        provider.updateMany("unknown", { ids: [1, 2, 3], data: {} }),
      ).rejects.toThrow(
        "Provider for resource 'unknown' not found or does not support updateMany",
      );
    });
  });
});

# Alias Identification Changes

## Overview

This document tracks the changes made to support alias-based domain entry identification in the frontend application.

## Background

The backend API supports domain entries identified by domain names and optionally by aliases. The frontend needed to be updated to properly handle alias-based identification, including:

1. Displaying alias fields in the UI
2. Making API calls with alias query parameters
3. Ensuring CRUD operations work correctly for both alias and non-alias entries

## Changes Made

### 1. API Client Regeneration

- **Issue**: The generated API client did not include the `alias` query parameter in the request interfaces
- **Solution**: Regenerated the API client from the OpenAPI specification at `http://127.0.0.1:3000/docs/doc.json`
- **Result**: The new client includes proper alias support:
  - `ApiV1DomainsDomainDeleteRequest` includes `alias?: string`
  - `ApiV1DomainsDomainGetRequest` includes `alias?: string`  
  - `ApiV1DomainsDomainPutRequest` includes `alias?: string`

### 2. Data Provider Updates

- **Issue**: The provider was using a mix of the old API client and direct fetch calls for alias support
- **Solution**: Updated the provider to use the new API client consistently with proper alias parameters
- **Changes**:
  - Removed the `makeDirectApiCall` helper function
  - Updated all CRUD operations to use the generated client methods with alias parameters
  - Maintained backward compatibility for both old (`domain#alias`) and new (`domain?alias=alias`) ID formats

### 3. Unique ID Generation

- **Issue**: React-Admin requires unique IDs for each record, but domain names alone might not be unique when aliases are involved
- **Solution**: Created a unique ID format using `domain#alias` for alias entries and `domain` for non-alias entries
- **Implementation**: Updated the transformer to generate unique IDs

### 4. URL Handling

- **Issue**: React-Admin was encoding the `#` character as `%23` in URLs, causing ID mismatches
- **Solution**: Updated the provider to decode URL components and handle both encoded and decoded formats
- **Additional**: Updated list component to generate custom edit/delete links using the format `/admin/domains/{domain}?alias={alias}`

### 5. Edit Page Field Handling

- **Issue**: Domain and alias fields should be readonly on edit pages since they are used as identifiers
- **Solution**: Updated edit components to make domain and alias fields readonly

## Current Implementation

### ID Format
- **Alias entries**: `domain#alias` (e.g., `example.com#prod`)
- **Non-alias entries**: `domain` (e.g., `example.com`)

### API Calls
All API calls now use the generated client with proper alias support:
- `GET /api/v1/domains/{domain}?alias={alias}` - Get specific domain entry
- `PUT /api/v1/domains/{domain}?alias={alias}` - Update specific domain entry  
- `DELETE /api/v1/domains/{domain}?alias={alias}` - Delete specific domain entry

### URL Format
- **Edit links**: `/admin/domains/{domain}?alias={alias}` for alias entries
- **Delete links**: Same format as edit links

## Testing

The application should now correctly:
1. Display both domain and alias fields in the list view
2. Navigate to the correct edit page for alias entries
3. Load the correct domain entry data on edit pages
4. Make API calls with proper alias parameters
5. Handle CRUD operations for both alias and non-alias entries

## Files Modified

- `src/resources/domains/data-provider/client/` - Regenerated API client
- `src/resources/domains/data-provider/provider.ts` - Updated to use new client with alias support
- `src/resources/domains/data-provider/types.ts` - Updated import paths
- `src/resources/domains/components/list.tsx` - Updated to generate custom edit/delete links
- `src/resources/domains/components/edit.tsx` - Made domain and alias fields readonly
- `src/resources/domains/components/create.tsx` - Added alias field support
- `src/resources/domains/components/show.tsx` - Added alias field display 